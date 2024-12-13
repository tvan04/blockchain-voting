import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://blockchain-voting-i0xo.onrender.com");

const Login: React.FC = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const generateAddress = () => {
    return `0x${Math.random().toString(16).slice(2, 10)}`;
  };

  const handleLogin = () => {
    const user = { name, address: generateAddress() };
    socket.emit("join", user);
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/voting");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Enter your first name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: "10px", fontSize: "16px" }}
      />
      <button onClick={handleLogin} style={{ padding: "10px 20px", marginLeft: "10px" }}>
        Login
      </button>
    </div>
  );
};

export default Login;
