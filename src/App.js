import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login.js";
import SignupPage from "./components/signup.js";
import UserDashboard from "./components/UserDashboard";
import Payment from "./components/Payment.js";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/dashboard/*" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
