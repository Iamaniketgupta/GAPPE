import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./src/db/index.js";
import cors from "cors";
import app from "./src/app.js";
import { chatSockets } from "./src/sockets/chat.sokets.js";
import { ExpressPeerServer } from "peer";

// Connect to the database
await connectDB();


  const httpServer = createServer(app);

  const peerServer = ExpressPeerServer(httpServer, {
    debug: true
  });

  app.use('/', (req,res)=>{
    res.send('gappe Server is online')
  });
  
  app.use('/peerjs', peerServer);


  const io = new Server(httpServer, {
     connectionStateRecovery: {}, // connection recovery
    cors: {
      origin: 'https://gappe.vercel.app',
      
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

