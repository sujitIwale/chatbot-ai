import { API_URL } from "../../constants/api";

export const loginWithGoogle = async () => {
    window.location.href = `${API_URL || 'http://localhost:3001'}/auth/google`;
};

export const handleGoogleAuthCallback = (token: string) => {
    localStorage.setItem("token", token);
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const logout = () => {
    localStorage.removeItem("token");
    window.location.href = '/login';
};

export const isAuthenticated = () => {
    return !!getToken();
};