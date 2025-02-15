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
import ResumeDetails from "./admin/ResumeDetails";
import Resume from "./ResumeBuilder.js";

const UserDashboard = () => {
  const navigate = useNavigate(); // Hook to navigate between pages
  
  const [isAdmin, setisAdmin] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token from storage
    navigate("/"); // Redirect to login page
  };
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/");  // Redirect to home or login page if no token
        return;
      }
      
      try {

        const response = await getUser(token);
        console.log(response); // This will log the response
        if (response?.data?.profileType === "admin") {
          setisAdmin(true);  // Set the isAdmin state if the user is an admin
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } 
    checkAuth();
    
  },[]);
  

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      
      <aside className="bg-dark text-white p-4" style={{ width: "250px" }}>
        <div className="mb-5 text-center">
          <h4 className="fw-bold">{isAdmin?'Admin':"User"} Dashboard</h4>
        </div>
        {!isAdmin?
        (<ul className="nav flex-column">
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
          <li className="nav-item mb-3">
            <NavLink
              to="/dashboard/resumes"
              className={({ isActive }) =>
                "nav-link d-flex align-items-center px-3 py-2 rounded " +
                (isActive ? "bg-primary text-white" : "text-white-50")
              }
            >
              <i className="bi bi-briefcase me-2"></i>
              Resume
            </NavLink>
          </li>
        </ul>):
        
        (<ul className="nav flex-column">
          <li className="nav-item">
            <NavLink
              to="/admin/resume/:id"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center px-3 py-2 rounded ${
                  isActive ? "bg-primary text-white" : "text-white-50"
                }`
              }
            >
              <i className="bi bi-file-earmark-person me-2"></i>
              Resume Details
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/jobs"
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
          <li className="nav-item">
            <NavLink
              to="/admin/complaints"
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
        </ul>)
        }
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow-1">
        {/* Top Header */}
        <header className="bg-light border-bottom shadow-sm py-3">
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <h2 className="mb-0">{isAdmin?'Admin':"User"} Dashboard</h2>
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
              {isAdmin ? (
                <>
                  <Route path="resumes" element={<ResumeDetails />} />
                  <Route path="jobs" element={<JobUpload />} />
                  <Route path="complaints" element={<AdminComplaints />} />
                  
                  <Route path="*" element={<ResumeDetails />} />
                </>
              ) : (
                <>
                  <Route path="resume" element={<MyResume />} />
                  <Route path="complaints" element={<UserComplaints />} />
                  <Route path="jobs" element={<UserJobs />} />
                  <Route path="resumes" element={<Resume />} />
                  <Route path="*" element={<MyResume />} />
                </>
              )}
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
