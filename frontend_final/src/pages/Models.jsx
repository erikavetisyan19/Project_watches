import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./Models_styles.css";

// Component to display watch models
const Models = () => {
  const [models, setModels] = useState([]);

  // Fetch all models from the backend API
  useEffect(() => {
    const fetchAllModels = async () => {
      try {
        // Make a GET request to retrieve models from the backend API using axios
        const res = await axios.get("http://localhost:8800/models");
        setModels(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllModels();
  }, []);

  // Function to handle deletion of a model
  const handleDelete = async (id) => {
    try {
      // Send a DELETE request to the backend API to delete the model by ID
      await axios.delete("http://localhost:8800/models/" + id);
      window.location.reload(); // Refresh the page after deletion
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="card-container">
      <h1 style={{ color: "white", fontSize: "40px" }}>Watches and Wonders</h1>
      <div className="models">
        {models.map((model) => (
          <div className="model" key={model.id}>
            {model.face && <img src={`http://localhost:8800/uploads/${model.face}`} alt="" />} {/* Display the model's face image */}
            <h2>{model.Title}</h2>
            <p>{model.desc}</p>
            <span>${model.price}</span>
            <button className="delete" onClick={() => handleDelete(model.id)}>Delete</button>
            <button className="update"><Link to={`/update/${model.id}`}>Update</Link></button>
          </div>
        ))}
      </div>
      <button className="add-button">
        <Link to="/add">Add new watch</Link>
      </button>
    </div>
  );
};

export default Models;
