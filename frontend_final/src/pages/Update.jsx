import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Add_styles.css';

const Update = () => {
  const [model, setModel] = useState({
    Title: '',
    desc: '',
    price: '',
    face: '',
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Extract the model ID from the URL path
  const modelId = location.pathname.split("/")[2];

  useEffect(() => {
    // Fetch the existing data for the model using the modelId
    const fetchModelData = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/models/${modelId}`);
        const { Title, desc, price, face } = response.data;
        setModel({ Title, desc, price, face: face.toString() }); // Convert face to string
      } catch (err) {
        console.log(err);
      }
    };

    fetchModelData();
  }, [modelId]);

  const handleChange = (e) => {
    if (e.target.name === 'face') {
      // Handle image file
      setModel((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
    } else {
      setModel((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('Title', model.Title);
      formData.append('desc', model.desc);
      formData.append('price', model.price);
      if (typeof model.face === 'string') {
        // If the face is a string, no changes were made to the image
        formData.append('face', '');
      } else {
        // If the face is a File object, append the new image file
        formData.append('face', model.face);
      }
  
      // Send a PUT request to update the model data using the modelId
      await axios.put(`http://localhost:8800/models/${modelId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the correct content type
        },
      });
  
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    <div className="login-box">
      <h2>Update Watch</h2>
      <form>
        <div className="user-box">
          <input type="text" name="Title" required value={model.Title} onChange={handleChange} />
          <label>Title</label>
        </div>
        <div className="user-box">
          <input type="text" name="desc" required value={model.desc} onChange={handleChange} />
          <label>Description</label>
        </div>
        <div className="user-box">
          <input type="number" name="price" required value={model.price} onChange={handleChange} />
          <label>Price</label>
        </div>
        <div className="user-box">
          <input type="file" name="face" required onChange={handleChange} accept="image/*" />
          <label>Face</label>
        </div>
        <button style={{ backgroundColor: "#03e9f4", color: "#141e30", padding: "14px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" }} onClick={handleClick}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Update
        </button>
      </form>
    </div>
  );
};

export default Update;
