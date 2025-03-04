import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Card, CardBody, CardTitle, Button, Input } from "reactstrap";

const BulkUser = () => {
  const [file, setFile] = useState(null);
  const authToken = localStorage.getItem("authToken");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      try {
        await axios.patch(`https://jobapi.crmpannel.site/auth/v1/bulkuser`, sheetData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        alert("Users uploaded successfully!");
        setFile(null);
      } catch (error) {
        console.error("Error uploading users:", error);
        alert("Failed to upload users.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Bulk User Upload</CardTitle>

        <div className="d-flex gap-2">
          <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
          <Button color="primary" onClick={handleUpload}>Upload</Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default BulkUser;
