import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import xlsx library

const ResumeDetails = () => {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    getResumes();
  }, []);

  const getResumes = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("https://jobapi.crmpannel.site/auth/v1/admin/resumes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes(response.data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  // Function to download data as Excel
  const downloadExcel = () => {
    if (resumes.length === 0) {
      alert("No data to download!");
      return;
    }

    const formattedData = resumes.map((resume) => ({
      Name: resume.fullName || "N/A",
      Email: resume.email,
      Phone: resume.phone || "N/A",
      Location: resume.location
        ? `${resume.location.city || "N/A"}, ${resume.location.state || "N/A"}, ${resume.location.country || "N/A"}`
        : "N/A",
      Summary: resume.summary || "N/A",
      Skills: resume.skills.length > 0
        ? resume.skills.map(skill => `${skill.skillName} (${skill.proficiency})`).join(", ")
        : "N/A",
      Experience: resume.experience.length > 0
        ? resume.experience.map(exp =>
            `${exp.jobTitle} at ${exp.company} (${new Date(exp.startDate).toLocaleDateString()} - ${
              exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"
            })`
          ).join(", ")
        : "N/A",
      Education: resume.education.length > 0
        ? resume.education.map(edu =>
            `${edu.degree} from ${edu.institution} (${new Date(edu.startDate).toLocaleDateString()} - ${
              edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"
            })`
          ).join(", ")
        : "N/A",
      Certifications: resume.certifications.length > 0
        ? resume.certifications.map(cert =>
            `${cert.title} from ${cert.institution} (${new Date(cert.dateIssued).toLocaleDateString()})`
          ).join(", ")
        : "N/A",
      Languages: resume.languages.length > 0
        ? resume.languages.map(lang => `${lang.language} (${lang.proficiency})`).join(", ")
        : "N/A",
      Projects: resume.projects.length > 0
        ? resume.projects.map(proj => `${proj.projectName}: ${proj.description} (Tech: ${proj.technologiesUsed})`)
            .join(", ")
        : "N/A",
    }));

    // Create a new Excel workbook and sheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resumes");

    // Create an Excel file and trigger a download
    XLSX.writeFile(workbook, "Resume_Details.xlsx");
  };

  return (
    <div className="container">
      <h2 className="mb-4">Resume Details</h2>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Summary</th>
              <th>Skills</th>
              <th>Experience</th>
              <th>Education</th>
              <th>Certifications</th>
              <th>Languages</th>
              <th>Projects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resumes.length > 0 ? (
              resumes.map((resume, index) => (
                <tr key={index}>
                  <td>{resume.fullName || "N/A"}</td>
                  <td>{resume.email}</td>
                  <td>{resume.phone || "N/A"}</td>
                  <td>
                    {resume.location
                      ? `${resume.location.city || "N/A"}, ${resume.location.state || "N/A"}, ${resume.location.country || "N/A"}`
                      : "N/A"}
                  </td>
                  <td>{resume.summary || "N/A"}</td>
                  <td>
                    {resume.skills.length > 0
                      ? resume.skills.map(skill => `${skill.skillName} (${skill.proficiency})`).join(", ")
                      : "N/A"}
                  </td>
                  <td>
                    {resume.experience.length > 0
                      ? resume.experience.map(exp => 
                          `${exp.jobTitle} at ${exp.company} (${new Date(exp.startDate).toLocaleDateString()} - ${
                            exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"
                          })`
                        ).join(", ")
                      : "N/A"}
                  </td>
                  <td>
                    {resume.education.length > 0
                      ? resume.education.map(edu => 
                          `${edu.degree} from ${edu.institution} (${new Date(edu.startDate).toLocaleDateString()} - ${
                            edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"
                          })`
                        ).join(", ")
                      : "N/A"}
                  </td>
                  <td>
                    {resume.certifications.length > 0
                      ? resume.certifications.map(cert => 
                          `${cert.title} from ${cert.institution} (${new Date(cert.dateIssued).toLocaleDateString()})`
                        ).join(", ")
                      : "N/A"}
                  </td>
                  <td>
                    {resume.languages.length > 0
                      ? resume.languages.map(lang => `${lang.language} (${lang.proficiency})`).join(", ")
                      : "N/A"}
                  </td>
                  <td>
                    {resume.projects.length > 0
                      ? resume.projects.map(proj => 
                          `${proj.projectName}: ${proj.description} (Tech: ${proj.technologiesUsed})`
                        ).join(", ")
                      : "N/A"}
                  </td>
                  <td>
                    <button className="btn btn-primary btn-sm me-2">Edit</button>
                    <button className="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center">
                  No resumes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Centered Download Button Below the Table */}
      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-success" onClick={downloadExcel}>
          Download as Excel
        </button>
      </div>
    </div>
  );
};

export default ResumeDetails;
