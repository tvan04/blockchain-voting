const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const { Blockchain, Block } = require("./blockchain.js");



const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Create a blockchain instance
const votingBlockchain = new Blockchain();

// Store users, votes, and rewards
const users = []; // Array of { name, address, tokens }
const votes = []; // Array of { name, address, vote }
const rewards = []; // Array of { name, address, reward, cost, tokens }

io.on("connection", (socket) => {
  console.log("A user connected");

  // Send initial data
  socket.emit("blockchain", votingBlockchain.chain);
  socket.emit("updateUsers", users);
  socket.emit("updateVotes", votes);
  socket.emit("updateRewards", rewards);

  // Handle user joining
  socket.on("join", (userData) => {
    const { name, address } = userData;
    if (!users.find((user) => user.address === address)) {
      users.push({ name, address, tokens: 0 });
    }
    io.emit("updateUsers", users);
  });

  // Handle voting
  socket.on("vote", (voteData) => {
    const { name, address, vote } = voteData;

    // Update votes and reward user
    votes.push({ name, address, vote });
    const user = users.find((user) => user.address === address);
    if (user) {
      user.tokens += 10; // Reward 10 tokens for voting
    }

    // Add a new block for the vote
    const newBlock = new Block(
      votingBlockchain.chain.length,
      new Date().toISOString(),
      { name, address, vote, tokens: user?.tokens || 0 }
    );
    votingBlockchain.addBlock(newBlock);

    // Broadcast updates
    io.emit("blockchain", votingBlockchain.chain);
    io.emit("updateUsers", users);
    io.emit("updateVotes", votes);
  });

  // Handle spending tokens
  socket.on("spendTokens", ({ address, cost, reward }) => {
    const user = users.find((user) => user.address === address);
    if (user && user.tokens >= cost) {
      user.tokens -= cost;

      // Add to rewards array
      rewards.push({ name: user.name, address: address, reward: reward, cost, tokens: user.tokens });

      // Add a new block for the reward transaction
      const newBlock = new Block(
        votingBlockchain.chain.length,
        new Date().toISOString(),
        { name: user.name, address, activity: "Spend", value: reward, cost, tokens: user.tokens }
      );
      votingBlockchain.addBlock(newBlock);

      // Broadcast updates
      io.emit("blockchain", votingBlockchain.chain);
      io.emit("updateUsers", users);
      io.emit("updateRewards", rewards); // Broadcast rewards updates
    } else {
      socket.emit("error", { message: "Insufficient tokens" });
    }
  });

  // Endpoint to check if a name corresponds to an address
  app.get("/checkAddress", (req, res) => {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const user = users.find((user) => user.name === name);
    if (user) {
      return res.status(200).json({ address: user.address });
    } else {
      return res.status(404).json({ error: "No address found for the given name" });
    }
  });

  // Reset endpoint
  app.post("/reset", (req, res) => {
    votingBlockchain = new Blockchain();
    users = [];
    votes = [];
    rewards = [];
    io.emit("blockchain", votingBlockchain.chain);
    io.emit("updateUsers", users);
    io.emit("updateVotes", votes);
    io.emit("updateRewards", rewards);
    res.send("Server reset successfully");
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
