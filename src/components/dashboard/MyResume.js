import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";

const MyResume = () => {
  // Set up initial resume data structure. Adjust as needed.
  const [resumeData, setResumeData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: { city: "", state: "", country: "" },
    summary: "",
    skills: [{ skillName: "", proficiency: "Beginner" }],
    experience: [
      {
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        location: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
  });
  const [editing, setEditing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");

  const authToken = localStorage.getItem("authToken");

  // Fetch user resume data from your API when the component mounts.
  useEffect(() => {
    axios
      .get("https://jobapi.crmpannel.site/api/v1/myresume", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        if (response.data) {
          setResumeData(response.data);
        }
      })
      .catch((error) =>
        console.error("Error fetching resume data:", error)
      );
  }, [authToken]);

  // Handle changes for top-level fields (fullName, email, phone, summary)
  const handleChange = (e) => {
    setResumeData({
      ...resumeData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle changes for nested location fields
  const handleLocationChange = (e) => {
    setResumeData({
      ...resumeData,
      location: {
        ...resumeData.location,
        [e.target.name]: e.target.value,
      },
    });
  };

  // For the skills array (we’re handling just one skill for simplicity)
  const handleSkillChange = (e) => {
    const updatedSkills = [...resumeData.skills];
    updatedSkills[0] = { ...updatedSkills[0], [e.target.name]: e.target.value };
    setResumeData({
      ...resumeData,
      skills: updatedSkills,
    });
  };

  // For the experience array (handling one experience)
  const handleExperienceChange = (e) => {
    const updatedExp = [...resumeData.experience];
    updatedExp[0] = { ...updatedExp[0], [e.target.name]: e.target.value };
    setResumeData({
      ...resumeData,
      experience: updatedExp,
    });
  };

  // For the education array (handling one education entry)
  const handleEducationChange = (e) => {
    const updatedEdu = [...resumeData.education];
    updatedEdu[0] = { ...updatedEdu[0], [e.target.name]: e.target.value };
    setResumeData({
      ...resumeData,
      education: updatedEdu,
    });
  };

  // Save the updated resume to your backend API.
  const saveResume = () => {
    axios
      .patch("https://jobapi.crmpannel.site/api/v1/user", resumeData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => setEditing(false))
      .catch((error) =>
        console.error("Error updating resume:", error)
      );
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Resume", 90, 10);

    let y = 20;
    doc.text(`Full Name: ${resumeData.fullName}`, 10, y);
    y += 10;
    doc.text(`Email: ${resumeData.email}`, 10, y);
    y += 10;
    doc.text(`Phone: ${resumeData.phone}`, 10, y);
    y += 10;
    doc.text(
      `Location: ${resumeData.location?.city || ""}, ${resumeData.location?.state || ""}, ${resumeData.location?.country || ""}`,
      10,
      y
    );
    y += 10;
    doc.text(`Summary: ${resumeData.summary}`, 10, y);
    y += 10;
    if (resumeData.skills && resumeData.skills.length > 0) {
      doc.text(
        `Skill: ${resumeData.skills[0].skillName} (${resumeData.skills[0].proficiency})`,
        10,
        y
      );
      y += 10;
    }
    if (resumeData.experience && resumeData.experience.length > 0) {
      doc.text(
        `Experience: ${resumeData.experience[0].jobTitle} at ${resumeData.experience[0].company}`,
        10,
        y
      );
      y += 10;
      doc.text(
        `Duration: ${resumeData.experience[0].startDate} - ${resumeData.experience[0].endDate}`,
        10,
        y
      );
      y += 10;
      doc.text(
        `Description: ${resumeData.experience[0].description}`,
        10,
        y
      );
      y += 10;
    }
    if (resumeData.education && resumeData.education.length > 0) {
      doc.text(
        `Education: ${resumeData.education[0].degree} from ${resumeData.education[0].institution}`,
        10,
        y
      );
      y += 10;
      doc.text(
        `Duration: ${resumeData.education[0].startDate} - ${resumeData.education[0].endDate}`,
        10,
        y
      );
      y += 10;
      doc.text(
        `Description: ${resumeData.education[0].description}`,
        10,
        y
      );
      y += 10;
    }

    doc.save("MyResume.pdf");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Resume</h2>

      <div className="mb-3">
        <label>Select Resume Template:</label>
        <select
          className="form-select"
          onChange={(e) => setSelectedTemplate(e.target.value)}
          value={selectedTemplate}
        >
          <option value="template1">Template 1</option>
          <option value="template2">Template 2</option>
          <option value="template3">Template 3</option>
        </select>
      </div>

      {editing ? (
        // Render a structured form for editing the resume.
        <div>
          <h4>Personal Information</h4>
          <div className="mb-2">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={resumeData.fullName || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={resumeData.email || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Phone</label>
            <input
              type="text"
              name="phone"
              value={resumeData.phone || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <h4>Location</h4>
          <div className="mb-2">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              value={resumeData.location?.city || ""}
              onChange={handleLocationChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">State</label>
            <input
              type="text"
              name="state"
              value={resumeData.location?.state || ""}
              onChange={handleLocationChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Country</label>
            <input
              type="text"
              name="country"
              value={resumeData.location?.country || ""}
              onChange={handleLocationChange}
              className="form-control"
            />
          </div>

          <h4>Summary</h4>
          <div className="mb-2">
            <textarea
              name="summary"
              value={resumeData.summary || ""}
              onChange={handleChange}
              className="form-control"
              placeholder="Professional Summary"
            ></textarea>
          </div>

          <h4>Skills</h4>
          <div className="mb-2">
            <label className="form-label">Skill Name</label>
            <input
              type="text"
              name="skillName"
              value={
                resumeData.skills && resumeData.skills[0]?.skillName || ""
              }
              onChange={handleSkillChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Proficiency</label>
            <select
              name="proficiency"
              value={
                (resumeData.skills && resumeData.skills[0]?.proficiency) ||
                "Beginner"
              }
              onChange={handleSkillChange}
              className="form-select"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <h4>Experience</h4>
          <div className="mb-2">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={
                resumeData.experience && resumeData.experience[0]?.jobTitle || ""
              }
              onChange={handleExperienceChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Company</label>
            <input
              type="text"
              name="company"
              value={
                resumeData.experience && resumeData.experience[0]?.company || ""
              }
              onChange={handleExperienceChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={
                resumeData.experience && resumeData.experience[0]?.startDate || ""
              }
              onChange={handleExperienceChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="endDate"
              value={
                resumeData.experience && resumeData.experience[0]?.endDate || ""
              }
              onChange={handleExperienceChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Experience Location</label>
            <input
              type="text"
              name="location"
              value={
                resumeData.experience && resumeData.experience[0]?.location || ""
              }
              onChange={handleExperienceChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Experience Description</label>
            <textarea
              name="description"
              value={
                resumeData.experience &&
                resumeData.experience[0]?.description || ""
              }
              onChange={handleExperienceChange}
              className="form-control"
            ></textarea>
          </div>

          <h4>Education</h4>
          <div className="mb-2">
            <label className="form-label">Degree</label>
            <input
              type="text"
              name="degree"
              value={
                resumeData.education && resumeData.education[0]?.degree || ""
              }
              onChange={handleEducationChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Institution</label>
            <input
              type="text"
              name="institution"
              value={
                resumeData.education && resumeData.education[0]?.institution || ""
              }
              onChange={handleEducationChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={
                resumeData.education && resumeData.education[0]?.startDate || ""
              }
              onChange={handleEducationChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="endDate"
              value={
                resumeData.education && resumeData.education[0]?.endDate || ""
              }
              onChange={handleEducationChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Education Description</label>
            <textarea
              name="description"
              value={
                resumeData.education &&
                resumeData.education[0]?.description || ""
              }
              onChange={handleEducationChange}
              className="form-control"
            ></textarea>
          </div>

          <button className="btn btn-success my-3" onClick={saveResume}>
            Save Resume
          </button>
          <button
            className="btn btn-secondary my-3 ms-2"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        // Preview mode – display the resume in a formatted view.
        <div className="border p-3 bg-light">
          <h3>{resumeData.fullName}</h3>
          <p>
            <strong>Email:</strong> {resumeData.email}
          </p>
          <p>
            <strong>Phone:</strong> {resumeData.phone}
          </p>
          <p>
            <strong>Location:</strong>{" "}
            {resumeData.location?.city}, {resumeData.location?.state},{" "}
            {resumeData.location?.country}
          </p>
          <p>
            <strong>Summary:</strong> {resumeData.summary}
          </p>

          <h4>Skills</h4>
          {resumeData.skills && resumeData.skills[0] && (
            <p>
              {resumeData.skills[0].skillName} -{" "}
              {resumeData.skills[0].proficiency}
            </p>
          )}

          <h4>Experience</h4>
          {resumeData.experience && resumeData.experience[0] && (
            <div>
              <p>
                <strong>Job Title:</strong> {resumeData.experience[0].jobTitle}
              </p>
              <p>
                <strong>Company:</strong> {resumeData.experience[0].company}
              </p>
              <p>
                <strong>Duration:</strong>{" "}
                {resumeData.experience[0].startDate} to{" "}
                {resumeData.experience[0].endDate}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {resumeData.experience[0].description}
              </p>
            </div>
          )}

          <h4>Education</h4>
          {resumeData.education && resumeData.education[0] && (
            <div>
              <p>
                <strong>Degree:</strong> {resumeData.education[0].degree}
              </p>
              <p>
                <strong>Institution:</strong>{" "}
                {resumeData.education[0].institution}
              </p>
              <p>
                <strong>Duration:</strong>{" "}
                {resumeData.education[0].startDate} to{" "}
                {resumeData.education[0].endDate}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {resumeData.education[0].description}
              </p>
            </div>
          )}

          <button
            className="btn btn-primary me-2"
            onClick={() => setEditing(true)}
          >
            Edit Resume
          </button>
          <button className="btn btn-danger" onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default MyResume;
