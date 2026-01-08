// src/hooks/useUserAuth.js
import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserDetails } from "../http/userDetail";
import { logout as logoutAction, STATUSES } from "../../store/authSlice";

const STORAGE_KEYS = {
  refreshToken: "refreshToken", // Updated to use new token key
  cachedUser: "cachedUser",
};

const useUserAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const dispatch = useDispatch();
  // Get auth state from Redux to know when session is restored
  const { accessToken, status } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadUser = async () => {
      // Check if we have a refresh token (session exists)
      const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
      
      // No session - don't try to load user
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }

      // Wait for auth initialization to complete before making API calls
      // If status is LOADING, the session is being restored
      if (status === STATUSES.LOADING) {
        return; // Will re-run when status changes
      }

      // If no access token after initialization, session restore failed
      if (!accessToken && status !== STATUSES.LOADING) {
        setIsLoading(false);
        return;
      }

      // Try cache first for faster UI
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

      // Fetch fresh user data from API
      try {
        const userData = await getUserDetails();
        setUser(userData);
        localStorage.setItem(
          STORAGE_KEYS.cachedUser,
          JSON.stringify(userData)
        );
      } catch (err) {
        console.error("Failed to fetch user:", err);
        // Don't clear user on error - might be network issue
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [accessToken, status]); // Re-run when auth state changes

  // Logout function - uses Redux action
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.cachedUser);
    setUser(null);
    dispatch(logoutAction());
  }, [dispatch]);

  return { user, isLoading, logout };
};

export default useUserAuth;
