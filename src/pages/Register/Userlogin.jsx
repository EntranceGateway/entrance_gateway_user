import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, setStatus, STATUSES } from "../../../store/authSlice";
import Form from "./Login/Login";

const Login = () => {
  // Get auth state - now using accessToken instead of token
  const { user, status, accessToken, userId, error } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle form submission
  const handleLogin = (data) => {
    dispatch(login(data));
  };

  // Navigate to home on successful login
  useEffect(() => {
    if (status === STATUSES.SUCCESS && accessToken) {
      navigate("/", { replace: true });
      dispatch(setStatus(STATUSES.IDLE)); // Reset to idle after navigation
    }
  }, [status, accessToken, navigate, dispatch]);

  return (
    <>
      <Form
        type="Login"
        user={user}
        onSubmit={handleLogin}
        error={status === STATUSES.ERROR ? error : null}
      />
    </>
  );
};

export default Login;
