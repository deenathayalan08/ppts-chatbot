import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Generate from "./Generate";
import Edit from "./Edit";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/edit" element={<Edit />} />
      </Routes>
    </Router>
  );
};

export default App;
