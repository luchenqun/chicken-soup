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

  let post = await pool.query("SELECT p.*, u.nickname, u.id as uid, u.avatar FROM `posts` as p LEFT OUTER JOIN users as u ON p.id = u.id WHERE p.id = '"+ id +"'");
  return post;
};

module.exports = db;
