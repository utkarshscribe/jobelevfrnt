import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UserJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs = async () => {
    try {
      const response = await axios.get(
        "https://jobapi.crmpannel.site/auth/v1/jobs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobs(response.data.jobs);
    } catch (error) {
      console.error("Error getting jobs:", error.response?.data);
    }
  };

  // Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  return (
    <div className="container">
      <h2 className="mb-4">Available Jobs</h2>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search jobs..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>State</th>
            <th>City</th>
            <th>Salary</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {currentJobs.length > 0 ? (
            currentJobs.map((job, index) => (
              <tr key={index}>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.state}</td>
                <td>{job.city}</td>
                <td>{job.salary}</td>
                <td>{job.type}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No jobs found.</td>
            </tr>
          )}
        </tbody>
      </table>

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
