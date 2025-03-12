import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Resume = () => {
    const { id } = useParams();
    const [resume, setResume] = useState({});
    const userToken = localStorage.getItem('authToken');

    useEffect(() => {
        fetchResume();
    }, [id]);

    const fetchResume = async () => {
        try {
            const response = await fetch(`http://jobapi.crmpannel.site/auth/v1/user?id=${id}`, {
                headers: {
                    authorization: `Bearer ${userToken}`,
                }
            });
            const result = await response.json();
            if (result && result.data) {
                setResume(result.data);
                console.log("Fetched Resume Data:", result.data);
            } else {
                console.error("No resume data found");
            }
        } catch (error) {
            console.error("Error fetching resume:", error);
        }
    };

    // Function to format date properly
    const formatDate = (dateString) => {
        if (!dateString) return "N/A"; // Handle missing dates
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="container mt-5 p-4 border rounded shadow-lg bg-white">
            <header className="text-center mb-4">
                <h1 className="fw-bold text-primary">{resume.fullName || "Your Name"}</h1>
                <p className="text-muted">{resume.email || "your.email@example.com"} | {resume.phone || "Your Phone"}</p>
                <p>{resume.location?.city || "City"}, {resume.location?.state || "State"}, {resume.location?.country || "Country"}</p>
            </header>

            {resume.summary && (
                <section className="mb-4 p-3 bg-light rounded">
                    <h3 className="border-bottom pb-2 text-secondary">Summary</h3>
                    <p>{resume.summary}</p>
                </section>
            )}

            {resume.education?.length > 0 && (
                <section className="mb-4 p-3 border rounded">
                    <h3 className="border-bottom pb-2 text-secondary">Education</h3>
                    {resume.education.map((edu, index) => (
                        <div key={index} className="mb-3">
                            <h5 className="fw-bold text-dark">{edu.degree || "Degree"}</h5>
                            <p className="m-0 text-muted">{edu.institution || "Institution"}</p>
                            <p className="text-muted">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                        </div>
                    ))}
                </section>
            )}

            {resume.experience?.length > 0 && (
                <section className="mb-4 p-3 border rounded">
                    <h3 className="border-bottom pb-2 text-secondary">Experience</h3>
                    {resume.experience.map((exp, index) => (
                        <div key={index} className="mb-3">
                            <h5 className="fw-bold text-dark">{exp.jobTitle || "Job Title"}</h5>
                            <p className="m-0 text-muted">{exp.company || "Company"}</p>
                            <p className="text-muted">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                        </div>
                    ))}
                </section>
            )}

            {resume.skills?.length > 0 && (
                <section className="mb-4 p-3 border rounded">
                    <h3 className="border-bottom pb-2 text-secondary">Skills</h3>
                    <ul className="list-unstyled d-flex flex-wrap">
                        {resume.skills.map((skill, index) => (
                            <li key={index} className="badge bg-primary me-2 p-2">{skill.skillName || "Skill"}</li>
                        ))}
                    </ul>
                </section>
            )}

            {resume.certifications?.length > 0 && (
                <section className="mb-4 p-3 border rounded">
                    <h3 className="border-bottom pb-2 text-secondary">Certifications</h3>
                    {resume.certifications.map((cert, index) => (
                        <div key={index} className="mb-3">
                            <h5 className="fw-bold text-dark">{cert.title || "Certification"}</h5>
                            <p className="text-muted">{cert.institution || "Institution"}</p>
                        </div>
                    ))}
                </section>
            )}

            {resume.projects?.length > 0 && (
                <section className="mb-4 p-3 border rounded">
                    <h3 className="border-bottom pb-2 text-secondary">Projects</h3>
                    {resume.projects.map((proj, index) => (
                        <div key={index} className="mb-3">
                            <h5 className="fw-bold text-dark">{proj.projectName || "Project Name"}</h5>
                            <p className="text-muted">{proj.description || "Project Description"}</p>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
};

export default Resume;
