import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const Sidebar = () => {
  return (
    <aside className="bg-dark text-white p-3" style={{ width: "250px", minHeight: "100vh" }}>
      <h4 className="text-center fw-bold">Admin Panel</h4>
      <ul className="nav flex-column mt-4">
        <li className="nav-item mb-3">
          <NavLink to="/admin/resume" className={({ isActive }) => "nav-link text-white " + (isActive ? "bg-primary" : "")}>
            <i className="bi bi-file-earmark-person me-2"></i> Resume Details
          </NavLink>
        </li>
        <li className="nav-item mb-3">
          <NavLink to="/admin/jobs" className={({ isActive }) => "nav-link text-white " + (isActive ? "bg-primary" : "")}>
            <i className="bi bi-upload me-2"></i> Job Upload
          </NavLink>
        </li>
        <li className="nav-item mb-3">
          <NavLink to="/admin/complaints" className={({ isActive }) => "nav-link text-white " + (isActive ? "bg-primary" : "")}>
            <i className="bi bi-exclamation-circle me-2"></i> Complaints
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
