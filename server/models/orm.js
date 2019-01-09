const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

let config = {};
try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config.json"), "utf8"));
} catch (error) {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config.default.json"), "utf8"));
}
let dbConfig = config.db;

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: "mysql",
  logging: false,
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const Jokes = sequelize.import(path.join(__dirname, "jokes.js"));
const Links = sequelize.import(path.join(__dirname, "links.js"));
const Terms = sequelize.import(path.join(__dirname, "terms.js"));
const Users = sequelize.import(path.join(__dirname, "users.js"));

module.exports = {
  Jokes: Jokes,
  Links: Links,
  Terms: Terms,
  Users: Users,
  sequelize: sequelize,
  Sequelize: Sequelize
};
