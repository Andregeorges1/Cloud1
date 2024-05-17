// src/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const linkStyle = {
    margin: '10px',
    textDecoration: 'none',
    color: 'blue',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  };

  const titleStyle = {
    color: '#333',
    fontSize: '2em',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Welcome to My App</h1>
      <div>
        <Link style={linkStyle} to="/book">Go to Book App</Link>
      </div>
      <div>
        <Link style={linkStyle} to="/article">Go to Article App</Link>
      </div>
    </div>
  );
};

export default HomePage;