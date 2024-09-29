import React, { useEffect, useState } from 'react';
import Map from "./Map";
import Landing from "./Landing"
import MarkerInfo from './MarkerInfo';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './Login';
function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<Landing />} />

          <Route path="/map" element={<Map />} />

          <Route path="/marker/:id" element={<MarkerInfo />} />
          <Route path="/login" element={<Login />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;