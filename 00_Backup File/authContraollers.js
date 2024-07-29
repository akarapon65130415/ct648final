const pool = require('../backend/src/config/database');
const axios = require('axios');

exports.loginSuccess = async (req, res) => {
  if (req.user) {
    const message = `User Logged in Web\nStudent: ${req.user.google_id}\nemail: ${req.user.email}\ntoken: ${req.session.passport.user}`;
    try {
      await axios.post('https://notify-api.line.me/api/notify', `message=${encodeURIComponent(message)}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${process.env.LINE_NOTIFY_TOKEN}`
        }
      });
      res.status(200).json({
        success: true,
        message: 'User authenticated',
        user: req.user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to send notification',
        error: error.message,
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }
};

exports.logout = (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
