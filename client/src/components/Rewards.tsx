import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

interface User {
  name: string;
  address: string;
  tokens: number;
}

const rewards = [
  { name: "Reduced Utilities", cost: 10 },
  { name: "Free Public Transit Pass", cost: 5 },
  { name: "Waived Passport Fees", cost: 3 },
];

const Rewards: React.FC = () => {
  const [userAddress, setUserAddress] = useState<string>("");
  const [userTokens, setUserTokens] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Listen for user updates
    socket.on("updateUsers", (users: User[]) => {
      const user = users.find((u) => u.address === userAddress);
      if (user) {
        setUserTokens(user.tokens);
      }
    });

    return () => {
      socket.off("updateUsers");
    };
  }, [userAddress]);

  const handleLoadTokens = () => {
    if (!userAddress.trim()) {
      setMessage("Please enter a valid address.");
      return;
    }
    // Emit a join event to load user details
    socket.emit("join", { address: userAddress });
    setMessage(""); // Clear any existing messages
  };

  const handleSpendTokens = (reward: { name: string; cost: number }) => {
    if (userTokens >= reward.cost) {
      socket.emit("spendTokens", { address: userAddress, cost: reward.cost, reward: reward.name });
      setMessage(`You redeemed ${reward.name} for ${reward.cost} tokens.`);
    } else {
      setMessage("You do not have enough tokens to redeem this reward.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Rewards Page</h1>

      {/* User Input Section */}
      <div>
        <input
          type="text"
          placeholder="Enter your address"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          style={{ padding: "10px", margin: "10px", width: "300px" }}
        />
        <button onClick={handleLoadTokens} style={{ padding: "10px" }}>
          Load My Tokens
        </button>
      </div>

      {/* Display User Tokens */}
      <h2>Your Tokens: {userTokens}</h2>

      {/* Rewards Section */}
      <h2>Available Rewards</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        {rewards.map((reward, index) => (
          <div
            key={index}
            style={{
              border: "1px solid black",
              padding: "20px",
              width: "150px",
              textAlign: "center",
              borderRadius: "10px",
            }}
          >
            <h3>{reward.name}</h3>
            <p>Cost: {reward.cost} tokens</p>
            <button
              onClick={() => handleSpendTokens(reward)}
              style={{
                padding: "10px",
                marginTop: "10px",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Redeem
            </button>
          </div>
        ))}
      </div>

      {/* Display Messages */}
      {message && <p style={{ marginTop: "20px", color: "red" }}>{message}</p>}
    </div>
  );
};

export default Rewards;
