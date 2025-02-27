import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UserJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    company: "",
    state: "",
    city: "",
    salary: "",
    type: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs = async () => {
    try {
      const response = await axios.get("https://jobapi.crmpannel.site/auth/v1/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response.data.jobs);
      setFilteredJobs(response.data.jobs);
    } catch (error) {
      console.error("Error getting jobs:", error.response?.data);
    }
  };

  const applyFilters = () => {
    const filtered = jobs.filter((job) =>
      Object.keys(filters).every((key) =>
        filters[key] ? String(job[key]).toLowerCase().includes(filters[key].toLowerCase()) : true
      )
    );
    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ title: "", company: "", state: "", city: "", salary: "", type: "" });
    setFilteredJobs(jobs);
    setCurrentPage(1);
  };

  // Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-primary">Find Your Dream Job</h2>

      {/* Filter Section */}
      <div className="card p-3 mb-4 shadow-sm">
        <div className="row">
          {Object.keys(filters).map((key) => (
            <div key={key} className="col-md-2 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={filters[key]}
                onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-primary me-2 px-4" onClick={applyFilters}>
            <i className="bi bi-filter"></i> Apply Filters
          </button>
          <button className="btn btn-secondary px-4" onClick={clearFilters}>
            <i className="bi bi-x-circle"></i> Clear Filters
          </button>
        </div>
      </div>

      {/* Job Listings in Cards */}
      <div className="row">
        {currentJobs.length > 0 ? (
          currentJobs.map((job, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className="card shadow-sm border-0 p-3 bg-light rounded-3 job-card">
                <div className="card-body">
                  {/* Job Title with Link */}
                  <h5 className="card-title fw-bold">
                    <a href="#" className="text-dark text-decoration-none job-title">
                      {job.title} ({job.state})
                    </a>
                  </h5>
                  
                  {/* Company & Location */}
                  <h6 className="card-subtitle mb-2 text-muted">{job.company}</h6>
                  <p className="text-muted">{job.city || "Remote"}</p>

                  {/* Salary, Type, Schedule */}
                  <div className="mb-3">
                    <span className="badge bg-dark text-light me-2 p-2">
                      ₹{job.salary || "Not Disclosed"} / year
                    </span>
                    <span className="badge bg-success me-2 p-2">{job.type}</span>
                    <span className="badge bg-secondary p-2">Monday to Friday</span>
                  </div>

                  {/* Easily Apply Section */}
                  <p className="text-primary fw-bold">
                    <i className="bi bi-arrow-right-circle-fill me-1"></i> Easily apply
                  </p>
                  
                  {/* Job Details */}
                  <ul className="text-muted">
                    <li>Job Title: {job.title}</li>
                    <li>Compensation: ₹{job.salary || "Negotiable"}</li>
                    <li>Shift Timings: {job.type === "Full-time" ? "Monday to Friday" : "Flexible"}</li>
                  </ul>
                  
                  {/* Apply Button */}
                  <button className="btn btn-primary btn-sm w-100">Apply Now</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-100">
            <p>No jobs found.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default UserJobs;
