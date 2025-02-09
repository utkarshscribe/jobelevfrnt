import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UserJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState({
    title: "",
    state: "",
    city: "",
    type: "", // Fresher/Experienced
  });
  const [showTable, setShowTable] = useState(false); // Hide table initially

  const authToken = localStorage.getItem("authToken"); // Retrieve auth token

  // Handle Input Change for Search Fields
  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  // Fetch Jobs from API on Search Click
  const handleSearch = () => {
    axios
      .get("https://jobapi.crmpannel.site/auth/v1/job", {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setJobs(response.data);
        setShowTable(true); // Show table after fetching data
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error.response?.data);
      });
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-lg bg-light">
        <h3 className="text-center mb-3">Job Listings</h3>

        {/* Search Fields */}
        <div className="row mb-3">
          <div className="col-md-3">
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="Job Title"
              value={search.title}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="state"
              className="form-control"
              placeholder="State"
              value={search.state}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="city"
              className="form-control"
              placeholder="City"
              value={search.city}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <select
              name="type"
              className="form-control"
              value={search.type}
              onChange={handleChange}
            >
              <option value="">Fresher/Experienced</option>
              <option value="Fresher">Fresher</option>
              <option value="Experienced">Experienced</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="text-center mb-3">
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Job Table (Hidden Until Search is Clicked) */}
        {showTable && (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Job Title</th>
                  <th>Company Name</th>
                  <th>State</th>
                  <th>City</th>
                  <th>Salary Range</th>
                  <th>Fresher/Experience</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length > 0 ? (
                  jobs.map((job, index) => (
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
                    <td colSpan="6" className="text-center">
                      No jobs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserJobs;
