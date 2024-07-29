const { createToken, verifyToken } = require("../utils/jwt");
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');
const { formatDateTime } = require('../utils/date');
const { SendToLine } = require('../utils/line');

async function register(req, res) {
  try {
    const { username, password, nameTH, nameEN, studentID } = req.body; // รับข้อมูลผู้ใช้ใหม่จาก request body
    const saltRounds = 4;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [existingUser] = await sequelize.query('SELECT * FROM employee WHERE username = ?', {
      replacements: [username],
      type: sequelize.QueryTypes.SELECT
    });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    await sequelize.query('INSERT INTO employee (username, password, salt, nameTH, nameEN, studentID) VALUES (?, ?, ?, ?, ?, ?)', {
      replacements: [username, hashedPassword, salt, nameTH, nameEN, studentID]
    });

    return res.status(200).json({ msg: 'Successfully registered' });
  } catch (error) {
    console.error('Error during registration', error);
    return res.status(500).json({ error: 'Server Error' });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    const [user] = await sequelize.query('SELECT uuid, password FROM employee WHERE username = ?', {
      replacements: [username],
      type: sequelize.QueryTypes.SELECT
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const uuid = user.uuid;
    const type = "input";
    const storedHashedPassword = user.password;
    const isPasswordValid = await bcrypt.compare(password, storedHashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken({ userId: user.uuid });
    await sequelize.query('INSERT INTO token_log (employee_id, jwt_token, login_type) VALUES (?, ?, ?)', {
      replacements: [uuid, token, type]
    });

    const now = new Date();
    const dateNow = formatDateTime(now);
    const message = `User : 65130415@dpu.ac.th logged in\ntoken: ${token}`;
    SendToLine(message);

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login', error);
    return res.status(500).json({ error: 'Server Error' });
  }
}

async function loginQRCode(req, res) {
  try {
    const rac = req.headers['rac'];
    if (!rac) {
      return res.status(400).json({ message: 'QR code is required' });
    }

    const authorization = req.headers['authorization'];
    let token = '';
    if (authorization && authorization.startsWith('Bearer ')) {
      token = authorization.slice(7);
    }

    const { payload, isExpired } = verifyToken(token);
    if (payload === null || isExpired) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const userId = payload.userId;

    const [racEntry] = await sequelize.query(`SELECT row_id FROM access_code_log WHERE access_code = ? AND COALESCE(token_before, '') = ''`, {
      replacements: [rac],
      type: sequelize.QueryTypes.SELECT
    });
    if (!racEntry) {
      return res.status(401).json({ message: 'Invalid credentials or already logged in' });
    }

    const racId = racEntry.row_id;
    const tokenNew = createToken({ userId: userId });
    const type = "QRCode";
    await sequelize.query('INSERT INTO token_log (employee_id, jwt_token, login_type, access_code_id) VALUES (?, ?, ?, ?)', {
      replacements: [userId, tokenNew, type, racId]
    });
    await sequelize.query('UPDATE access_code_log SET token_before = ?, token_after = ?, token_update_at = CURRENT_TIMESTAMP WHERE access_code = ?', {
      replacements: [token, tokenNew, rac]
    });

    return res.status(200).json({ msg: 'Successfully' });
  } catch (error) {
    console.error('Error during login', error);
    return res.status(500).json({ error: 'Server Error' });
  }
}

async function register(req, res) {
  try {
    let username = "65130415";
    const password = "1234";
    const saltRounds = 4;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [existingUser] = await sequelize.query('SELECT * FROM employee WHERE username = ?', {
      replacements: [username],
      type: sequelize.QueryTypes.SELECT
    });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    let nameTH = "อัครพล เหลืองอรุณ";
    let nameEN = "Akarapon Lhuengaroon";
    let studentID = "65130415";
    username = studentID;
    await sequelize.query('INSERT INTO employee (username, password, salt, nameTH, nameEN, studentID) VALUES (?, ?, ?, ?, ?, ?)', {
      replacements: [username, hashedPassword, salt, nameTH, nameEN, studentID]
    });

    return res.status(200).json({ msg: 'Successfully' });
  } catch (error) {
    console.error('Error during login', error);
    return res.status(500).json({ error: 'Server Error' });
  }
}

module.exports = {
  login,
  loginQRCode,
  register
};
