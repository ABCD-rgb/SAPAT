import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { createServer } from "http";
import { Server } from "socket.io";
import handleRoutes from './router.js';
import handleSocket from './config/socket.js';
import handleMongoDB from './config/mongodb.js';
import passport from './config/auth.js';
import session from 'express-session';

dotenv.config();
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


// auth
app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // set to true if using https
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email']
  })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login/failed',
    successRedirect: 'http://localhost:5173/dashboard'
  })
);

app.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

httpServer.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
