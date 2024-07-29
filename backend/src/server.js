const express = require('express');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
const authRoutes = require('./routers/authRouters'); // เส้นทางสำหรับการยืนยันตัวตน

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  keys: [keys.cookieKey]
}));

// ใช้เส้นทางสำหรับการยืนยันตัวตน
app.use(authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
