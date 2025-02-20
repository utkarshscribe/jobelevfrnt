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
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router-dom";

const ResumeDetails = () => {
  const [resumes, setResumes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("Users");
  const [selectedResume, setSelectedResume] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes(selectedType);
  }, [selectedType]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleModal = () => setModalOpen(!modalOpen);

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

  const handleViewResume = (resume) => {
    setSelectedResume(resume);
    setModalOpen(true);
  };

  const handleDownload = () => {
    if (!selectedResume) return;

    const doc = new jsPDF();
    doc.text(`Resume: ${selectedResume.fullName}`, 10, 10);
    doc.text(`Email: ${selectedResume.email}`, 10, 20);
    doc.text(`Phone: ${selectedResume.phone}`, 10, 30);
    doc.text(`Skills: ${selectedResume.skills?.map(skill => skill.skillName).join(", ") || "N/A"}`, 10, 40);
    doc.save(`${selectedResume.fullName}_Resume.pdf`);
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
                  <Button color="primary" onClick={() => handleViewResume(resume)}>
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

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Resume Details</ModalHeader>
        <ModalBody>
          {selectedResume && (
            <div className="border p-3 bg-light">
              <h3>{selectedResume.fullName}</h3>
              <p><strong>Email:</strong> {selectedResume.email}</p>
              <p><strong>Phone:</strong> {selectedResume.phone}</p>
              <p><strong>Location:</strong> {selectedResume.location?.city}, {selectedResume.location?.state}, {selectedResume.location?.country}</p>
              <p><strong>Summary:</strong> {selectedResume.summary}</p>
              <Button color="danger" onClick={handleDownload}>Download Resume</Button>
            </div>
          )}
        </ModalBody>
      </Modal>
    </Card>
  );
};

export default ResumeDetails;
