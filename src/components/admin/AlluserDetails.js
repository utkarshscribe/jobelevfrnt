import React, { useEffect, useState } from "react";
import axios from "axios";

const AlluserDetails = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://jobapi.crmpannel.site/auth/v1/users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary text-center">All Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark text-center">
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
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.fullName || "N/A"}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "N/A"}</td>
                    
                    <td>
                      {user.location
                        ? `${user.location.city || "N/A"}, ${user.location.state || "N/A"}, ${user.location.country || "N/A"}`
                        : "N/A"}
                    </td>
                    <td>{user.summary || "N/A"}</td>
                    <td>
                      {user.skills && user.skills.length > 0
                        ? user.skills.map((skill, i) => (
                            <span key={i} className="badge bg-primary me-1">{`${skill.skillName} (${skill.proficiency})`}</span>
                          ))
                        : "N/A"}
                    </td>
                    <td>
                      {user.experience && user.experience.length > 0
                        ? user.experience.map((exp, i) => (
                            <p key={i}>
                              {exp.jobTitle} at {exp.company} ({exp.startDate ? new Date(exp.startDate).getFullYear() : "N/A"} -{" "}
                              {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"})
                            </p>
                          ))
                        : "N/A"}
                    </td>
                    <td>
                      {user.education && user.education.length > 0
                        ? user.education.map((edu, i) => (
                            <p key={i}>
                              {edu.degree} from {edu.institution} ({edu.startDate ? new Date(edu.startDate).getFullYear() : "N/A"} -{" "}
                              {edu.endDate ? new Date(edu.endDate).getFullYear() : "N/A"})
                            </p>
                          ))
                        : "N/A"}
                    </td>
                    <td>
                      {user.certifications && user.certifications.length > 0
                        ? user.certifications.map((cert, i) => (
                            <p key={i}>
                              {cert.title} ({cert.institution}, {cert.dateIssued ? new Date(cert.dateIssued).getFullYear() : "N/A"})
                            </p>
                          ))
                        : "N/A"}
                    </td>
                    <td>
                      {user.languages && user.languages.length > 0
                        ? user.languages.map((lang, i) => (
                            <span key={i} className="badge bg-success me-1">{`${lang.language} (${lang.proficiency})`}</span>
                          ))
                        : "N/A"}
                    </td>
                    
                    <td>
                      {user.projects && user.projects.length > 0
                        ? user.projects.map((proj, i) => (
                            <p key={i}>
                              {proj.projectName} ({proj.startDate ? new Date(proj.startDate).getFullYear() : "N/A"} -{" "}
                              {proj.endDate ? new Date(proj.endDate).getFullYear() : "N/A"})
                            </p>
                          ))
                        : "N/A"}
                    </td>
                    </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="19" className="text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AlluserDetails;
