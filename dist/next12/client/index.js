"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthNext12 = exports.AuthProviderNext12 = void 0;
var AuthProviderNext12_1 = require("./providers/AuthProviderNext12");
Object.defineProperty(exports, "AuthProviderNext12", { enumerable: true, get: function () { return AuthProviderNext12_1.AuthProviderNext12; } });
Object.defineProperty(exports, "useAuthNext12", { enumerable: true, get: function () { return AuthProviderNext12_1.useAuthNext12; } });
__exportStar(require("./utils-client"), exports);
