# Blockchain Voting System

A decentralized blockchain-based voting system built with React (frontend) and Node.js (backend). This system ensures transparency and integrity while providing privacy-enhanced voting options. The application includes live updates via Socket.IO and features such as token-based rewards for voters.

---

## Features

- **Real-Time Updates:** Votes and rewards update live using WebSocket connections.
- **Blockchain-Backed:** Votes are recorded immutably on a blockchain to ensure integrity.
- **Token Rewards:** Voters earn tokens for participating in elections, which they can redeem for rewards.
- **Dashboard Overview:** Admins can view participants, votes, rewards, and blockchain details.
- **User Privacy:** Built with considerations for enhancing voter privacy using cryptographic methods.

---

## Tech Stack

### Frontend
- React (React Router for navigation)
- Vite (for faster development builds)

### Backend
- Node.js
- Express.js
- Socket.IO (for real-time updates)

### Blockchain
- Custom Blockchain Implementation

### Hosting
- **Frontend:** Netlify
- **Backend:** Render (or optionally hosted locally via Ngrok for testing)

---

## Setup Instructions

### Prerequisites
- Node.js (v14+ recommended)
- npm
- Git

### Installation

#### Clone the Repository
```bash
git clone https://github.com/tvan04/blockchain-voting.git
cd blockchain-voting-system
```

#### Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Running Locally (the code is currently set up for deployment, so you will have to change socket link to `http://localhost:4000` in the component files)

#### Start the Backend
```bash
cd server
node index.js
```

The backend server will start on `http://localhost:4000`.

#### Start the Frontend
```bash
cd client
npm run dev
```

The frontend development server will start on `http://localhost:5173`.

### Deployment

#### Frontend Deployment (Netlify)
1. Run the build command:
   ```bash
   npm run build
   ```
2. Upload the `dist` folder to Netlify.
3. Add a `_redirects` file to the `dist` folder with the following content:
   ```
   /*    /index.html   200
   ```

#### Backend Deployment (Render)
1. Create a Web Service on Render.
2. Set the following settings:
   - Build Command: Leave empty 
   - Start Command: `node server.js`.

---

## Project Structure

```
blockchain-voting-system/
├── server/
│   ├── index.js          # Main backend server
│   ├── blockchain.js      # Blockchain implementation
│   └── package.json       # Backend dependencies
├── client/
│   ├── src/
│   │   ├── components/    # React components (Dashboard, Voting, etc.)
│   │   ├── App.jsx        # Main application entry point
│   │   └── main.jsx       # ReactDOM rendering
│   ├── public/            # Static assets
│   ├── dist/              # Production build folder (after `npm run build`)
│   └── package.json       # Frontend dependencies
└── README.md
```

---

## API Endpoints

### Backend Routes

#### `GET /checkAddress`
- **Query Parameters:**
  - `name` (string) - The name of the user.
- **Response:**
  - `200 OK`: Returns the address corresponding to the given name.
  - `404 Not Found`: If no user matches the given name.

#### WebSocket Events

##### `join`
- **Description:** Allows a user to join the system by providing their name and address.
- **Data:**
  ```json
  {
    "name": "string",
    "address": "string"
  }
  ```

##### `vote`
- **Description:** Records a user's vote and rewards tokens.
- **Data:**
  ```json
  {
    "name": "string",
    "address": "string",
    "vote": "string"
  }
  ```

##### `spendTokens`
- **Description:** Deducts tokens from a user's balance to redeem a reward.
- **Data:**
  ```json
  {
    "address": "string",
    "cost": "number",
    "reward": "string"
  }
  ```
---

## Future Enhancements
- Integrate Zero-Knowledge Proofs for private voting.
- Add role-based authentication for admin and users.
- Improve UI/UX for better accessibility and responsiveness.
- Add support for multiple elections.

---

## License
MIT License

---

## Contributors
- [Tristan Van](https://github.com/tvan04)
