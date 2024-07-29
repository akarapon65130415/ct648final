require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const User = require('../models/User');

const createUser = async () => {
  const username = 'admin';
  const password = 'password';

  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);

  try {
    await sequelize.sync();

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      console.log('User already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    console.log('User created successfully:', user.toJSON());
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await sequelize.close();
  }
};

createUser();
