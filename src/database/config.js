const { Sequelize } = require('sequelize');

const db = new Sequelize({
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: +process.env.DB_PORT,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true, // Requiere conexión SSL/TLS
      rejectUnauthorized: false, // Ignora los certificados autofirmados, utiliza un certificado CA válido en producción
    },
  },
});

module.exports = { db };
