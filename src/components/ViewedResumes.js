import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardTitle, Table, Spinner } from "reactstrap";
import axios from "axios";
import * as XLSX from "xlsx";

const ViewedResumes = () => {
  const [viewedResumes, setViewedResumes] = useState([]);
  const [selectedResumes, setSelectedResumes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token= localStorage.getItem("authToken");

  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://jobapi.crmpannel.site/auth/v1/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data?.data?.viewedUsers);
        setViewedResumes(response.data?.data?.viewedUsers
        ); // Assuming API returns an array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedResumes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const newSelected = {};
    viewedResumes.forEach((resume) => {
      newSelected[resume.id] = checked;
    });
    setSelectedResumes(newSelected);
  };

  const downloadSelected = () => {
    const selectedData = viewedResumes?.filter((resume) => selectedResumes[resume.id]);
    if (selectedData.length === 0) {
      alert("No resumes selected!");
      return;
    }

    const excelData = selectedData?.map((resume) => ({
      "Full Name": resume.fullName || "N/A",
      Email: resume.email || "N/A",
      Phone: resume.phone || "N/A",
      Location: resume.location
        ? `${resume.location.city}, ${resume.location.state}, ${resume.location.country}`
        : "N/A",
      "Profile Type": resume.profileType || "N/A",
      Summary: resume.summary || "N/A",
      Skills: resume.skills
        ? resume.skills.map((skill) => skill.skillName).join(", ")
        : "N/A",
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
    <Card className="mt-4">
      <CardBody>
        <CardTitle tag="h5">Viewed Resumes</CardTitle>

        {loading && <Spinner color="primary" />}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && (
          <>
            <Table bordered className="mt-3">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" onChange={handleSelectAll} />
                  </th>
                  <th>Sr. No.</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {viewedResumes?.map((resume, index) => (
                  <tr key={resume.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedResumes[resume.id] || false}
                        onChange={() => handleCheckboxChange(resume.id)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{resume.fullName}</td>
                    <td>{resume.email}</td>
                    <td>{resume.phone}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button color="success" className="mt-3" onClick={downloadSelected}>
              Download Selected
            </Button>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default ViewedResumes;
