const sequelize = require('../config/database'); // Adjust the path as needed
const { formatDateTime } = require('../utils/date'); 
const { generateRandomString } = require('../utils/random'); 
const { SendToLine } = require('../utils/line'); 

async function generateAccessCode(req, res) {
  try {
    const now = new Date();
    const dateNow = formatDateTime(now);
    const randomCharacter = generateRandomString(30);
    let accessCode = "CT648" + dateNow + randomCharacter;
    accessCode = accessCode.replace(/\s/g, '');
    
    // สร้าง Random access code
    await sequelize.query('INSERT INTO access_code_log (access_code) VALUES (?)', {
      replacements: [accessCode]
    });

    return res.status(200).json({
        msg: `Successfully`,  
        data: accessCode
    });
  } catch (error) {
    console.error('Error during login', error);
    return res.status(500).json({ error: 'Server Error' });
  }
}

async function verifyQRCode(req, res) {
  try {
    // Get the headers
    const rac = req.headers['RAC'];

    // ตรวจสอบมีข้อมูล RAC หรือไม่
    const [racEntry] = await sequelize.query(`SELECT row_id, token_after FROM access_code_log WHERE access_code = ? AND COALESCE(token_after, '') != ''`, {
      replacements: [rac],
      type: sequelize.QueryTypes.SELECT
    });
    if (!racEntry) {
      return res.status(200).json({ msg: `No login yet` });
    }
    // ดึง token 
    const token = racEntry.token_after;
    console.log(token);
    
    const now = new Date();
    const dateNow = formatDateTime(now);
    // ส่งแจ้งเตือนผ่านไลน์
    const message = `User : 65130415@dpu.ac.th logged in`;
    SendToLine(message);
    
    return res.status(200).json({
        msg: `Successfully`,  
        token
    });
  } catch (error) {
    console.error('Error during login', error);
    return res.status(500).json({ error: 'Server Error' });
  }
}

module.exports = {
  generateAccessCode,
  verifyQRCode
};
