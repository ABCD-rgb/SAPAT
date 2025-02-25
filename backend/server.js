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
  origin: [process.env.CLIENT_URL], 
  credentials: true,
};
app.use(cors(corsOptions));

const httpServer = createServer(app); // to be able to combine socket and express
const io = new Server(httpServer, {
  cors: corsOptions
});


handleMongoDB();

// auth
app.use(session({
  secret: process.env.SESSION_SECRET,
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
    failureRedirect: '/login/failed', // TODO: create a login failed page
    successRedirect: `${process.env.CLIENT_URL}/dashboard`,
    failureMessage: true
  })
);


handleRoutes(app);
io.on("connection", handleSocket);

httpServer.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
