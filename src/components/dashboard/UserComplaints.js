import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";


const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result); 
    reader.onerror = (error) => reject(error);
  });
};

const authToken = localStorage.getItem("authToken"); 

const UserComplaintForm = () => {
  
  const [formData, setFormData] = useState({
    mobile: "",
    email: "",
    name: "",
    company: "",
    companyAdd: "",
    companyPOC: "",
    companyNo: "",
    doj: "",
    description: "",
  });
  
  
  const [offerLetterFile, setOfferLetterFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  
  const authToken = "$authtoken";

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setOfferLetterFile(e.target.files[0]);
    }
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let offerLetterBase64 = null;
      if (offerLetterFile) {
        
        offerLetterBase64 = await convertFileToBase64(offerLetterFile);
        
      }

      const payload = {
        ...formData,
        
      };

      
      const response = await axios.post(
        "https://jobapi.crmpannel.site/auth/v1/complaint",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
        }
      );

      setMessage("Complaint submitted successfully!");
      
      setFormData({
        mobile: "",
        email: "",
        name: "",
        company: "",
        companyAdd: "",
        companyPOC: "",
        companyNo: "",
        doj: "",
        description: "",
      });
      setOfferLetterFile(null);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setMessage("Error submitting complaint. Please try again.");
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
              <h3 className="mb-0">Submit Your Complaint</h3>
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
                {/* Complaint Description */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Complaint Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your complaint in detail"
                    required
                  ></textarea>
                </div>
                {/* Offer Letter PDF Upload */}
                <div className="mb-3">
                  <label htmlFor="offerLetter" className="form-label">
                    Offer Letter (PDF)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="offerLetter"
                    name="offerLetter"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                  <small className="text-muted">
                    Upload your offer letter in PDF format.
                  </small>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Complaint"}
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

export default UserComplaintForm;
