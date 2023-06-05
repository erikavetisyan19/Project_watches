import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Add_styles.css';

const Add = () => {
  const [model, setModel] = useState({
    Title: '',
    desc: '',
    price: '',
    face: null,
  });

  const navigate = useNavigate();

  // Function to handle input change
  const handleChange = (e) => {
    setModel((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Function to handle file upload
  const handleFileUpload = (e) => {
    setModel((prev) => ({ ...prev, face: e.target.files[0] }));
  };

  // Function to handle button click for adding a model
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('Title', model.Title);
      formData.append('desc', model.desc);
      formData.append('price', model.price);
      formData.append('face', model.face);

      // Send a POST request to the backend API to add the model
      await axios.post('http://localhost:8800/models', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Navigate back to the home page after successful addition
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  console.log(model); // Log the current model object for debugging purposes

  return (
    <div className="login-box">
      <h2>Add New Watch</h2>
      <form>
        <div className="user-box">
          <input type="text" name="Title" required="" onChange={handleChange} />
          <label>Title</label>
        </div>
        <div className="user-box">
          <input type="text" name="desc" required="" onChange={handleChange} />
          <label>Description</label>
        </div>
        <div className="user-box">
          <input type="number" name="price" required="" onChange={handleChange} />
          <label>Price</label>
        </div>
        <div className="user-box">
          <input type="file" name="face" required="" onChange={handleFileUpload} accept="image/*" />
          <label>Face</label>
        </div>
        <button
          style={{
            backgroundColor: '#03e9f4',
            color: '#141e30',
            padding: '14px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
          onClick={handleClick}
        >
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Add
        </button>
      </form>
    </div>
  );
};

export default Add;
