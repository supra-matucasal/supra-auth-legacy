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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.useAuthNext12 = exports.AuthProviderNext12 = void 0;
const react_1 = __importStar(require("react"));
const utils_client_1 = require("../utils-client");
const shared_1 = require("../../../shared");
const AuthContext = (0, react_1.createContext)(undefined);
const AuthProviderNext12 = ({ children, initialSession, }) => {
    const [session, setSession] = (0, react_1.useState)(initialSession || { access_token: null, refresh_token: null });
    const [userData, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const refreshTokens = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
        if (!refreshToken)
            return null;
        try {
            const response = yield fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${refreshToken}`,
                },
                credentials: 'include',
            });
            if (response.ok) {
                const data = yield response.json();
                return { access_token: data.access_token, refresh_token: data.refresh_token };
            }
            throw new Error('Failed to refresh tokens');
        }
        catch (error) {
            console.error('Error refreshing tokens:', error);
            return null;
        }
    });
    const checkSession = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!session.access_token)
            return;
        const user = yield getUserByToken(session.access_token);
        if (!user) {
            yield (0, utils_client_1.removeSession)();
            return;
        }
        const decoded = (0, shared_1.parseJwt)(session.access_token);
        const expiry = decoded.exp;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (expiry < currentTimestamp) {
            const refreshedTokens = yield refreshTokens(session.refresh_token);
            if (refreshedTokens) {
                setSession(refreshedTokens);
                setUser({
                    accessToken: refreshedTokens.access_token,
                    refreshToken: refreshedTokens.refresh_token,
                    id: decoded.id,
                });
            }
            else {
                setUser(null);
            }
        }
        else {
            setUser({
                accessToken: session.access_token,
                refreshToken: session.refresh_token,
                id: decoded.id,
            });
        }
        setLoading(false);
    });
    const getUserInfo = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/supra-auth-user?user_id=${userId}`, {
            method: 'GET',
            credentials: 'include',
        });
        const data = yield response.json();
        return data;
    });
    const getUserByToken = (access_token) => __awaiter(void 0, void 0, void 0, function* () {
        if (!access_token)
            return null;
        try {
            const response = yield fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
                credentials: 'include',
            });
            if (response.ok) {
                return yield response.json();
            }
            throw new Error('Failed to fetch user by token');
        }
        catch (error) {
            console.error('Error fetching user by token:', error);
            return null;
        }
    });
    const login = () => '/api/auth/login';
    const logout = () => '/api/auth/logout';
    (0, react_1.useEffect)(() => {
        checkSession();
        const interval = setInterval(() => {
            checkSession();
        }, 60000);
        return () => clearInterval(interval);
    }, [session]);
    (0, react_1.useEffect)(() => {
        function fetchData() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('Fetching data...');
                try {
                    // const response = await fetch(`http://localhost:3000/api/auth/getToken`, {
                    //   method: 'GET', // or 'POST' depending on the API
                    //   headers: {
                    //     'Content-Type': 'application/json',
                    //   },
                    // });
                    // const data = await response.json();
                    //const decoded = parseJwt(session.access_token);
                    const sessionInFetchData = yield (0, utils_client_1.getSessionClient)();
                    console.log('Session in fetch data:', sessionInFetchData);
                    if (sessionInFetchData && sessionInFetchData.access_token) {
                        //const decodedInFetchData = parseJwt(sessionInFetchData.access_token);
                        //console.log('Setting user data in fetch data:', decodedInFetchData);
                        //setUser(decodedInFetchData);
                        console.log('Setting this sessioN:', sessionInFetchData);
                        setSession(sessionInFetchData);
                    }
                }
                catch (error) {
                    console.error('Error fetching data:', error);
                }
            });
        }
        console.log('Initial fetch in provider...');
        console.log('Session: ', session);
        console.log('Session access token: ', session.access_token);
        if (session.access_token === null) {
            console.log('No access token available, doing fetch data.');
            fetchData();
        }
    }, []);
    return (react_1.default.createElement(AuthContext.Provider, { value: { userData, checkSession, getUserInfo, loading, getUserByToken, login, logout } }, children));
};
exports.AuthProviderNext12 = AuthProviderNext12;
const useAuthNext12 = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
exports.useAuthNext12 = useAuthNext12;
//export default AuthProvider;
