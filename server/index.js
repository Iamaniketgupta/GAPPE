import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./src/db/index.js";
import cors from "cors";
import { availableParallelism } from "node:os";
import cluster from "node:cluster";
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";
import app from "./src/app.js";
import { chatSockets } from "./src/sockets/chat.sokets.js";
import { ExpressPeerServer } from "peer";

// Connect to the database
await connectDB();

if (cluster.isPrimary) {
  const numCPUs = availableParallelism(); // Get the number of CPU cores

  // Create one worker per CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: 3000 + i, // Assign distinct ports 
    });
  }

  setupPrimary();

  console.log(`Primary process running. Forked ${numCPUs} workers.`);
} else {
  // Initialize Express and Socket.IO in each worker process
  const httpServer = createServer(app);

  const peerServer = ExpressPeerServer(httpServer, {
    debug: true
  });

  app.use('/peerjs', peerServer);


  const io = new Server(httpServer, {
     connectionStateRecovery: {}, // connection recovery
     adapter: createAdapter(), //  cluster adapter
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
  });

  chatSockets(io); // init socket logics

  const port = process.env.PORT;
  httpServer.listen(port, () => {
    console.log(`Worker running at http://localhost:${port}`);
  });

  process.on("unhandledRejection", (err) => {
    console.error("Unhandled promise rejection:", err);
  });
}
