import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.tsx";
import Voting from "./components/Voting.tsx";
import Dashboard from "./components/Dashboard.tsx";
import Rewards from "./components/Rewards.tsx";
import ResetServer from "./components/ResetServer.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/voting" element={<Voting />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/reset" element={<ResetServer />} />
      </Routes>
    </Router>
  );
};

export default App;
