const mysql= require('mysql');
const config = require('./config');

const db = mysql.createConnection(config);
db.connect((err) => {
  if(err) {
    throw err;
  } else {
    console.info('Connected to the database!');
  }
});

module.exports = db;