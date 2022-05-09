const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config('./.env');
const mongoDb = process.env.mongoDb;

const connect = () => {
  mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, "mongo connection error"));
  console.log('se conecto')
}

module.exports = connect