const sequelize = require('../config/database'); // Adjust the path as needed

async function dataHistory(req, res) {
  try {
    // ดึงข้อมูลผู้ใช้
    const tokenLogs = await sequelize.query('SELECT * FROM token_log', {
      type: sequelize.QueryTypes.SELECT
    });
    return res.status(200).json({ data: tokenLogs });
  } catch (error) {
    console.error('Error during login', error);
    return res.status(500).json({ error: 'Server Error' });
  }
}

module.exports = { dataHistory };
