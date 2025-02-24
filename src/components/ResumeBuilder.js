import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardTitle,
  Table,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";

const ResumeDetails = () => {
  const [resumes, setResumes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("Users");
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes(selectedType);
  }, [selectedType]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  

  const fetchResumes = async (type) => {
    try {
      const apiUrl =
        type === "Users"
          ? "https://jobapi.crmpannel.site/auth/v1/users"
          : "https://jobapi.crmpannel.site/auth/v1/employers";

      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setResumes(response.data.data);
    } catch (error) {
      console.error(`Error fetching ${type.toLowerCase()} data:`, error);
    }
  };

  const handleViewResume = async (id) => {
    try {
      // Fetch resume details
      const response = await axios.get(`https://jobapi.crmpannel.site/auth/v1/user/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
  
      const resume = response.data;
  
      // Open a new blank tab
      const newTab = window.open("", "_blank");
  
      if (newTab) {
        // Write basic HTML content in new tab
        newTab.document.write(`
          <html>
            <head>
              <title>${resume.fullName} - Resume</title>
              <script>
                function downloadPDF() {
                  window.opener.generatePDF(${JSON.stringify(resume)});
                  setTimeout(() => window.close(), 1000); // Close tab after download
                }
              </script>
            </head>
            <body onload="downloadPDF()">
              <h2>Downloading Resume...</h2>
            </body>
          </html>
        `);
        newTab.document.close();
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };
  
  // Function to generate and download the PDF
  window.generatePDF = (resume) => {
    if (!resume) return;
  
    const doc = new jsPDF();
    const textData = [
      `Name: ${resume.fullName || "N/A"}`,
      `Email: ${resume.email || "N/A"}`,
      `Phone: ${resume.phone || "N/A"}`,
      resume.location
        ? `Location: ${resume.location.city || "N/A"}, ${resume.location.state || "N/A"}, ${resume.location.country || "N/A"}`
        : "Location: N/A",
      `Profile Type: ${resume.profileType || "N/A"}`,
      `Summary: ${resume.summary || "N/A"}`,
      resume.skills?.length
        ? `Skills: ${resume.skills.map((skill) => `${skill.skillName} (${skill.proficiency})`).join(", ")}`
        : "Skills: N/A",
      resume.experience?.length
        ? `Experience:\n${resume.experience
            .map(
              (exp) =>
                `- ${exp.jobTitle} at ${exp.company} (${exp.startDate?.substring(0, 10)} - ${exp.endDate?.substring(0, 10) || "Present"})`
            )
            .join("\n")}`
        : "Experience: N/A",
      resume.education?.length
        ? `Education:\n${resume.education
            .map(
              (edu) =>
                `- ${edu.degree} from ${edu.institution} (${edu.startDate?.substring(0, 10)} - ${edu.endDate?.substring(0, 10) || "Present"})`
            )
            .join("\n")}`
        : "Education: N/A",
    ];
  
    doc.text(textData.join("\n"), 10, 10, { maxWidth: 180 });
    doc.save(`${resume.fullName}_Resume.pdf`);
  };
  
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jobapi.crmpannel.site/auth/v1/user/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setResumes(resumes.filter((resume) => resume.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center">
          <CardTitle tag="h5">Candidate Resumes</CardTitle>
          <div className="d-flex">
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle caret>{selectedType}</DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => setSelectedType("Users")}>
                  Users
                </DropdownItem>
                <DropdownItem onClick={() => setSelectedType("Employers")}>
                  Employers
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button color="success" className="ms-3" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </div>

        <Table bordered className="mt-3">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Name</th>
              <th>Skills</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume, index) => (
              <tr key={resume.id}>
                <td>{index + 1}</td>
                <td>{resume.fullName}</td>
                <td>
                  {resume.skills?.length > 0
                    ? resume.skills.map((skill) => skill.skillName).join(", ")
                    : "N/A"}
                </td>
                <td>
                  {resume.location
                    ? `${resume.location.city}, ${resume.location.state}, ${resume.location.country}`
                    : "N/A"}
                </td>
                <td>
                  <Button color="primary" onClick={() => handleViewResume(resume._id)}>
                    View Details
                  </Button>
                  <Button color="danger" className="ms-2" onClick={() => handleDelete(resume.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
      </Card>
  );
};

export default ResumeDetails;
