"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJwt = exports.base64Decode = exports.base64Url = void 0;
const base64Url = (str) => {
    return str.replace(/-/g, '+').replace(/_/g, '/');
};
exports.base64Url = base64Url;
const base64Decode = (str) => {
    return Buffer.from(str, 'base64').toString('utf-8');
};
exports.base64Decode = base64Decode;
const parseJwt = (token) => {
    if (!token)
        return null;
    const [, payload] = token.split('.');
    if (!payload)
        return null;
    const decodedPayload = (0, exports.base64Decode)((0, exports.base64Url)(payload));
    try {
        return JSON.parse(decodedPayload);
    }
    catch (error) {
        console.error('Failed to parse JWT payload:', error);
        return null;
    }
};
exports.parseJwt = parseJwt;
