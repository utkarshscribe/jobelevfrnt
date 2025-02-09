import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";

const MyResume = () => {
  const [resumeData, setResumeData] = useState({});
  const [editing, setEditing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");

  const authToken = localStorage.getItem("authToken");

  // Fetch user data
  useEffect(() => {
    axios.get("https://jobapi.crmpannel.site/auth/v1/myresume", {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    .then((response) => setResumeData(response.data))
    .catch((error) => console.error("Error fetching resume data:", error));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  // Save updated resume
  const saveResume = () => {
    axios.put("https://jobapi.crmpannel.site/auth/v1/myresume", resumeData, {
      headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
    })
    .then(() => setEditing(false))
    .catch((error) => console.error("Error updating resume:", error));
  };

  // Generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Resume", 90, 10);

    let y = 20;
    Object.keys(resumeData).forEach((key) => {
      doc.text(`${key}: ${resumeData[key]}`, 10, y);
      y += 10;
    });

    doc.save("MyResume.pdf");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Resume</h2>

      {/* Resume Template Selector */}
      <div className="mb-3">
        <label>Select Resume Template:</label>
        <select className="form-select" onChange={(e) => setSelectedTemplate(e.target.value)}>
          <option value="template1">Template 1</option>
          <option value="template2">Template 2</option>
          <option value="template3">Template 3</option>
        </select>
      </div>

      {/* Resume Details */}
      {editing ? (
        <div>
          {Object.keys(resumeData).map((key) => (
            <div className="mb-2" key={key}>
              <label className="form-label">{key}</label>
              <input type="text" name={key} value={resumeData[key] || ""} className="form-control" onChange={handleChange} />
            </div>
          ))}
          <button className="btn btn-success" onClick={saveResume}>Save</button>
        </div>
      ) : (
        <div className="border p-3 bg-light">
          {Object.keys(resumeData).map((key) => (
            <p key={key}><strong>{key}:</strong> {resumeData[key]}</p>
          ))}
          <button className="btn btn-primary me-2" onClick={() => setEditing(true)}>Edit</button>
          <button className="btn btn-danger" onClick={downloadPDF}>Download PDF</button>
        </div>
      )}
    </div>
  );
};

export default MyResume;
