import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Resume = () => {
    const { id } = useParams();
    const [resume, setResume] = useState({});
    const [selectedTemplate, setSelectedTemplate] = useState("Minimalist");
    const userToken = localStorage.getItem('authToken');

    useEffect(() => {
        if(id){
        fetchResume();
        }
    }, [id]);

    const fetchResume = async () => {
        try {
            const response = await fetch(`https://jobapi.crmpannel.site/auth/v1/user?id=${id}`, {
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

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const ResumeContent = () => (
        <div>
            {resume.education?.length > 0 && (
                <section className="mb-4">
                    <h3 className="text-primary">Education</h3>
                    {resume.education.map((edu, index) => (
                        <div key={index} className="border-bottom pb-2">
                            <h5 className="fw-bold">{edu.degree}</h5>
                            <p className="text-muted">{edu.institution} ({formatDate(edu.startDate)} - {formatDate(edu.endDate)})</p>
                        </div>
                    ))}
                </section>
            )}
            {resume.experience?.length > 0 && (
                <section className="mb-4">
                    <h3 className="text-primary">Experience</h3>
                    {resume.experience.map((exp, index) => (
                        <div key={index} className="border-bottom pb-2">
                            <h5 className="fw-bold">{exp.jobTitle} at {exp.company}</h5>
                            <p className="text-muted">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                        </div>
                    ))}
                </section>
            )}
            {resume.skills?.length > 0 && (
                <section className="mb-4">
                    <h3 className="text-primary">Skills</h3>
                    <ul className="list-inline">
                        {resume.skills.map((skill, index) => (
                            <li key={index} className="badge bg-primary me-2 p-2">{skill.skillName}</li>
                        ))}
                    </ul>
                </section>
            )}
            {resume.projects?.length > 0 && (
                <section className="mb-4">
                    <h3 className="text-primary">Projects</h3>
                    {resume.projects.map((proj, index) => (
                        <div key={index} className="border-bottom pb-2">
                            <h5 className="fw-bold">Project Name:{proj.projectName}</h5>
                            <p className="text-muted">Description:{proj.description}</p>
                            <h4 className="text-muted">Technologies: {proj.technologiesUsed}</h4>
                        </div>
                    ))}
                </section>
            )}
            {resume.certifications?.length > 0 && (
                <section className="mb-4">
                    <h3 className="text-primary">Certifications</h3>
                    {resume.certifications.map((cert, index) => (
                        <div key={index} className="border-bottom pb-2">
                            <h5 className="fw-bold">{cert.name}</h5>
                            <p className="text-muted">{cert.authority} ({formatDate(cert.issuedDate)})</p>
                        </div>
                    ))}
                </section>
            )}
            {resume.languages?.length > 0 && (
                <section className="mb-4">
                    <h3 className="text-primary">Languages</h3>
                    <ul className="list-inline">
                        {resume.languages.map((lang, index) => (
                            <li key={index} className="badge bg-primary me-2 p-2">{lang.language} ({lang.proficiency})</li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );

    const templates = {
        Minimalist: () => (
            <div className="container mt-5 p-4 border rounded shadow-lg bg-white">
                <header className="text-center mb-4">
                    <h1 className="fw-bold text-primary">{resume.fullName || "Your Name"}</h1>
                    <p className="text-muted">{resume.email || "your.email@example.com"} | {resume.phone || "Your Phone"}</p>
                </header>
                <ResumeContent />
            </div>
        ),
        Classic: () => (
            <div className="container mt-5 p-4 border rounded shadow-lg bg-white">
                <header className="text-center mb-4">
                    <h1 className="fw-bold text-dark">{resume.fullName || "Your Name"}</h1>
                    <h4 className="text-muted">{resume.email || "your.email@example.com"} | {resume.phone || "Your Phone"}</h4>
                </header>
                <ResumeContent />
            </div>
        ),
        Modern: () => (
            <div className="container mt-5 p-5 border rounded shadow-lg bg-light text-center">
                <h1 className="fw-bold text-dark">{resume.fullName || "Your Name"}</h1>
                <h4 className="text-muted">{resume.email || "your.email@example.com"} | {resume.phone || "Your Phone"}</h4>
                <div className="mt-4 p-3 bg-white shadow rounded">
                    <ResumeContent />
                </div>
            </div>
        )
    };

    return (
        <div>
            <div className="mb-3 text-center">
                <label className="me-2 fw-bold">Choose Template:</label>
                <select className="form-select w-auto d-inline border-primary shadow-sm rounded p-2" onChange={(e) => setSelectedTemplate(e.target.value)}>
                    {Object.keys(templates).map(template => (
                        <option key={template} value={template}>{template}</option>
                    ))}
                </select>
            </div>
            {React.createElement(templates[selectedTemplate])}
        </div>
    );
};

export default Resume;
