const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const pool = require('../../backend/src/config/database');
const axios = require('axios');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = { google_id: profile.id, email: profile.emails[0].value };
    const result = await pool.query(
      'INSERT INTO users (google_id, email) VALUES ($1, $2) ON CONFLICT (google_id) DO UPDATE SET email = $2 RETURNING *',
      [user.google_id, user.email]
    );

    // แจ้งเตือนผ่าน Line Notify
    const message = `User Logged in Web\nStudent: ${result.rows[0].google_id}\nemail: ${result.rows[0].email}\ntoken: ${accessToken}`;
    await axios.post('https://notify-api.line.me/api/notify', `message=${encodeURIComponent(message)}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${process.env.LINE_NOTIFY_TOKEN}`
      }
    });

    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});
