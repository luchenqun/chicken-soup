var mysql = require('promise-mysql');
var pool = mysql.createPool({
  host: "127.0.0.1",
  user: "test", // mysql的账号
  password: "123456", // mysql 的密码
  database: "chicken_soup",
  multipleStatements: true,
  useConnectionPooling: true,
  connectionLimit: 10,
  port: 3306
});

var db = {};

db.post = async function(id) {
  return pool.query("SELECT * FROM `posts` WHERE `id` = '" + id + "'");
};

module.exports = db;
