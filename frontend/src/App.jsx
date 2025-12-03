import { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Homepage } from "./pages/homepage/Homepage.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
