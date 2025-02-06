import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login.js";
import SignupPage from "./components/signup.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/loginup" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
