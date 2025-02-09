import { useState } from "react";
import { register, sendOtp, verifyOtp } from "../services/authService";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await register(email, name, mobile);
      if (response.success) {
        setOtpSent(true);
        setMessage("OTP sent to your email.");
        localStorage.setItem("authToken", response.userToken);
        window.location.href = "/dashboard";
      } else {
        setMessage(response.message || "Failed to send OTP.");
      }
    } catch (error) {
      setMessage("Invalid email or email already exists.");
      console.log(error.response)
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await verifyOtp(email, otp);
      if (response.status) {
        setMessage("Signup successful!");
        alert("Signup successful!");
      } else {
        setMessage(response.message || "Invalid OTP.");
      }
    } catch (error) {
      setMessage("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Sign Up</h2>

        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
              disabled={otpSent}
            />
          </div>

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

          <div className="mb-3">
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="form-control"
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

          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
          </button>

          <p className="text-center mt-3">
            Already have an account? <Link to="/loginup">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
