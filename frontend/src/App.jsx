import { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Homepage } from "./pages/homepage/homepage.jsx";
import { Tours } from "./pages/Tours/Tours.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/tours" element={<Tours />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
