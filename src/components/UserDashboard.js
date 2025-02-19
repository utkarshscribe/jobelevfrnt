import React, { useState, useEffect } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Ensure Bootstrap Icons CSS is imported
import MyResume from "./dashboard/MyResume.js";
import UserComplaints from "./dashboard/UserComplaints.js";
import UserJobs from "./dashboard/UserJobs.js";
import { getUser } from "../services/authService.js";
import JobUpload from "./admin/JobUpload";
import AdminComplaints from "./admin/AdminComplaints";
//import ResumeDetails from "./admin/ResumeDetails";
import HireForMe from "./dashboard/HireForMe";
import HireMe from "./admin/HireMe";
import Resume from "./ResumeBuilder.js";

const UserDashboard = () => {
  const navigate = useNavigate(); // Hook to navigate between pages

  const [role, setrole] = useState("user");

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token from storage
    navigate("/"); // Redirect to login page
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/"); 
        return;
      }

      try {
        const response = await getUser(token);
          setrole(response?.data?.profileType); 
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    checkAuth();
  }, []);

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <aside className="bg-dark text-white p-4" style={{ width: "250px" }}>
        <div className="mb-5 text-center">
          <h4 className="fw-bold">{capitalizeFirstLetter(role) } Dashboard</h4>
        </div>
        <ul className="nav flex-column">
          {role === "user" && (
            <li className="nav-item mb-3">
              <NavLink
                to="/dashboard/resume"
                className={({ isActive }) =>
                  "nav-link d-flex align-items-center px-3 py-2 rounded " +
                  (isActive ? "bg-primary text-white" : "text-white-50")
                }
              >
                <i className="bi bi-file-earmark-person me-2"></i>
                My Resume
              </NavLink>
            </li>
          )}
          {role !== "employer" && (
            <li className="nav-item mb-3">
              <NavLink
                to="/dashboard/jobs"
                className={({ isActive }) =>
                  "nav-link d-flex align-items-center px-3 py-2 rounded " +
                  (isActive ? "bg-primary text-white" : "text-white-50")
                }
              >
                <i className="bi bi-briefcase me-2"></i>
                Jobs
              </NavLink>
            </li>
          )}
          {role !== "user" && (
            <li className="nav-item mb-3">
              <NavLink
                to="/dashboard/resumes"
                className={({ isActive }) =>
                  "nav-link d-flex align-items-center px-3 py-2 rounded " +
                  (isActive ? "bg-primary text-white" : "text-white-50")
                }
              >
                <i className="bi bi-briefcase me-2"></i>
                All Resume
              </NavLink>
            </li>
          )}

          {role !== "user" && (
            <li className="nav-item">
              <NavLink
                to="/dashboard/job"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center px-3 py-2 rounded ${
                    isActive ? "bg-primary text-white" : "text-white-50"
                  }`
                }
              >
                <i className="bi bi-upload me-2"></i>
                Job Upload
              </NavLink>
            </li>
          )}
          {role === "admin" ? (
            <li className="nav-item">
              <NavLink
                to="/dashboard/complaints"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center px-3 py-2 rounded ${
                    isActive ? "bg-primary text-white" : "text-white-50"
                  }`
                }
              >
                <i className="bi bi-exclamation-circle me-2"></i>
                Complaints
              </NavLink>
            </li>
          ) : (
            <li className="nav-item mb-3">
              <NavLink
                to="/dashboard/complaint"
                className={({ isActive }) =>
                  "nav-link d-flex align-items-center px-3 py-2 rounded " +
                  (isActive ? "bg-primary text-white" : "text-white-50")
                }
              >
                <i className="bi bi-exclamation-circle me-2"></i>
                Complaints
              </NavLink>
            </li>
          )}
          {role === "admin" ? (
            <li className="nav-item">
              <NavLink
                to="/dashboard/hiremes"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center px-3 py-2 rounded ${
                    isActive ? "bg-primary text-white" : "text-white-50"
                  }`
                }
              >
                <i className="bi bi-exclamation-circle me-2"></i>
                Hire Me
              </NavLink>
            </li>
          ) : (
            <li className="nav-item mb-3">
              <NavLink
                to="/dashboard/hireme"
                className={({ isActive }) =>
                  "nav-link d-flex align-items-center px-3 py-2 rounded " +
                  (isActive ? "bg-primary text-white" : "text-white-50")
                }
              >
                <i className="bi bi-exclamation-circle me-2"></i>
                Hire For Me
              </NavLink>
            </li>
          )}
        </ul>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow-1">
        {/* Top Header */}
        <header className="bg-light border-bottom shadow-sm py-3">
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <h2 className="mb-0">{capitalizeFirstLetter (role)} Dashboard</h2>
            <div>
              {/* Profile or logout button */}
              <button
                className="btn btn-outline-secondary"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i> Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <main className="p-4">
          <div className="container">
            <div className="card shadow-sm">
              <div className="card-body">
                <Routes>
                  
                  <Route path="job" element={<JobUpload />} />
                  <Route path="complaints" element={<AdminComplaints />} />
                  <Route path="hireme" element={<HireForMe />} />
                  <Route path="hiremes" element={<HireMe />} />
                  <Route path="resume" element={<MyResume />} />
                  <Route path="complaint" element={<UserComplaints />} />
                  <Route path="jobs" element={<UserJobs />} />
                  <Route path="resumes" element={<Resume />} />
                  
                </Routes>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
