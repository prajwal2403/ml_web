import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [columns, setColumns] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.error) {
        setMessage(response.data.error);
      } else {
        setMessage(response.data.message);
        setColumns(response.data.columns);
      }
    } catch (error) {
      setMessage("An error occurred while uploading the file.");
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <h2>Upload a File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv,.xlsx" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
      {columns.length > 0 && (
        <div>
          <h3>File Columns:</h3>
          <ul>
            {columns.map((column, index) => (
              <li key={index}>{column}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
