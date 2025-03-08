import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const ProfileDetails = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userType, setUserType] = useState("");

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
      balance,
      expiry,
      certifications,
      languages,
      projects,
      education,
      skills,
      experience,
      ...(userType === "employer" && { gst, companyId, pucName, pucEmail, pucPhone }),
    };

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
  const handleChange = (e, index, field, setState) => {
    const { name, value } = e.target;
    const updatedArray = [...setState];
    updatedArray[index][field] = value;
    setState(updatedArray);
  };

  // Add/remove for arrays
  const addItem = (state, setState, item) => setState([...state, item]);
  const removeItem = (index, state, setState) => setState(state.filter((_, i) => i !== index));

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>No data available</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Profile Details</h2>

      <button
        className="btn btn-info position-absolute top-0 end-0 m-3"
        onClick={() => window.open(`/viewresume/${userData._id}`, "_blank")}>
          
        View My Resume
      </button>
      
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

          {/* Balance */}
          <h4>Balance</h4>
          <input
            type="number"
            value={balance || ""}
            onChange={(e) => setBalance(e.target.value)}
            className="form-control"
          />

          {/* Expiry */}
          <h4>Expiry</h4>
          <input
            type="date"
            value={expiry || ""}
            onChange={(e) => setExpiry(e.target.value)}
            className="form-control"
          />

          {/* Education */}
          <h4>Education</h4>
          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="mb-2">
                <label className="form-label">Degree</label>
                <input
                  type="text"
                  value={edu.degree || ""}
                  onChange={(e) => handleChange(e, index, "degree", setEducation)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Institution</label>
                <input
                  type="text"
                  value={edu.institution || ""}
                  onChange={(e) => handleChange(e, index, "institution", setEducation)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  value={edu.startDate || ""}
                  onChange={(e) => handleChange(e, index, "startDate", setEducation)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  value={edu.endDate || ""}
                  onChange={(e) => handleChange(e, index, "endDate", setEducation)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea
                  value={edu.description || ""}
                  onChange={(e) => handleChange(e, index, "description", setEducation)}
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => removeItem(index, education, setEducation)}
              >
                Remove Education
              </button>
            </div>
          ))}
          <button
            className="btn btn-outline-primary"
            onClick={() => addItem(education, setEducation, { degree: "", institution: "", startDate: "", endDate: "", description: "" })}
          >
            <span className="bi bi-plus-circle"></span> Add Education
          </button>

          {/* Experience */}
          <h4>Experience</h4>
          {experience.map((exp, index) => (
            <div key={index} className="mb-3">
              <div className="mb-2">
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  value={exp.jobTitle || ""}
                  onChange={(e) => handleChange(e, index, "jobTitle", setExperience)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  value={exp.companyName || ""}
                  onChange={(e) => handleChange(e, index, "companyName", setExperience)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  value={exp.startDate || ""}
                  onChange={(e) => handleChange(e, index, "startDate", setExperience)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  value={exp.endDate || ""}
                  onChange={(e) => handleChange(e, index, "endDate", setExperience)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea
                  value={exp.description || ""}
                  onChange={(e) => handleChange(e, index, "description", setExperience)}
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => removeItem(index, experience, setExperience)}
              >
                Remove Experience
              </button>
            </div>
          ))}
          <button
            className="btn btn-outline-primary"
            onClick={() => addItem(experience, setExperience, { jobTitle: "", companyName: "", startDate: "", endDate: "", description: "" })}
          >
            <span className="bi bi-plus-circle"></span> Add Experience
          </button>

          {/* Skills */}
          <h4>Skills</h4>
          {skills.map((skill, index) => (
            <div key={index} className="mb-3">
              <div className="mb-2">
                <label className="form-label">Skill Name</label>
                <input
                  type="text"
                  value={skill.skillName || ""}
                  onChange={(e) => handleChange(e, index, "skillName", setSkills)}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Proficiency</label>
                <select
                  value={skill.proficiency}
                  onChange={(e) => handleChange(e, index, "proficiency", setSkills)}
                  className="form-select"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => removeItem(index, skills, setSkills)}
              >
                Remove Skill
              </button>
            </div>
          ))}
          <button
            className="btn btn-outline-primary"
            onClick={() => addItem(skills, setSkills, { skillName: "", proficiency: "Beginner" })}
          >
            <span className="bi bi-plus-circle"></span> Add Skill
          </button>

          {/* Save Profile Button */}
          <button className="btn btn-success my-3" onClick={handleSave}>
            Save Profile
          </button>
          <button
            className="btn btn-secondary my-3 ms-2"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
          
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>

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
