"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const authentication_1 = require("./authentication");
const items_1 = require("./items");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_1 = require("../mail");
const database_1 = __importDefault(require("../database"));
const argon2_1 = __importDefault(require("argon2"));
const exceptions_1 = require("../exceptions");
const env_1 = __importDefault(require("../env"));
const cache_1 = __importDefault(require("../cache"));
const to_array_1 = require("../utils/to-array");
class UsersService extends items_1.ItemsService {
    constructor(options) {
        super('directus_users', options);
        this.knex = options.knex || database_1.default;
        this.accountability = options.accountability || null;
        this.service = new items_1.ItemsService('directus_users', options);
        this.schema = options.schema;
    }
    update(data, key) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * @NOTE
             * This is just an extra bit of hardcoded security. We don't want anybody to be able to disable 2fa through
             * the regular /users endpoint. Period. You should only be able to manage the 2fa status through the /tfa endpoint.
             */
            const payloads = to_array_1.toArray(data);
            for (const payload of payloads) {
                if (payload.hasOwnProperty('tfa_secret')) {
                    throw new exceptions_1.InvalidPayloadException(`You can't change the tfa_secret manually.`);
                }
            }
            if (cache_1.default && env_1.default.CACHE_AUTO_PURGE) {
                yield cache_1.default.clear();
            }
            return this.service.update(data, key);
        });
    }
    delete(key) {
        const _super = Object.create(null, {
            delete: { get: () => super.delete }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const keys = to_array_1.toArray(key);
            // Make sure there's at least one admin user left after this deletion is done
            const otherAdminUsers = yield this.knex
                .count('*', { as: 'count' })
                .from('directus_users')
                .whereNotIn('directus_users.id', keys)
                .andWhere({ 'directus_roles.admin_access': true })
                .leftJoin('directus_roles', 'directus_users.role', 'directus_roles.id')
                .first();
            const otherAdminUsersCount = +((otherAdminUsers === null || otherAdminUsers === void 0 ? void 0 : otherAdminUsers.count) || 0);
            if (otherAdminUsersCount === 0) {
                throw new exceptions_1.UnprocessableEntityException(`You can't delete the last admin user.`);
            }
            yield _super.delete.call(this, keys);
            return key;
        });
    }
    inviteUser(email, role, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const emails = to_array_1.toArray(email);
            const urlWhitelist = to_array_1.toArray(env_1.default.USER_INVITE_URL_ALLOW_LIST);
            if (url && urlWhitelist.includes(url) === false) {
                throw new exceptions_1.InvalidPayloadException(`Url "${url}" can't be used to invite users.`);
            }
            for (const email of emails) {
                yield this.service.create({ email, role, status: 'invited' });
                const payload = { email, scope: 'invite' };
                const token = jsonwebtoken_1.default.sign(payload, env_1.default.SECRET, { expiresIn: '7d' });
                const inviteURL = url !== null && url !== void 0 ? url : env_1.default.PUBLIC_URL + '/admin/accept-invite';
                const acceptURL = inviteURL + '?token=' + token;
                yield mail_1.sendInviteMail(email, acceptURL);
            }
        });
    }
    acceptInvite(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, scope } = jsonwebtoken_1.default.verify(token, env_1.default.SECRET);
            if (scope !== 'invite')
                throw new exceptions_1.ForbiddenException();
            const user = yield this.knex.select('id', 'status').from('directus_users').where({ email }).first();
            if (!user || user.status !== 'invited') {
                throw new exceptions_1.InvalidPayloadException(`Email address ${email} hasn't been invited.`);
            }
            const passwordHashed = yield argon2_1.default.hash(password);
            yield this.knex('directus_users').update({ password: passwordHashed, status: 'active' }).where({ id: user.id });
            if (cache_1.default && env_1.default.CACHE_AUTO_PURGE) {
                yield cache_1.default.clear();
            }
        });
    }
    requestPasswordReset(email, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.knex.select('id').from('directus_users').where({ email }).first();
            if (!user)
                throw new exceptions_1.ForbiddenException();
            const payload = { email, scope: 'password-reset' };
            const token = jsonwebtoken_1.default.sign(payload, env_1.default.SECRET, { expiresIn: '1d' });
            const urlWhitelist = to_array_1.toArray(env_1.default.PASSWORD_RESET_URL_ALLOW_LIST);
            if (url && urlWhitelist.includes(url) === false) {
                throw new exceptions_1.InvalidPayloadException(`Url "${url}" can't be used to reset passwords.`);
            }
            const acceptURL = url ? `${url}?token=${token}` : `${env_1.default.PUBLIC_URL}/admin/reset-password?token=${token}`;
            yield mail_1.sendPasswordResetMail(email, acceptURL);
        });
    }
    resetPassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, scope } = jsonwebtoken_1.default.verify(token, env_1.default.SECRET);
            if (scope !== 'password-reset')
                throw new exceptions_1.ForbiddenException();
            const user = yield this.knex.select('id', 'status').from('directus_users').where({ email }).first();
            if (!user || user.status !== 'active') {
                throw new exceptions_1.ForbiddenException();
            }
            const passwordHashed = yield argon2_1.default.hash(password);
            yield this.knex('directus_users').update({ password: passwordHashed, status: 'active' }).where({ id: user.id });
            if (cache_1.default && env_1.default.CACHE_AUTO_PURGE) {
                yield cache_1.default.clear();
            }
        });
    }
    enableTFA(pk) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.knex.select('tfa_secret').from('directus_users').where({ id: pk }).first();
            if ((user === null || user === void 0 ? void 0 : user.tfa_secret) !== null) {
                throw new exceptions_1.InvalidPayloadException('TFA Secret is already set for this user');
            }
            const authService = new authentication_1.AuthenticationService({
                knex: this.knex,
                schema: this.schema,
                accountability: this.accountability,
            });
            const secret = authService.generateTFASecret();
            yield this.knex('directus_users').update({ tfa_secret: secret }).where({ id: pk });
            return {
                secret,
                url: yield authService.generateOTPAuthURL(pk, secret),
            };
        });
    }
    disableTFA(pk) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.knex('directus_users').update({ tfa_secret: null }).where({ id: pk });
        });
    }








    emailHasAccount(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.knex('directus_users').where({ email }).first();
            return !!user;
        });
    }







    
}
exports.UsersService = UsersService;
