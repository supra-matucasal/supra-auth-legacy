"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
var AuthProvider_1 = require("./AuthProvider");
Object.defineProperty(exports, "AuthProvider", { enumerable: true, get: function () { return __importDefault(AuthProvider_1).default; } });
Object.defineProperty(exports, "useAuth", { enumerable: true, get: function () { return AuthProvider_1.useAuth; } });
