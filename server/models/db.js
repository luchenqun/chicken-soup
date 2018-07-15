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

db.user = async function (id) {
  let sql1 = "SELECT * FROM `users` WHERE `uid` = '" + id + "'";
  let sql2 = "select count(user_id) as postNum FROM `posts` WHERE `user_id` = '" + id + "'";
  let sql3 = "select count(user_id) as favoriteNum  FROM `links` WHERE `user_id` = '" + id + "' AND `type` = '0'";
  let user = await pool.query(sql1);
  let postNum = await pool.query(sql2);
  let favoriteNum = await pool.query(sql3);

  let data = Object.assign(user[0], postNum[0], favoriteNum[0]);

  return data;
}

db.post = async function (id) {
  let sql1 = "SELECT * FROM `posts` WHERE `pid` = '" + id + "'";
  let sql2 = "SELECT favorite.*, u.uid, u.nickname FROM `links` as favorite LEFT OUTER JOIN users as u ON favorite.link_id = u.uid  WHERE `post_id` = '" + id + "' AND `type` = '0'";
  let sql3 = "SELECT comment.*, u.uid, u.nickname, u.avatar, u.account FROM `links` as comment LEFT OUTER JOIN users as u ON comment.link_id = u.uid  WHERE `post_id` = '" + id + "' AND `type` = '1'";

  console.log(sql1);
  console.log(sql2);
  console.log(sql3);

  let posts = await pool.query(sql1);
  let user = null;
  let post = posts[0];
  if (post) {
    (post.imgs) && (post.imgs = JSON.parse(post.imgs));
    user = await db.user(post.user_id);
  }

  let favorite = await pool.query(sql2);
  let comment = await pool.query(sql3);
  let data = {
    post,
    user,
    favorite,
    comment
  }
  return data;
};

module.exports = db;