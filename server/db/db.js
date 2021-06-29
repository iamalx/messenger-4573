const Sequelize = require("sequelize");

const db = new Sequelize(process.env.DATABASE_URL || "postgresql://postgres:chirey11@localhost/messenger", {
  logging: false
});

module.exports = db;
