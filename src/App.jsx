import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Register/userlogin";
import StepRegister from "./pages/Register/Register";
import { Provider } from "react-redux";
import store from "../store/store";
import StepOTP from "./pages/Register/StepOTP";

function App() {
  return (
        <Provider store={store}>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<StepRegister />} />
<Route path="/verify-otp" element={<StepOTP/>}/>
        {/* Protected Route */}
        <Route path="/" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
        </Provider>

  );
}

export default App;
