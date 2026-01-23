import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { login, setStatus, STATUSES } from "../../../store/authSlice";
import Form from "./Login/Login";

const Login = () => {
  // Get auth state - now using accessToken instead of token
  const { user, status, accessToken, userId, error } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Handle form submission
  const handleLogin = (data) => {
    dispatch(login(data));
  };

  // Navigate to intended page or home on successful login
  useEffect(() => {
    if (status === STATUSES.SUCCESS && accessToken) {
      // Get the page user was trying to access before login
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
      dispatch(setStatus(STATUSES.IDLE)); // Reset to idle after navigation
    }
  }, [status, accessToken, navigate, dispatch, location]);

  // Format error for display
  const getErrorMessage = () => {
    if (!error) return null;
    
    // If error has validation errors, show the main message
    if (error.errors && typeof error.errors === 'object') {
      return error.message || "Please check the form for errors";
    }
    
    // If error is an object with message
    if (error.message) {
      return error.message;
    }
    
    // If error is a string
    if (typeof error === 'string') {
      return error;
    }
    
    return "Login failed. Please try again.";
  };

  // Get field-specific errors
  const getFieldErrors = () => {
    if (error && error.errors && typeof error.errors === 'object') {
      return error.errors;
    }
    return {};
  };

  return (
    <>
      <Form
        type="Login"
        user={user}
        onSubmit={handleLogin}
        error={status === STATUSES.ERROR ? getErrorMessage() : null}
        fieldErrors={getFieldErrors()}
      />
    </>
  );
};

export default Login;
