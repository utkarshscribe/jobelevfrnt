import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState(""); // Mobile is collected but not used for login
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = (e) => {
    e.preventDefault();
    console.log("Sending OTP to Email:", email);
    setOtpSent(true); // Simulating OTP sent
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    console.log("Verifying OTP:", otp);
    alert("Signup successful!"); // Simulating successful signup
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Sign Up</h2>

        <form onSubmit={otpSent ? verifyOtp : sendOtp}>
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

          <button type="submit" className="btn btn-success w-100">
            {otpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
