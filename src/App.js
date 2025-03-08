import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login.js";
import SignupPage from "./components/signup.js";
import UserDashboard from "./components/UserDashboard";
import Payment from "./components/Payment.js";
import Resume from "./components/Resume.js";
//import BulkUser from "./components/BulkUser.js";
//import AlluserDetails from "./components/AlluserDetails.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/payment/:profileType" element={<Payment />} />
        <Route path="/viewresume/:id" element={<Resume />} /> 
        <Route path="/dashboard/*" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
