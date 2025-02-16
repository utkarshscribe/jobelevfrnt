import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [remark, setRemark] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    getComplaints();
  }, []);

  const getComplaints = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("https://jobapi.crmpannel.site/auth/v1/complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response)
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const handleUpdateRemark = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `https://jobapi.crmpannel.site/auth/v1/complaint/${id}`,
        { remark: remark[id] || "" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Remark updated successfully!");
      getComplaints(); 
    } catch (error) {
      console.error("Error updating remark:", error);
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "resolved" ? "pending" : "resolved";
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `https://jobapi.crmpannel.site/auth/v1/complaint/${id}`,
        { cStatus: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(`Status updated to ${newStatus}!`);
      getComplaints(); 
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Complaints Management</h2>
      {message && <p className="text-center text-success">{message}</p>}

      <div className="mb-3 text-end">
        <button className="btn btn-secondary" onClick={getComplaints}>
          Refresh List
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Contact</th>
              <th>Date of Joining</th>
              <th>Complaint</th>
              <th>Remark</th>
              <th>Update Remark</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints?.length > 0 ? (
              complaints?.map((comp) => (
                <tr key={comp._id}>
                  <td>{comp.name || "N/A"}</td>
                  <td>{comp.email || "N/A"}</td>
                  <td>{comp.company || "N/A"}</td>
                  <td>{comp.companyNo || "N/A"}</td>
                  <td>{comp.doj ? new Date(comp.doj).toLocaleDateString() : "N/A"}</td>
                  <td>{comp.description || "No description provided"}</td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={remark[comp._id] || ""}
                      onChange={(e) => setRemark({ ...remark, [comp._id]: e.target.value })}
                    />
                  </td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleUpdateRemark(comp._id)}>
                      Save
                    </button>
                  </td>
                  <td>
                    <span className={`badge ${comp.cStatus === "resolved" ? "bg-success" : "bg-warning"}`}>
                      {comp.cStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn ${comp.cStatus === "resolved" ? "btn-danger" : "btn-success"}`}
                      onClick={() => handleUpdateStatus(comp._id, comp.cStatus)}
                    >
                      {comp.cStatus === "resolved" ? "Mark Pending" : "Mark Resolved"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminComplaints;
