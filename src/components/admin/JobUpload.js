import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "bootstrap/dist/css/bootstrap.min.css";

const JobUpload = () => {
  return (
    <div className="container mt-4">
      <h2>Admin Job Manager</h2>
      <BulkJobUpload />
      <hr />
      <CreateJobForm />
    </div>
  );
};

const BulkJobUpload = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [jobs, setJobs] = useState([]); 
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };
 const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("Please select at least one file.");
      return;
    }

    let allJobs = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        allJobs = allJobs.concat(jsonData);
      }

      console.log("Extracted jobs:", allJobs);

      const validJobs = allJobs;
      console.log("Valid jobs:", validJobs);
      
      if (validJobs.length === 0) {
        setMessage("No valid jobs found in the uploaded file.");
        return;
      }

      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://jobapi.crmpannel.site/auth/v1/bulkjob",
        validJobs,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setMessage(response.data.message || "Jobs uploaded successfully!");

      // If the response returns the jobs, update the state to display them
      if (response.data.jobs) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Error uploading jobs. Please try again.");
    }
  };

  return (
    <div className="card p-4 shadow-sm mb-4">
      <h4>Bulk Job File Upload</h4>
      <input
        type="file"
        accept=".xlsx, .xls"
        multiple
        onChange={handleFileChange}
        className="form-control mb-3"
      />
      <button onClick={handleUpload} className="btn btn-primary">
        Upload Files
      </button>
      {message && <p className="mt-3 text-danger">{message}</p>}

      {/* Display the returned jobs (if any) in a table */}
      {jobs.length > 0 && (
        <div className="mt-4">
          <h5>Uploaded Jobs</h5>
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                
                <th>title</th>
                <th>company</th>
                <th>state</th>
                <th>city</th>
                <th>salary</th>
                <th>type</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>{job.state}</td>
                  <td>{job.city}</td>
                  <td>{job.salary}</td>
                  <td>{job.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const CreateJobForm = () => {
  // Updated jobData state with the required fields.
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    state: "",
    city: "",
    salary: "",
    type: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for required fields.
    if (
      !jobData.title ||
      !jobData.company ||
      !jobData.state ||
      !jobData.city ||
      !jobData.salary
    ) {
      setMessage("Please provide a title, company, state, city, and salary.");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      // Send the jobData object (which matches the API format) directly.
      const response = await axios.post(
        "https://jobapi.crmpannel.site/auth/v1/job",
        jobData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setMessage(response.data.message || "Job created successfully!");
      // Reset the form after a successful submission.
      setJobData({
        title: "",
        company: "",
        state: "",
        city: "",
        salary: "",
        type: "",
      });
    } catch (error) {
      console.error("Error creating job:", error);
      setMessage("Error creating job. Please try again.");
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h4>Create Job Posting</h4>
      <form onSubmit={handleSubmit}>
        {/* Job Title */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Job Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            placeholder="Enter job title"
          />
        </div>
        {/* Company */}
        <div className="mb-3">
          <label htmlFor="company" className="form-label">
            Company
          </label>
          <input
            type="text"
            className="form-control"
            id="company"
            name="company"
            value={jobData.company}
            onChange={handleChange}
            placeholder="Enter company name"
          />
        </div>
        {/* State */}
        <div className="mb-3">
          <label htmlFor="state" className="form-label">
            State
          </label>
          <input
            type="text"
            className="form-control"
            id="state"
            name="state"
            value={jobData.state}
            onChange={handleChange}
            placeholder="Enter state"
          />
        </div>
        {/* City */}
        <div className="mb-3">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            className="form-control"
            id="city"
            name="city"
            value={jobData.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
        </div>
        {/* Salary */}
        <div className="mb-3">
          <label htmlFor="salary" className="form-label">
            Salary
          </label>
          <input
            type="text"
            className="form-control"
            id="salary"
            name="salary"
            value={jobData.salary}
            onChange={handleChange}
            placeholder="Enter salary"
          />
        </div>
        {/* Job Type */}
        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Job Type
          </label>
          <input
            type="text"
            className="form-control"
            id="type"
            name="type"
            value={jobData.type}
            onChange={handleChange}
            placeholder="e.g. Full-time, Part-time"
          />
        </div>
        <button type="submit" className="btn btn-success">
          Create Job
        </button>
      </form>
      {message && <p className="mt-3 text-danger">{message}</p>}
    </div>
  );
};

export default JobUpload;
