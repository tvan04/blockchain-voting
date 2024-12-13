import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const Voting: React.FC = () => {
  const [vote, setVote] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleVote = () => {
    if (vote) {
      socket.emit("vote", { name: user.name, address: user.address, vote });
      navigate("/dashboard");
    }
  };
  

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Vote: Cats vs Dogs</h1>
      <button onClick={() => setVote("Cats")} style={{ margin: "10px", padding: "10px 20px" }}>
        Cats
      </button>
      <button onClick={() => setVote("Dogs")} style={{ margin: "10px", padding: "10px 20px" }}>
        Dogs
      </button>
      <button onClick={handleVote} style={{ display: "block", margin: "20px auto", padding: "10px 20px" }}>
        Submit Vote
      </button>
    </div>
  );
};

export default Voting;
