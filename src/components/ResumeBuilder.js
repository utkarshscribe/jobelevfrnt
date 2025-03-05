import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardTitle,
  Table,
  Button,
  Input,
  Row,
  Col,
} from "reactstrap";
import { toast } from "react-toastify";
import { FaFilter, FaTimes } from "react-icons/fa"; // Import Icons
import "react-toastify/dist/ReactToastify.css";

const ResumeDetails = () => {
  const [resumes, setResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    skills: "",
    location: "",
  });
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const apiUrl = "https://jobapi.crmpannel.site/auth/v1/userbyemp";
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setResumes(response.data.data);
      setFilteredResumes(response.data.data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  const handleViewResume = async (id) => {
    try {
      const response = await axios.get(
        `https://jobapi.crmpannel.site/auth/v1/user/${id}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      console.log(response.data);

      toast.success("Resume details saved successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error fetching resume:", error);

      toast.error("Failed to save resume details!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    const filtered = resumes.filter((resume) => {
      return (
        resume.fullName.toLowerCase().includes(filters.name.toLowerCase()) &&
        resume.skills.some((skill) =>
          skill.skillName.toLowerCase().includes(filters.skills.toLowerCase())
        ) &&
        (resume.location
          ? `${resume.location.city}, ${resume.location.state}, ${resume.location.country}`
              .toLowerCase()
              .includes(filters.location.toLowerCase())
          : false)
      );
    });

    setFilteredResumes(filtered);
  };

  const clearFilters = () => {
    setFilters({ name: "", skills: "", location: "" });
    setFilteredResumes(resumes);
  };

  return (
    <Card className="shadow-sm border-0">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <CardTitle tag="h4" className="fw-bold text-primary">
            Candidate Resumes
          </CardTitle>
        </div>

        {/* Filter Section */}
        <Row className="mb-4 g-3">
          <Col md={3}>
            <Input
              type="text"
              name="name"
              placeholder="🔍 Filter by Name"
              value={filters.name}
              onChange={handleFilterChange}
              className="rounded-pill shadow-sm"
            />
          </Col>
          <Col md={3}>
            <Input
              type="text"
              name="skills"
              placeholder="🛠 Filter by Skills"
              value={filters.skills}
              onChange={handleFilterChange}
              className="rounded-pill shadow-sm"
            />
          </Col>
          <Col md={3}>
            <Input
              type="text"
              name="location"
              placeholder="📍 Filter by Location"
              value={filters.location}
              onChange={handleFilterChange}
              className="rounded-pill shadow-sm"
            />
          </Col>
          <Col md={3} className="d-flex gap-2">
            <Button color="primary" className="rounded-pill px-4" onClick={applyFilters}>
              <FaFilter className="me-2" /> Apply Filter
            </Button>
            <Button color="danger" className="rounded-pill px-4" onClick={clearFilters}>
              <FaTimes className="me-2" /> Clear Filter
            </Button>
          </Col>
        </Row>

        <Table responsive striped bordered hover className="mt-3 shadow-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Skills</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResumes.map((resume, index) => (
              <tr key={resume.id} className="align-middle">
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
                  <Button
                    color="success"
                    className="rounded-pill px-3"
                    onClick={() => handleViewResume(resume._id)}
                  >
                    ✅ Save Details
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
