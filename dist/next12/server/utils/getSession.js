"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionWithRequest = void 0;
const authConfig_1 = require("../../../authConfig");
const getSessionWithRequest = (req, res) => {
    const cookieValue = req.cookies[authConfig_1.SESSION_NAME || 'session'];
    console.log('cookieValue', cookieValue);
    if (cookieValue === '' || cookieValue === undefined) {
        console.log('cookieValue is empty');
        // If cookieValue is an empty object, return undefined
        return undefined;
    }
    //let isTokenRefreshing: any = false; // Track token refresh status
    const { access_token, email, refresh_token } = JSON.parse(cookieValue || '');
    return { access_token, email, refresh_token };
    //return res.status(200).json({ session: { access_token, email, refresh_token } });
};
exports.getSessionWithRequest = getSessionWithRequest;
