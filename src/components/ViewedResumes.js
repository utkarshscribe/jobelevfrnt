import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardTitle, CardText, Spinner, Row, Col } from "reactstrap";
import axios from "axios";
import * as XLSX from "xlsx";

const ViewedResumes = () => {
  const [viewedResumes, setViewedResumes] = useState([]);
  const [selectedResumes, setSelectedResumes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://jobapi.crmpannel.site/auth/v1/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setViewedResumes(response.data?.data?.viewedUsers || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  // Toggle selection for an individual resume
  const handleCheckboxChange = (id) => {
    setSelectedResumes((prevSelected) => ({
      ...prevSelected,
      [id]: !prevSelected[id], // Toggle only this specific resume
    }));
  };

  // Select or deselect all resumes
  const handleSelectAll = () => {
    const allSelected = Object.values(selectedResumes).every((isSelected) => isSelected);
    const newSelected = {};
    viewedResumes.forEach((resume) => {
      newSelected[resume._id] = !allSelected; // Using `_id` for uniqueness
    });
    setSelectedResumes(newSelected);
  };

  // Download selected resumes as an Excel file
  const downloadSelected = () => {
    const selectedData = viewedResumes.filter((resume) => selectedResumes[resume._id]);
    if (selectedData.length === 0) {
      alert("No resumes selected!");
      return;
    }

    const excelData = selectedData.map((resume) => ({
      "Full Name": resume.fullName || "N/A",
      Email: resume.email || "N/A",
      Phone: resume.phone || "N/A",
      Location: resume.location
        ? `${resume.location.city}, ${resume.location.state}, ${resume.location.country}`
        : "N/A",
      "Profile Type": resume.profileType || "N/A",
      Summary: resume.summary || "N/A",
      Skills: resume.skills ? resume.skills.map((skill) => skill.skillName).join(", ") : "N/A",
      Experience: resume.experience
        ? resume.experience.map((exp) => `${exp.jobTitle} at ${exp.company}`).join(", ")
        : "N/A",
      Education: resume.education
        ? resume.education.map((edu) => `${edu.degree} from ${edu.institution}`).join(", ")
        : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resumes");
    XLSX.writeFile(workbook, "Selected_Resumes.xlsx");
  };

  return (
    <div className="container mt-4">
      <Card className="p-3 shadow-sm">
        <CardBody className="d-flex justify-content-between align-items-center">
          <CardTitle tag="h4" className="font-weight-bold">
            📄 Viewed Resumes
          </CardTitle>
          <Button color="info" onClick={handleSelectAll}>
            {Object.values(selectedResumes).every((isSelected) => isSelected) ? "Deselect All" : "Select All"}
          </Button>
        </CardBody>
      </Card>

      {loading && <Spinner color="primary" className="mt-3 d-block mx-auto" />}
      {error && <p className="text-danger text-center mt-3">{error}</p>}

      {!loading && !error && viewedResumes.length > 0 && (
        <Row className="mt-3">
          {viewedResumes.map((resume) => (
            <Col md="6" className="mb-4 d-flex" key={resume._id}>
              <Card className="shadow-lg p-3 w-100 position-relative" style={{ borderRadius: "15px" }}>
                <CardBody>
                  <Button
                    color={selectedResumes[resume._id] ? "success" : "secondary"}
                    className="position-absolute top-0 end-0 m-2"
                    onClick={() => handleCheckboxChange(resume._id)}
                  >
                    {selectedResumes[resume._id] ? "✔ Selected" : "Select"}
                  </Button>

                  <CardTitle tag="h5" className="mb-2 text-primary">
                    {resume.fullName}
                  </CardTitle>
                  <CardText><strong>📧 Email:</strong> {resume.email}</CardText>
                  <CardText><strong>📞 Phone:</strong> {resume.phone}</CardText>
                  <CardText><strong>📍 Location:</strong> {resume.location ? `${resume.location.city}, ${resume.location.state}, ${resume.location.country}` : "N/A"}</CardText>
                  <CardText><strong>🛠️ Skills:</strong> {resume.skills ? resume.skills.map((skill) => skill.skillName).join(", ") : "N/A"}</CardText>
                  <CardText><strong>🏢 Experience:</strong> {resume.experience ? resume.experience.map((exp) => `${exp.jobTitle} at ${exp.company}`).join(", ") : "N/A"}</CardText>
                  <CardText><strong>🎓 Education:</strong> {resume.education ? resume.education.map((edu) => `${edu.degree} from ${edu.institution}`).join(", ") : "N/A"}</CardText>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {!loading && !error && viewedResumes.length > 0 && (
        <div className="text-center mt-4">
          <Button color="success" onClick={downloadSelected}>
            📥 Download Selected
          </Button>
        </div>
      )}
    </div>
  );
};

export default ViewedResumes;
