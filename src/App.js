import React from 'react';
import './App.css';
import Homepage from "./Pages/Homepage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter, Routes, and Route
import Chatpage from "./Pages/Chatpage";

function App() {
  return (
    <div className="App">
     
        <Routes>
          <Route path="/" element={<Homepage />} exact /> {/* Use element prop to render components */}
          <Route path="/chats" element={<Chatpage />} />
        </Routes>
    
    </div>
  );
}

export default App;
