import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const ProfileDetails = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userType, setUserType] = useState("");
  const [profileType, setProfileType] = useState("");

  // Profile fields state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Employer fields state
  const [gst, setGst] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [pucName, setPucName] = useState("");
  const [pucEmail, setPucEmail] = useState("");
  const [pucPhone, setPucPhone] = useState("");

  // Location and other details
  const [location, setLocation] = useState({
    city: "",
    state: "",
    country: ""
  });
  const [summary, setSummary] = useState("");
  const [balance, setBalance] = useState(0);
  const [expiry, setExpiry] = useState("");

  // Certifications, Languages, Projects
  const [certifications, setCertifications] = useState([{ title: "", institution: "", dateIssued: "", expirationDate: "" }]);
  const [languages, setLanguages] = useState([{ language: "", proficiency: "Basic" }]);
  const [projects, setProjects] = useState([{ projectName: "", description: "", technologiesUsed: "", startDate: "", endDate: "" }]);

  // Education, Skills, Experience fields state
  const [education, setEducation] = useState([{ degree: "", institution: "", startDate: "", endDate: "", description: "" }]);
  const [skills, setSkills] = useState([{ skillName: "", proficiency: "Beginner" }]);
  const [experience, setExperience] = useState([{ jobTitle: "", companyName: "", startDate: "", endDate: "", description: "" }]);

  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);

    fetch("https://jobapi.crmpannel.site/auth/v1/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setUserData(data.data);

          // Set initial values for editing
          setFullName(data.data.fullName || "");
          setEmail(data.data.email || "");
          setPhone(data.data.phone || "");

          // Set Employer fields if profileType is employer
          if (data.data.profileType === "employer") {
            setGst(data.data.gst || "");
            setCompanyId(data.data.companyId || "");
            setPucName(data.data.pucName || "");
            setPucEmail(data.data.pucEmail || "");
            setPucPhone(data.data.pucPhone || "");
          }

          // Set Education, Skills, Experience, Certifications, Languages, and Projects
          setEducation(data.data.education || [{ degree: "", institution: "", startDate: "", endDate: "", description: "" }]);
          setSkills(data.data.skills || [{ skillName: "", proficiency: "Beginner" }]);
          setExperience(data.data.experience || [{ jobTitle: "", companyName: "", startDate: "", endDate: "", description: "" }]);
          setCertifications(data.data.certifications || [{ title: "", institution: "", dateIssued: "", expirationDate: "" }]);
          setLanguages(data.data.languages || [{ language: "", proficiency: "Basic" }]);
          setProjects(data.data.projects || [{ projectName: "", description: "", technologiesUsed: "", startDate: "", endDate: "" }]);
          setLocation(data.data.location || { city: "", state: "", country: "" });
          setSummary(data.data.summary || "");
          setBalance(data.data.balance || 0);
          setExpiry(data.data.expiry || "");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setLoading(false);
      });
  }, []);

  const handleSave = () => {
    const updatedData = {
      fullName,
      email,
      mobile: phone,
      location,
      summary,
      certifications,
      languages,
      projects,
      education,
      skills,
      experience,
      gst, 
      companyId,
      pucName,
      pucEmail,
      pucPhone};

    fetch("https://jobapi.crmpannel.site/auth/v1/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Profile updated successfully!");
        setUserData({ ...userData, ...updatedData });
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert("Failed to update profile.");
      });
  };

  

  // Handle change for all form fields
  const handleChange = (setFunction, index, field, value) => {
    setFunction((prevItems) =>
      prevItems.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };
   
  const addItem = (setFunction, newItem) => {
    setFunction((prevItems) => [...prevItems, newItem]);
  };
   
  const removeItem = (setFunction, index) => {
    setFunction((prevItems) => prevItems.filter((_, i) => i !== index));
  };
  

  // Function to add a new education entry

  
  

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>No data available</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Profile Details</h2>
      {(userData.profileType === "user" &&  (
        <>
      <button
        className="btn btn-info position-absolute top-0 end-0 m-3"
        onClick={() => window.open(`/viewresume/${userData._id}`, "_blank")}>  
        View My Resume
      </button>
      </>
      ))}
        <div>
          <h4>Personal Information</h4>
          <div className="mb-2">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={fullName || ""}
              onChange={(e) => setFullName(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Phone</label>
            <input
              type="text"
              name="phone"
              value={phone || ""}
              onChange={(e) => setPhone(e.target.value)}
              className="form-control"
            />
          </div>

          {userData.profileType === "user" && (
            <>
          {/* Location */}
          <h4>Location</h4>
          <div className="mb-2">
            <label className="form-label">City</label>
            <input
              type="text"
              value={location.city || ""}
              onChange={(e) => setLocation({ ...location, city: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">State</label>
            <input
              type="text"
              value={location.state || ""}
              onChange={(e) => setLocation({ ...location, state: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Country</label>
            <input
              type="text"
              value={location.country || ""}
              onChange={(e) => setLocation({ ...location, country: e.target.value })}
              className="form-control"
            />
          </div>

          {/* Summary */}
          <h4>Summary</h4>
          <textarea
            value={summary || ""}
            onChange={(e) => setSummary(e.target.value)}
            className="form-control"
            rows="3"
          ></textarea>

          
          {/* Education */}
          
          <h4>Education</h4>
          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="mb-2">
                <label className="form-label">Degree</label>
                <input
                  type="text"
                  value={edu.degree || ""}
                  onChange={(e) => handleChange(setEducation, index, "degree", e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Institution</label>
                <input
                  type="text"
                  value={edu.institution || ""}
                  onChange={(e) => handleChange(setEducation, index, "institution", e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  value={edu.startDate || ""}
                  onChange={(e) => handleChange(setEducation, index, "startDate", e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  value={edu.endDate || ""}
                  onChange={(e) => handleChange(setEducation, index, "endDate", e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea
                  value={edu.description || ""}
                  onChange={(e) => handleChange(setEducation, index, "description", e.target.value)}
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => removeItem(setEducation, index)}
              >
                Remove Education
              </button>
            </div>
          ))}
          <button
            className="btn btn-outline-primary"
            onClick={() => addItem(setEducation, { degree: "", institution: "", startDate: "", endDate: "", description: "" })}
          >
            <span className="bi bi-plus-circle"></span> Add Education
          </button>


          <h4>Experience</h4>
          {experience.map((exp, index) => (
            <div key={index} className="mb-3">
              <div className="mb-2">
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  value={exp.jobTitle || ""}
                  onChange={(e) => handleChange(setExperience, index, "jobTitle", e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  value={exp.company || ""}
                  onChange={(e) => handleChange(setExperience, index, "company", e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  value={exp.startDate || ""}
                  onChange={(e) => handleChange(setExperience, index, "startDate", e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  value={exp.endDate || ""}
                  onChange={(e) => handleChange(setExperience, index, "endDate", e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea
                  value={exp.description || ""}
                  onChange={(e) => handleChange(setExperience, index, "description", e.target.value)}
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>
              <button className="btn btn-danger" onClick={() => removeItem(setExperience, index)}>
                Remove Experience
              </button>
            </div>
          ))}
          <button className="btn btn-outline-primary" onClick={() => addItem(setExperience, { jobTitle: "", company: "", startDate: "", endDate: "", description: "" })}>
            <span className="bi bi-plus-circle"></span> Add Experience
          </button>


          {/* Skills */}
          <h4>Skills</h4>
          {skills.map((skill, index) => (
            <div key={index} className="mb-3 d-flex flex-column">
              <div className="mb-2">
                <label className="form-label">Skill Name</label>
                <input
                  type="text"
                  value={skill.skillName || ""}
                  onChange={(e) => handleChange(setSkills, index, "skillName", e.target.value)}
                  className="form-control"
                  placeholder="Skill Name"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Proficiency</label>
                <select
                  value={skill.proficiency || "Beginner"}
                  onChange={(e) => handleChange(setSkills, index, "proficiency", e.target.value)}
                  className="form-select"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <button className="btn btn-danger" onClick={() => removeItem(setSkills, index)}>
                          Remove Skills
                        </button>
            </div>
          ))}

          <button
            className="btn btn-outline-primary"
            onClick={() => addItem(setSkills, { skillName: "", proficiency: "Beginner" })}
          >
            <span className="bi bi-plus-circle"></span> Add Skill
          </button>
          </>
          )}

        {userData.profileType === "user" && (
          <>
          <h4>Certifications</h4>
          {certifications.map((cert, index) => (
              
            <div key={index} className="mb-3">
              <div className="mb-2">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={cert.title || ""}
                  onChange={(e) => handleChange(setCertifications, index, "title", e.target.value)}
                  className="form-control"
                />
               </div>
              <div className="mb-2">
                <label className="form-label">Institution</label>
                <input
                  type="text"
                  value={cert.institution || ""}
                  onChange={(e) => handleChange(setCertifications, index, "institution", e.target.value)}
                  className="form-control"
                />  
                </div>
              <div className="mb-2">
                <label className="form-label">Date Issued</label>
                <input
                  type="date"
                  value={cert.dateIssued || ""}
                  onChange={(e) => handleChange(setCertifications, index, "dateIssued", e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Expiration Date</label>
                <input
                  type="date"
                  value={cert.expirationDate || ""}
                  onChange={(e) => handleChange(setCertifications, index, "expirationDate", e.target.value)}
                  className="form-control"
                />
              </div>
              <button className="btn btn-danger" onClick={() => removeItem(setCertifications, index)}>
                Remove Certifications
              </button>
            </div>
           
          ))}  
          
          <button className="btn btn-outline-primary" onClick={() => addItem(setCertifications, { title: "", institution: "", dateIssued: "", expirationDate: "" })}>
            <span className="bi bi-plus-circle"></span> Add Certifications</button>
          </>
        
          )}

          {userData.profileType === "user" && (
            <>
          <h4>Languages</h4>
          {languages.map((lang, index) => (
            <div key={index} className="mb-3">
              <div className="mb-2">
                <label className="form-label">Language</label>
                <input
                  type="text"
                  value={lang.language || ""}
                  onChange={(e) => handleChange(setLanguages, index, "language", e.target.value)}
                  className="form-control"
                />  
              </div>
              <div className="mb-2">
                <label className="form-label">Proficiency</label>
                <select
                  value={lang.proficiency || "Basic"}
                  onChange={(e) => handleChange(setLanguages, index, "proficiency", e.target.value)}
                  className="form-select"
                >
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select> 
              </div>
              <button className="btn btn-danger" onClick={() => removeItem(setLanguages, index)}>
                Remove Languages
              </button>
            </div>
          ))}
          <button className="btn btn-outline-primary" onClick={() => addItem(setLanguages, { language: "", proficiency: "Basic" })}>
            <span className="bi bi-plus-circle"></span> Add Languages</button>
          </>
          )}
          {userData.profileType === "user" && (
            <>
          <h4>Projects</h4>
          {projects.map((proj, index) => (
            <div key={index} className="mb-3">
              <div className="mb-2">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  value={proj.projectName || ""}
                  onChange={(e) => handleChange(setProjects, index, "projectName", e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea
                  value={proj.description || ""}
                  onChange={(e) => handleChange(setProjects, index, "description", e.target.value)}
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>
              <div className="mb-2">
                <label className="form-label">Technologies Used</label>
                <input
                  type="text"
                  value={proj.technologiesUsed || ""}
                  onChange={(e) => handleChange(setProjects, index, "technologiesUsed", e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  value={proj.startDate || ""}
                  onChange={(e) => handleChange(setProjects, index, "startDate", e.target.value)}
                  className="form-control"
                />

              </div>
              <div className="mb-2">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  value={proj.endDate || ""}
                  onChange={(e) => handleChange(setProjects, index, "endDate", e.target.value)}
                  className="form-control"
                />
              </div>
              <button className="btn btn-danger" onClick={() => removeItem(setProjects, index)}>
                Remove Projects
              </button>
            </div>
          ))}
          <button className="btn btn-outline-primary" onClick={() => addItem(setProjects, { projectName: "", description: "", technologiesUsed: "", startDate: "", endDate: "" })}>
            <span className="bi bi-plus-circle"></span> Add Projects</button>
          </>
          )}
          
          {(userData.profileType === "employer" && (
             <>
             <div className="mb-3">
                  <label className="form-label">GST ID</label>
                  <input
                    type="text"
                    placeholder="GST ID"
                    value={gst}
                    onChange={(e) => setGst(e.target.value)}
                    className="form-control" 
                  />
                </div>


             <div className="mb-3">
              <label className="form-label">Company ID</label>
               <input
                 type="text"
                 placeholder="Company ID"
                 value={companyId}
                 onChange={(e) => setCompanyId(e.target.value)}
                 className="form-control"
                 required 
                />
               
             </div>

             <div className="mb-3">
                <label className="form-label">POC Name</label>
               <input
                 type="text"
                 placeholder="POC Name"
                 value={pucName}
                 onChange={(e) => setPucName(e.target.value)}
                 className="form-control"
                 required
               />
             </div>

             <div className="mb-3">
                <label className="form-label">POC Email</label>
               <input
                 type="email"
                 placeholder="POC Email"
                 value={pucEmail}
                 onChange={(e) => setPucEmail(e.target.value)}
                 className="form-control"
                 required
               />
             </div>

             <div className="mb-3">
                <label className="form-label">POC Phone</label>
               <input
                 type="tel"
                 placeholder="POC Phone"
                 value={pucPhone}
                 onChange={(e) => setPucPhone(e.target.value)}
                 className="form-control"
                 required
               />
             </div>
           </>
          ))}
          {/* Save Profile Button */}
          {!isEditing ? (
            <button className="btn btn-primary bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-300 hover:bg-blue-700 active:scale-95 mt-8 mr-4" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
          <>
          <button className="btn btn-success my-3" onClick={handleSave}>
            Save Profile
          </button>
          <button
            className="btn btn-secondary my-3 ms-2"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
          </>
          )}
        </div>
          
         

          <h2 className="text-xl font-bold mt-6">
        {userData.profileType === "user" ? "Subscription" : "Wallet"}
      </h2>
      <div className="p-4 border rounded-lg bg-gray-100">
        {userData.profileType === "user" && (
          <p>
            <strong>Expiry Date:</strong> {moment(userData.expiry).format("DD-MM-YYYY") || "Not Available"}
          </p>
        )}
        {userData.profileType === "employer" && <p><strong>Current Balance:</strong> ₹{userData.balance || "0.00"}</p>}
      </div>
      <button
        className="btn btn-primary mt-4"
        onClick={() => navigate(`/payment/${userData.profileType}`)}>
        Proceed to Payment
      </button>
        </div>
    
    
  );
};

export default ProfileDetails;
