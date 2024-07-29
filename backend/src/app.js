const express = require('express');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
const sequelize = require('../config/database'); // Adjust the path as needed
const authRoutes = require('./routers/authRouters'); 
const dataRoutes = require('./routers/dataRouters'); 
const dataHistoryRoutes = require('./routers/dataHistoryRouters'); 
const qrcodeRoutes = require('./routers/qrcodeRouters'); 
require('./middlewares/authMiddleware'); // Import Passport configuration

const { verifyTokenAuthorized } = require('./utils/jwt');
const { login, register, loginQRCode } = require('./controllers/authControllers');
const { generateAccessCode, verifyQRCode } = require('./controllers/qrcodeControllers');
const { dataEmployee } = require('./controllers/dataControllers');
const { dataHistory } = require('./controllers/dataHistoryControllers');

const app = express();

app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, RAC, Agent");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/data', dataRoutes);
app.use('/history', dataHistoryRoutes);
app.use('/qrcode', qrcodeRoutes);

// Custom routes to handle logic from app.ts
app.post('/api/login', login);
app.post('/api/loginqr', loginQRCode);
app.post('/api/register', register);
app.get('/api/rac', generateAccessCode);
app.post('/api/verifyrac', verifyQRCode);

app.get('/api/getdata', (req, res) => {
  const authorization = req.headers['authorization'];
  const verifyToken = verifyTokenAuthorized(authorization);
  if (!verifyToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  dataEmployee(req, res);
});

app.get('/api/gethistory', (req, res) => {
  const authorization = req.headers['authorization'];
  const verifyToken = verifyTokenAuthorized(authorization);
  if (!verifyToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  dataHistory(req, res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
