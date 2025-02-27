import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const PlaneDetails = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(""); // 'user' or 'employer'
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
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>No data available</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Profile Details</h2>
      <div className="p-4 border rounded-lg bg-gray-100">
        <p>
          <strong>Name:</strong> {userData.fullName || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {userData.email || "N/A"}
        </p>
        <p>
          <strong>Phone:</strong> {userData.mobile || "N/A"}
        </p>
       
      </div>

      <h2 className="text-xl font-bold mb-4"> {userData.profileType === "user" ? "Subscription" : "Wallet"}</h2>
      <div className="p-4 border rounded-lg bg-gray-100">
      {userData.profileType === "user" && (
          <p>
            <strong>Expiry Date:</strong>{" "}
            {moment(userData.expiry).format("DD-MM-YYYY") || "Not Available"}
          </p>
        )}

        {userData.profileType === "employer" && (
          <p>
            <strong>Current Balance:</strong> ₹{userData.balance || "0.00"}
          </p>
        )}
      </div>

      <button
        className="btn btn-primary mt-4"
        onClick={() => navigate("/payment")}
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default PlaneDetails;
