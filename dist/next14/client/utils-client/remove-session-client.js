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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSession = void 0;
const removeSession = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('remove session');
    try {
        const removeSessionRoute = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/remove-token`;
        const response = yield fetch(removeSessionRoute, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (response.ok) {
            console.log("removed Cookies");
        }
        throw new Error('Failed to remove Cookie');
    }
    catch (error) {
        console.error('Error on remove Cookie:', error);
        return null;
    }
});
exports.removeSession = removeSession;
