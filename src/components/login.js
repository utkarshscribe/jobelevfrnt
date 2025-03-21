import React, { useState, useEffect } from "react";
import { sendOtp, verifyOtp, getUser } from "../services/authService"; // API Calls
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
   
      const token = localStorage.getItem("authToken");
      if (token) {
        navigate("/dashboard"); // Redirect to dashboard if already logged in
        return;
      }
  }, []);


  // Handle sending OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await sendOtp(email);
      if (response.success) {
        setOtpSent(true);
        setMessage("OTP sent to your email.");
      } else {
        setMessage(response.message || "Failed to send OTP.");
      }
    } catch (error) {
      setMessage("Error sending OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification & redirection
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await verifyOtp(email, otp);
      if (response.status) {
        localStorage.setItem("authToken", response.userToken); // Save token
        window.location.href = "/dashboard"; // Redirect to dashboard
      } else {
        setMessage(response.message || "Invalid OTP.");
      }
    } catch (error) {
      setMessage("Error verifying OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 bg-cover"
      style={{
        backgroundImage: "url('/assets/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card p-4 shadow-lg" style={{ width: "400px", backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
        <h2 className="text-center mb-4">Login</h2>

        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
              disabled={otpSent}
            />
          </div>

          {otpSent && (
            <div className="mb-3">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-control"
                required
              />
            </div>
          )}

          {message && <p className="text-center text-danger">{message}</p>}

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </form>

        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
