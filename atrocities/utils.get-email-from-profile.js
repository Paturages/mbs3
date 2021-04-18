"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const env_1 = __importDefault(require("../env"));
const exceptions_1 = require("../exceptions");
// The path in JSON to fetch the email address from the profile.
// Note: a lot of services use `email` as the path. We fall back to that as default, so no need to
// map it here
const profileMap = {};
/**
 * Extract the email address from a given user profile coming from a providers API
 *
 * Falls back to OAUTH_<PROVIDER>_PROFILE_EMAIL if we don't have it preconfigured yet, and defaults
 * to `email` if nothing is set
 *
 * This is used in the SSO flow to extract the users
 */
function getEmailFromProfile(provider, profile) {
    const path = profileMap[provider] || env_1.default[`OAUTH_${provider.toUpperCase()}_PROFILE_EMAIL`] || 'email';
    const email = lodash_1.get(profile, path);
    if (!email) {
        throw new exceptions_1.ServiceUnavailableException("Couldn't extract email address from SSO provider response", {
            service: 'oauth',
            provider,
        });
    }
    return String(email);
}
exports.default = getEmailFromProfile;
