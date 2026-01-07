// src/hooks/useUserAuth.js
import { useEffect, useState, useCallback } from "react";
import { getUserDetails } from "../http/userDetail";

const STORAGE_KEYS = {
  token: "token",
  cachedUser: "cachedUser",
};

const useUserAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.token);
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Try cache first
      const cached = localStorage.getItem(STORAGE_KEYS.cachedUser);
      if (cached) {
        try {
          setUser(JSON.parse(cached));
          setIsLoading(false);
          return;
        } catch {
          localStorage.removeItem(STORAGE_KEYS.cachedUser);
        }
      }

      // Fetch from API
      try {
        const userData = await getUserDetails();
        setUser(userData);
        localStorage.setItem(
          STORAGE_KEYS.cachedUser,
          JSON.stringify(userData)
        );
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.cachedUser);
    setUser(null);
  }, []);

  return { user, isLoading, logout };
};

export default useUserAuth;
