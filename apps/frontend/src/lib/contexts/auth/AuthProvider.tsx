import { useEffect } from "react";
import { useState } from "react";
import AuthContext from "./AuthContext";
import {
  getToken,
  handleGoogleAuthCallback,
  tryLogout,
} from "../../utils/auth";
import { userApi } from "../../api/user";
import { authApi } from "../../api/auth";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        if (!getToken()) {
          setLoading(false);
          return;
        }
        console.log("fetching user");
        const response = await userApi.getUser();
        setUser(response);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        tryLogout();
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");

    if (token) {
      console.log("setting token auth provider", token);
      handleGoogleAuthCallback(token);
    }

    fetchUser();
  }, []);

  const logout = async () => {
    await authApi.logout().finally(() => {
      setIsAuthenticated(false);
      tryLogout();
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
