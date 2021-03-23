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
const express_1 = require("express");
const express_session_1 = __importDefault(require("express-session"));
const async_handler_1 = __importDefault(require("../utils/async-handler"));
const joi_1 = __importDefault(require("joi"));
const grant_1 = __importDefault(require("grant"));
const get_email_from_profile_1 = __importDefault(require("../utils/get-email-from-profile"));
const invalid_payload_1 = require("../exceptions/invalid-payload");
const ms_1 = __importDefault(require("ms"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = __importDefault(require("../env"));
const services_1 = require("../services");
const grant_2 = __importDefault(require("../grant"));
const exceptions_1 = require("../exceptions");
const respond_1 = require("../middleware/respond");
const to_array_1 = require("../utils/to-array");
const router = express_1.Router();
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    mode: joi_1.default.string().valid('cookie', 'json'),
    otp: joi_1.default.string(),
}).unknown();
router.post('/login', async_handler_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const accountability = {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        role: null,
    };
    const authenticationService = new services_1.AuthenticationService({
        accountability: accountability,
        schema: req.schema,
    });
    const { error } = loginSchema.validate(req.body);
    if (error)
        throw new invalid_payload_1.InvalidPayloadException(error.message);
    const mode = req.body.mode || 'json';
    const ip = req.ip;
    const userAgent = req.get('user-agent');
    const { accessToken, refreshToken, expires } = yield authenticationService.authenticate(Object.assign(Object.assign({}, req.body), { ip,
        userAgent }));
    const payload = {
        data: { access_token: accessToken, expires },
    };
    if (mode === 'json') {
        payload.data.refresh_token = refreshToken;
    }
    if (mode === 'cookie') {
        res.cookie('directus_refresh_token', refreshToken, {
            httpOnly: true,
            domain: env_1.default.REFRESH_TOKEN_COOKIE_DOMAIN,
            maxAge: ms_1.default(env_1.default.REFRESH_TOKEN_TTL),
            secure: (_a = env_1.default.REFRESH_TOKEN_COOKIE_SECURE) !== null && _a !== void 0 ? _a : false,
            sameSite: env_1.default.REFRESH_TOKEN_COOKIE_SAME_SITE || 'strict',
        });
    }
    res.locals.payload = payload;
    return next();
})), respond_1.respond);
router.post('/refresh', cookie_parser_1.default(), async_handler_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const accountability = {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        role: null,
    };
    const authenticationService = new services_1.AuthenticationService({
        accountability: accountability,
        schema: req.schema,
    });
    const currentRefreshToken = req.body.refresh_token || req.cookies.directus_refresh_token;
    if (!currentRefreshToken) {
        throw new invalid_payload_1.InvalidPayloadException(`"refresh_token" is required in either the JSON payload or Cookie`);
    }
    const mode = req.body.mode || (req.body.refresh_token ? 'json' : 'cookie');
    const { accessToken, refreshToken, expires } = yield authenticationService.refresh(currentRefreshToken);
    const payload = {
        data: { access_token: accessToken, expires },
    };
    if (mode === 'json') {
        payload.data.refresh_token = refreshToken;
    }
    if (mode === 'cookie') {
        res.cookie('directus_refresh_token', refreshToken, {
            httpOnly: true,
            domain: env_1.default.REFRESH_TOKEN_COOKIE_DOMAIN,
            maxAge: ms_1.default(env_1.default.REFRESH_TOKEN_TTL),
            secure: (_b = env_1.default.REFRESH_TOKEN_COOKIE_SECURE) !== null && _b !== void 0 ? _b : false,
            sameSite: env_1.default.REFRESH_TOKEN_COOKIE_SAME_SITE || 'strict',
        });
    }
    res.locals.payload = payload;
    return next();
})), respond_1.respond);
router.post('/logout', cookie_parser_1.default(), async_handler_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accountability = {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        role: null,
    };
    const authenticationService = new services_1.AuthenticationService({
        accountability: accountability,
        schema: req.schema,
    });
    const currentRefreshToken = req.body.refresh_token || req.cookies.directus_refresh_token;
    if (!currentRefreshToken) {
        throw new invalid_payload_1.InvalidPayloadException(`"refresh_token" is required in either the JSON payload or Cookie`);
    }
    yield authenticationService.logout(currentRefreshToken);
    return next();
})), respond_1.respond);
router.post('/password/request', async_handler_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email) {
        throw new invalid_payload_1.InvalidPayloadException(`"email" field is required.`);
    }
    const accountability = {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        role: null,
    };
    const service = new services_1.UsersService({ accountability, schema: req.schema });
    try {
        yield service.requestPasswordReset(req.body.email, req.body.reset_url || null);
        return next();
    }
    catch (err) {
        if (err instanceof invalid_payload_1.InvalidPayloadException) {
            throw err;
        }
        else {
            return next();
        }
    }
})), respond_1.respond);
router.post('/password/reset', async_handler_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.token) {
        throw new invalid_payload_1.InvalidPayloadException(`"token" field is required.`);
    }
    if (!req.body.password) {
        throw new invalid_payload_1.InvalidPayloadException(`"password" field is required.`);
    }
    const accountability = {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        role: null,
    };
    const service = new services_1.UsersService({ accountability, schema: req.schema });
    yield service.resetPassword(req.body.token, req.body.password);
    return next();
})), respond_1.respond);
router.get('/oauth', async_handler_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const providers = to_array_1.toArray(env_1.default.OAUTH_PROVIDERS);
    res.locals.payload = { data: env_1.default.OAUTH_PROVIDERS ? providers : null };
    return next();
})), respond_1.respond);
router.use('/oauth', express_session_1.default({ secret: env_1.default.SECRET, saveUninitialized: false, resave: false }));
router.get('/oauth/:provider', async_handler_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const config = Object.assign({}, grant_2.default);
    delete config.defaults;
    const availableProviders = Object.keys(config);
    if (availableProviders.includes(req.params.provider) === false) {
        throw new exceptions_1.RouteNotFoundException(`/auth/oauth/${req.params.provider}`);
    }
    if (((_c = req.query) === null || _c === void 0 ? void 0 : _c.redirect) && req.session) {
        req.session.redirect = req.query.redirect;
    }
    next();
})));
router.use(grant_1.default.express()(grant_2.default));
router.get('/oauth/:provider/callback', async_handler_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    const redirect = req.session.redirect;
    const accountability = {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        role: null,
    };
    const authenticationService = new services_1.AuthenticationService({
        accountability: accountability,
        schema: req.schema,
    });
    const userService = new services_1.UsersService({ schema: req.schema });
    const email = get_email_from_profile_1.default(req.params.provider, (_d = req.session.grant.response) === null || _d === void 0 ? void 0 : _d.profile);
    (_e = req.session) === null || _e === void 0 ? void 0 : _e.destroy(() => { });



    const accountExists = yield userService.emailHasAccount(email);
    if (!accountExists && req.params.provider === 'osu') {
        yield userService.create({
            location: _d.profile.country.name,
            first_name: _d.profile.username,
            email,
            status: 'active'
        });
    }



    const { accessToken, refreshToken, expires } = yield authenticationService.authenticate({
        email,
    });
    if (redirect) {
        res.cookie('directus_refresh_token', refreshToken, {
            httpOnly: true,
            domain: env_1.default.REFRESH_TOKEN_COOKIE_DOMAIN,
            maxAge: ms_1.default(env_1.default.REFRESH_TOKEN_TTL),
            secure: (_f = env_1.default.REFRESH_TOKEN_COOKIE_SECURE) !== null && _f !== void 0 ? _f : false,
            sameSite: env_1.default.REFRESH_TOKEN_COOKIE_SAME_SITE || 'strict',
        });
        return res.redirect(redirect);
    }
    else {
        res.locals.payload = {
            data: { access_token: accessToken, refresh_token: refreshToken, expires },
        };
        return next();
    }
})), respond_1.respond);
exports.default = router;
