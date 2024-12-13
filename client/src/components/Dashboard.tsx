import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";

const socket = io("http://localhost:4000");


interface Vote {
  name: string;
  address: string;
  vote: string;
}

interface User {
  name: string;
  address: string;
  tokens: number;
}

interface Purchase {
  name: string;
  address: string;
  reward: string;
}

interface Block {
  index: number;
  timestamp: string;
  data: { name: string; vote?: string; address: string; item?: string; tokens?: number };
  previousHash: string;
  hash: string;
}

const Dashboard: React.FC = () => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [blockchain, setBlockchain] = useState<Block[]>([]);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
  const navigate = useNavigate();


  useEffect(() => {

    // Fetch the blockchain from the server
    socket.on("blockchain", (updatedBlockchain: Block[]) => {
      setBlockchain(updatedBlockchain);

      // Parse votes from the blockchain
      const parsedVotes: Vote[] = [];
      updatedBlockchain.forEach((block) => {
        if (block.data.vote) {
          parsedVotes.push({ name: block.data.name, address: block.data.address, vote: block.data.vote });
        }
      });
      setVotes(parsedVotes);
    });

    // Fetch users
    socket.on("updateUsers", (newUsers: User[]) => {
      setUsers(newUsers);
    });

    // Fetch rewards
    socket.on("updateRewards", (updatedRewards: Purchase[]) => {
      setPurchases(updatedRewards);
    });
    return () => {
      socket.off("blockchain");
      socket.off("updateUsers");
      socket.off("updateRewards");
    };
  }, []);

  const toggleBlockDetails = (index: number) => {
    // Toggle visibility of the block's details
    setSelectedBlockIndex(selectedBlockIndex === index ? null : index);
  };
  
  const handleNavigateToRewards = () => {
    navigate("/rewards");
    };


  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Live Dashboard</h1>

      {/* Side-by-side tables */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        {/* Participants Table */}
        <div style={{ flex: 1, textAlign: "left" }}>
          <h2>Participants</h2>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Address</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Tokens</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{user.name}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{user.address}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{user.tokens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Votes Table */}
        <div style={{ flex: 1, textAlign: "left" }}>
          <h2>Votes</h2>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Address</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Vote</th>
              </tr>
            </thead>
            <tbody>
              {votes.map((vote, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{vote.name}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{vote.address}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{vote.vote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Purchases Table */}
        <div style={{ flex: 1, textAlign: "left" }}>
          <h2>Purchases</h2>
          <table style={{ borderCollapse: "collapse", width: "150%" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Address</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Item Bought</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{purchase.name}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{purchase.address}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{purchase.reward}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blockchain visualization */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <h2>Blockchain Visualization</h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
          {blockchain.map((block, index) => (
            <div
              key={block.index}
              style={{
                position: "relative",
                width: "100px",
                height: "100px",
                backgroundColor: block.index == 0 ? "#5ca3ff" : block.data.vote ? "#55ed92" : "#ed5555",
                color: "white",
                textAlign: "center",
                lineHeight: "100px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => toggleBlockDetails(index)}
            >
              <span>Block {block.index}</span>
              {index < blockchain.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "-20px",
                    width: "40px",
                    height: "2px",
                    backgroundColor: "black",
                    transform: "translateY(-50%)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected block details */}
      {selectedBlockIndex !== null && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid black",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
            maxWidth: "600px",
            margin: "20px auto",
            textAlign: "left",
          }}
          
        >
          <h3>Block Details</h3>
          <p><strong>Index:</strong> {blockchain[selectedBlockIndex].index}</p>
          <p><strong>Timestamp:</strong> {blockchain[selectedBlockIndex].timestamp}</p>
          <p><strong>Data:</strong> {JSON.stringify(blockchain[selectedBlockIndex].data)}</p>
          <p><strong>Previous Hash:</strong> {blockchain[selectedBlockIndex].previousHash}</p>
          <p><strong>Hash:</strong> {blockchain[selectedBlockIndex].hash}</p>
        </div>
      )}

<div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={handleNavigateToRewards}>Go to Rewards Page</button>
</div>
    </div>
    
  );
};

export default Dashboard;