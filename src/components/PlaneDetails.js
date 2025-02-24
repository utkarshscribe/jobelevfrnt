import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PlaneDetails = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(""); // 'user' or 'employer'
  const [balance, setBalance] = useState(null); // Store balance details
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    setUserType(storedUserType);

    fetch("https://jobapi.crmpannel.site/auth/v1/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setLoading(false);
      });

    fetch("https://jobapi.crmpannel.site/auth/v1/user/:id", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBalance(data))
      .catch((err) => console.error("Error fetching balance:", err));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>No data available</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Subscription Details</h2>
      <div className="p-4 border rounded-lg bg-gray-100">
        <p>
          <strong>Expiry Date:</strong> {userData.expiry_date || "Not Available"}
        </p>

        {userType === "employer" && userData.paymentDetails && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Payment Details</h3>
            <p>
              <strong>Payment ID:</strong> {userData.paymentDetails.id || "N/A"}
            </p>
            <p>
              <strong>Amount Paid:</strong> ₹{userData.paymentDetails.amount / 100 || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {userData.paymentDetails.status || "N/A"}
            </p>
          </div>
        )}

        {balance && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Balance Details</h3>
            <p>
              <strong>Current Balance:</strong> ₹{balance.amount || "0.00"}
            </p>
            <p>
              <strong>Last Transaction:</strong> {balance.last_transaction || "N/A"}
            </p>
          </div>
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