import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const HireMeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    role: "",
    company: "",
    vacancy: "",
    companyAdd: "",
    companyPOC: "",
    companyNo: "",
    doj: "",
    salary: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "https://jobapi.crmpannel.site/auth/v1/hireme",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setMessage("Application submitted successfully!");
      } else {
        setMessage("Failed to submit application.");
      }

      setFormData({
        name: "",
        mobile: "",
        email: "",
        role: "",
        company: "",
        vacancy: "",
        companyAdd: "",
        companyPOC: "",
        companyNo: "",
        doj: "",
        salary: "",
        description: "",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      setMessage("Error submitting application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div
              className="card-header text-white text-center py-3"
              style={{
                background: "linear-gradient(90deg, #343a40, #495057)",
                borderBottom: "none",
              }}
            >
              <h3 className="mb-0">Hire For Me</h3>
            </div>
            <div className="card-body">
              {message && <div className="alert alert-info">{message}</div>}
              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                {/* Email Address */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                  />
                </div>
                {/* Mobile Number */}
                <div className="mb-3">
                  <label htmlFor="mobile" className="form-label">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="123-456-7890"
                    required
                  />
                </div>
                {/* Role */}
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Role
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Enter your job role"
                    required
                  />
                </div>
                {/* Company Information */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="company" className="form-label">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                  <label htmlFor="numOfVacancy" className="form-label">
                    Vacancy
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="numOfVacancy"
                    name="numOfVacancy"
                    value={formData.numOfVacancy}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </div>
                  <div className="mb-3">
                    <label htmlFor="companyAdd" className="form-label">
                      Company Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="companyAdd"
                      name="companyAdd"
                      value={formData.companyAdd}
                      onChange={handleChange}
                      placeholder="Enter your company address"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="companyPOC" className="form-label">
                      Company POC
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="companyPOC"
                      name="companyPOC"
                      value={formData.companyPOC}
                      onChange={handleChange}
                      placeholder="Enter point of contact name"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="companyNo" className="form-label">
                      Company Contact Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="companyNo"
                      name="companyNo"
                      value={formData.companyNo}
                      onChange={handleChange}
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>
                {/* Date of Joining */}
                <div className="mb-3">
                  <label htmlFor="doj" className="form-label">
                    Date of Joining
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="doj"
                    name="doj"
                    value={formData.doj}
                    onChange={handleChange}
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
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="Enter salary details"
                  />
                </div>
                {/* Job Description */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Job Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your job role and responsibilities"
                    required
                  ></textarea>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Form"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HireMeForm;
