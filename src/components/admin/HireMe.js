import React, { useEffect, useState } from "react";
import axios from "axios";

const ResponsesList = () => {
  const [responses, setResponses] = useState([]); // Stores fetched responses
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch responses when the component loads
  useEffect(() => {
    getResponses();
  }, []);

  const getResponses = async () => {
    try {
      const token = localStorage.getItem("authToken"); // If authentication is needed
      const response = await axios.get("https://jobapi.crmpannel.site/auth/v1/hiremes", {
        headers: {
          Authorization: `Bearer ${token}`, // Include token if required
        },
      });

      setResponses(response.data.hiremes); // Assuming API returns { responses: [...] }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching responses:", err);
      setError("Failed to fetch responses.");
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Submitted Responses</h2>
      {error && <p className="text-danger">{error}</p>}

      <div className="mb-3 text-end">
        <button className="btn btn-secondary" onClick={getResponses}>
          Refresh List
        </button>
      </div>

      {loading ? (
        <p>Loading responses...</p>
      ) : responses?.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Role</th>
                <th>Company</th>
                <th>Company Address</th>
                <th>Company POC</th>
                <th>Company Contact</th>
                <th>Date of Joining</th>
                <th>Salary</th>
                <th>Job Description</th>
              </tr>
            </thead>
            <tbody>
              {responses?.map((res) => (
                <tr key={res._id}>
                  <td>{res.name || "N/A"}</td>
                  <td>{res.mobile || "N/A"}</td>
                  <td>{res.email || "N/A"}</td>
                  <td>{res.role || "N/A"}</td>
                  <td>{res.company || "N/A"}</td>
                  <td>{res.companyAdd || "N/A"}</td>
                  <td>{res.companyPOC || "N/A"}</td>
                  <td>{res.companyNo || "N/A"}</td>
                  <td>{res.doj ? new Date(res.doj).toLocaleDateString() : "N/A"}</td>
                  <td>{res.salary || "N/A"}</td>
                  <td>{res.description || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No responses found.</p>
      )}
    </div>
  );
};

export default ResponsesList;
