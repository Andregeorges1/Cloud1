// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import BookApp from './BookApp'; // Assuming you already have BookApp.js
import ArticleApp from './ArticleApp'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<BookApp />} />
          <Route path="/article" element={<ArticleApp />} />
          {/* Add Route for ArticleApp when it's created */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
