import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login.js";
import SignupPage from "./components/signup.js";
import UserDashboard from "./components/UserDashboard";

import ResumeDetails from "./components/admin/ResumeDetails.js";
import JobUpload from "./components/admin/JobUpload.js";
import AdminComplaints from "./components/admin/AdminComplaints.js";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard/*" element={<UserDashboard />} />
       
        <Route path="/admin/resume/:id" element={<ResumeDetails />} />
        <Route path="/admin/jobs" element={<JobUpload />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        
      </Routes>
    </Router>
  );
}

export default App;
