import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, Table, Button } from "reactstrap";

const ResumeDetails = () => {
  const [resumes, setResumes] = useState([]);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get("https://jobapi.crmpannel.site/auth/v1/users", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        
        setResumes(response.data.data);
      } catch (error) {
        console.error("Error fetching resumes:", error);
      }
    };
  
    fetchResumes();
  }, []);

  const handleDownload = (resumeLink) => {
    window.open(resumeLink, "_blank");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jobapi.crmpannel.site/auth/v1/user/:id`, {
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
        <CardTitle tag="h5">Candidate Resumes</CardTitle>
        <Table bordered>
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
            {resumes?.map((resume, index) => (
              <tr key={resume.id}>
                <td>{index + 1}</td>
                <td>{resume.fullName}</td>
                <td>{resume.skills && resume?.skills.length > 0
                  ? resume?.skills.map(skill => skill.skillName).join(", ")
                  : "N/A"}</td>
                <td>{resume.location
                  ? `${resume.location.city}, ${resume.location.state}, ${resume.location.country}`
                  : "N/A"}</td>
                <td>
                  <Button color="primary" onClick={() => handleDownload(resume.resumeLink)}>
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
