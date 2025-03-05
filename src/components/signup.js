import { useState, useEffect } from "react";
import { register, sendOtp, verifyOtp } from "../services/authService";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profileType, setProfileType] = useState("");

  // Additional fields for employer
  const [gst, setGst] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [pucName, setPucName] = useState("");
  const [pucEmail, setPucEmail] = useState("");
  const [pucPhone, setPucPhone] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard"); // Redirect to dashboard if already logged in
      return;
    }
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await register(email, name, mobile, profileType, gst, companyId, pucName, pucEmail, pucPhone);
      if (response.success) {
        setOtpSent(true);
        setMessage("OTP sent to your email.");
       

        
      } else {
        setMessage(response.message || "Failed to send OTP.");
      }
    } catch (error) {
      setMessage("Invalid email or email already exists.");
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Sign Up</h2>

        <form onSubmit={handleSendOtp}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <select
              value={profileType}
              onChange={(e) => setProfileType(e.target.value)}
              className="form-control"
              required
            >
              <option value="">Select Profile Type</option>
              <option value="user">Candidate</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {/* Additional fields for employer */}
          {profileType === "employer" && (
            <>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="GST ID"
                  value={gst}
                  onChange={(e) => setGst(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Company ID"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  placeholder="POC Name"
                  value={pucName}
                  onChange={(e) => setPucName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  placeholder="POC Email"
                  value={pucEmail}
                  onChange={(e) => setPucEmail(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="tel"
                  placeholder="POC Phone"
                  value={pucPhone}
                  onChange={(e) => setPucPhone(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="form-control"
            />
          </div>

          {message && <p className="text-center text-danger">{message}</p>}

          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? "Processing..." : "Send OTP"}
          </button>

          <p className="text-center mt-3">
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
