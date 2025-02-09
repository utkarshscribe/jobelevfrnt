import React, { useEffect } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Ensure Bootstrap Icons CSS is imported
import MyResume from "./dashboard/MyResume.js";
import UserComplaints from "./dashboard/UserComplaints.js";
import UserJobs from "./dashboard/UserJobs.js";

const UserDashboard = () => {
  const navigate = useNavigate(); // Hook to navigate between pages

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token from storage
    navigate("/"); // Redirect to login page
  };
  
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/"); 
    }
  }, [] )
  

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      
      <aside className="bg-dark text-white p-4" style={{ width: "250px" }}>
        <div className="mb-5 text-center">
          <h4 className="fw-bold">Dashboard</h4>
        </div>
        <ul className="nav flex-column">
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
          <li className="nav-item mb-3">
            <NavLink
              to="/dashboard/complaints"
              className={({ isActive }) =>
                "nav-link d-flex align-items-center px-3 py-2 rounded " +
                (isActive ? "bg-primary text-white" : "text-white-50")
              }
            >
              <i className="bi bi-exclamation-circle me-2"></i>
              Complaints
            </NavLink>
          </li>
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
        </ul>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow-1">
        {/* Top Header */}
        <header className="bg-light border-bottom shadow-sm py-3">
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <h2 className="mb-0">User Dashboard</h2>
            <div>
              {/* Profile or logout button */}
              <button className="btn btn-outline-secondary" onClick={handleLogout}>
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
                  <Route path="resume" element={<MyResume />} />
                  <Route path="complaints" element={<UserComplaints />} />
                  <Route path="jobs" element={<UserJobs />} />
                  {/* Default Route */}
                  <Route path="*" element={<MyResume />} />
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
