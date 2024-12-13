import React, { useEffect } from "react";

const ResetServer: React.FC = () => {
  useEffect(() => {
    const resetServer = () => {
      fetch("https://blockchain-voting-i0xo.onrender.com/reset", {
        method: "POST",
      })
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error resetting server:", error);
        });
    };

    resetServer();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Resetting Server...</h1>
    </div>
  );
};

export default ResetServer;