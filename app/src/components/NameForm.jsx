import React, { useState } from "react";
import axios from "axios";

const NameForm = () => {
  const [name, setName] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleInputChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name) {
      setResponseMessage("Please enter a name.");
      return;
    }
  
    console.log("Name to send:", name);  // Debugging: Check if name is captured
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/submit-name", { name });
      console.log("Response:", response.data);  // Debugging: Check the response from the backend
      setResponseMessage(response.data.message);  // Show response in the UI
    } catch (error) {
      console.error("Upload error:", error.response || error.message);  // Show error in the console
      setResponseMessage("An error occurred while submitting the name.");
    }
  };
  

  return (
    <div>
      <h2>Enter Your Name</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={handleInputChange}
          placeholder="Enter your name"
        />
        <button type="submit">Submit</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default NameForm;
