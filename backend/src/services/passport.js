const passport = require('passport');

// คุณสามารถเพิ่มกลยุทธ์อื่น ๆ สำหรับการยืนยันตัวตนที่นี่ได้ในอนาคต

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
