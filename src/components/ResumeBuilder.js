import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, Table, Button } from "reactstrap";

const ResumeDetails = () => {
  const [resumes, setResumes] = useState([]);
  const authToken = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("https://jobapi.crmpannel.site/api/v1/myresume", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        setResumes(response.data.resumes); 
      })
      .catch((error) => {
        console.error("Error fetching resumes:", error);
      });
  }, []);

  const handleDownload = (resumeLink) => {
    window.open(resumeLink, "_blank");
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Candidate Resumes</CardTitle>
        <Table bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Resume</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume, index) => (
              <tr key={resume.id}>
                <td>{index + 1}</td>
                <td>{resume.name}</td>
                <td>{resume.email}</td>
                <td>{resume.phone}</td>
                <td>
                  <Button
                    color="primary"
                    onClick={() => handleDownload(resume.resumeLink)}
                  >
                    Download
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
