import React, { useState } from 'react'

const JobCard = ({index, job}) => {
    const [selectedJob, setSelectedJob] = useState(false);
  return (
   
    <div key={index} className="col-md-6 col-sm-12 mb-4">
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
                {selectedJob && <li>Contact Number: {job.phone}</li>}
              </ul>

              {/* Apply Button */}
              <button
                className="btn btn-primary btn-sm w-100"
                onClick={() => setSelectedJob(true)}
              >
                Show Contact Details
              </button>
            </div>
          </div>
        </div>
  )
}

export default JobCard