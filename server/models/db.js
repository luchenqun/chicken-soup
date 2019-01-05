let mysql = require("promise-mysql");
let fs = require("fs");
let path = require("path");
let config = {}
try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config.json"), 'utf8'));
} catch (error) {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config.default.json"), 'utf8'));
}
var pool = mysql.createPool(config.db);

var db = {};

db.user = async function (uid) {
  let sql1 = "SELECT * FROM `users` WHERE `uid` = '" + uid + "'";
  let sql2 = "select count(user_id) as jokeNum FROM `jokes` WHERE `user_id` = '" + uid + "'";
  let sql3 = "select count(user_id) as favoriteNum  FROM `links` WHERE `user_id` = '" + uid + "' AND `type` = '0'";
  let user = await pool.query(sql1);
  let jokeNum = await pool.query(sql2);
  let favoriteNum = await pool.query(sql3);

  let data = Object.assign(user[0], jokeNum[0], favoriteNum[0]);

  return data;
};

db.login = async function (account, password) {
  let sql = "SELECT * FROM `users` WHERE `account` = '" + account + "' AND `password` = '" + password + "'";
  let user = await pool.query(sql);
  return user[0];
};

db.signUp = async function (account, nickname, password, email) {
  let sql = "INSERT INTO `users` (`account`, `nickname`, `password`, `email`) VALUES ('" + account + "', '" + nickname + "', '" + password + "', '" + email + "')";
  try {
    let ret = await pool.query(sql);
    return {
      uid: ret.insertId
    };
  } catch (error) {
    return {
      error: error.message
    }
  }
};

db.delLink = async function (lid) {
  let sql = "DELETE FROM `links` WHERE (`lid`='" + lid + "')";
  let ret = await pool.query(sql);
  return ret;
};

db.updateJoke = async function (pid, data) {
  // UPDATE `jokes` SET `type`='10', `see`='2' WHERE (`pid`='1')
  let sql = "UPDATE `jokes` SET ";
  let count = 0;
  for (let prop in data) {
    count && (sql += ", ");
    sql += `\`${prop}\`='${data[prop]}'`;
    count++;
  }
  sql += " WHERE (`pid`='" + pid + "')";

  let ret = await pool.query(sql);
  return ret.affectedRows;
}

db.joke = async function (id) {
  let sql1 = id ? "SELECT * FROM `jokes` WHERE `pid` = '" + id + "'" : "SELECT * FROM `jokes` ORDER BY RAND() LIMIT 1";
  let jokes = await pool.query(sql1);
  let joke = jokes[0];
  if (joke) {
    joke.see = parseInt(joke.see) + 1; // 默认访问+1
    await db.updateJoke(joke.pid, {
      see: joke.see
    });
    joke.imgs && (joke.imgs = JSON.parse(joke.imgs));
    id = joke.pid;
  }

  let sql2 = "SELECT favorite.*, u.uid, u.nickname FROM `links` as favorite LEFT OUTER JOIN users as u ON favorite.link_id = u.uid  WHERE `joke_id` = '" + id + "' AND `type` = '0'";
  let sql3 = "SELECT comment.*, u.uid, u.nickname, u.avatar, u.account FROM `links` as comment LEFT OUTER JOIN users as u ON comment.link_id = u.uid  WHERE `joke_id` = '" + id + "' AND `type` = '1'";

  let favorite = await pool.query(sql2);
  let comment = await pool.query(sql3);
  let data = {
    joke,
    favorite,
    comment
  };
  return data;
};

db.insert = async function (data, table) {
  let keys = "";
  let valus = "";
  let count = 0;
  for (let prop in data) {
    count && (keys += ",");
    keys += prop;

    count && (valus += ",");
    valus += data[prop];

    count++;
  }

  let sql = `REPLACE INTO ${table} (${keys}) VALUES (${valus})`;
  // console.log(sql);
  let ret = await pool.query(sql);
  return ret.affectedRows;
};

module.exports = db;