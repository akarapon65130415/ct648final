const sequelize = require('../config/database'); // Adjust the path as needed

async function dataEmployee(req, res) {
  try {
    // ดึงข้อมูลผู้ใช้
    const users = await sequelize.query('SELECT * FROM employee', {
      type: sequelize.QueryTypes.SELECT
    });
    return res.status(200).json({ data: users });
  } catch (error) {
    console.error('Error during login', error);
    return res.status(500).json({ error: 'Server Error' });
  }
}

module.exports = { dataEmployee };
