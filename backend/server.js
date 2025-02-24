import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import handleRoutes from './router.js'
import handleSocket from './config/socket.js'
import handleMongoDB from './config/mongodb.js'

const app = express();
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:5173"],  // add frontend urls here
  credentials: true,
};
app.use(cors(corsOptions));

const httpServer = createServer(app); // to be able to combine socket and express
const io = new Server(httpServer, {
  cors: corsOptions
});

handleMongoDB();
handleRoutes(app);
io.on("connection", handleSocket);

httpServer.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
