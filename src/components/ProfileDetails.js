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

          if (data.data.profileType === "employer") {
            setGst(data.data.gst || "");
            setCompanyId(data.data.companyId || "");
            setPucName(data.data.pucName || "");
            setPucEmail(data.data.pucEmail || "");
            setPucPhone(data.data.pucPhone || "");
          }
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

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>No data available</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Profile Details</h2>
      <div className="p-4 border rounded-lg bg-gray-100">
        <div className="mb-3">
          <label className="font-bold">Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="form-control"
            disabled={!isEditing}
          />
        </div>

        <div className="mb-3">
          <label className="font-bold">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            disabled={!isEditing}
          />
        </div>

        <div className="mb-3">
          <label className="font-bold">Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="form-control"
            disabled={!isEditing}
          />
        </div>

        {userType === "employer" && (
          <>
            <div className="mb-3">
              <label className="font-bold">GST ID:</label>
              <input
                type="text"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="mb-3">
              <label className="font-bold">Company ID:</label>
              <input
                type="text"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="mb-3">
              <label className="font-bold">PUC Name:</label>
              <input
                type="text"
                value={pucName}
                onChange={(e) => setPucName(e.target.value)}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="mb-3">
              <label className="font-bold">PUC Email:</label>
              <input
                type="email"
                value={pucEmail}
                onChange={(e) => setPucEmail(e.target.value)}
                className="form-control"
                disabled={!isEditing}
              />
            </div>

            <div className="mb-3">
              <label className="font-bold">PUC Phone:</label>
              <input
                type="tel"
                value={pucPhone}
                onChange={(e) => setPucPhone(e.target.value)}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
          </>
        )}
      </div>

      {/* Edit & Save Buttons */}
      <div className="mt-4">
        {!isEditing ? (
          <button className="btn btn-primary mr-2" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        ) : (
          <>
            <button className="btn btn-success mr-2" onClick={handleSave}>
              Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setIsEditing(false);
                setFullName(userData.fullName || "");
                setEmail(userData.email || "");
                setPhone(userData.mobile || "");
                if (userType === "employer") {
                  setGst(userData.gst || "");
                  setCompanyId(userData.companyId || "");
                  setPucName(userData.pucName || "");
                  setPucEmail(userData.pucEmail || "");
                  setPucPhone(userData.pucPhone || "");
                }
              }}
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
