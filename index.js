const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
//For CPU data
const { getCPUUsage } = require("./scripts/cpu");


const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

app.use(cors());

// Basic check route
app.get("/", (req, res) => {
  res.send("HyprDash backend is live 🚀");
});

// WebSocket setup
io.on("connection", (socket) => {
  console.log("Client connected.");

 const { getMemoryStats } = require("./scripts/memory");

setInterval(() => {
  const memory = getMemoryStats();
  console.log("💾 Memory Stats:", memory);

  const cpu = getCPUUsage();

  socket.emit("stats", { cpu, memory, timestamp: new Date() });
}, 1000);



  socket.on("disconnect", () => {
    console.log("Client disconnected.");
  });
});

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
