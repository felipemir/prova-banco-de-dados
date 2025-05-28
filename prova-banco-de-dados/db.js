const mysql = require('mysql2/promise');
require('dotenv').config(); // Adicione esta linha no topo se ainda não tiver

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // Fallback para localhost
  user: process.env.DB_USER || 'root',      // Fallback para seu usuário local
  password: process.env.DB_PASSWORD || '',  // Fallback para sua senha local
  database: process.env.DB_NAME || 'encosis2025', // Fallback para seu DB local
  port: process.env.DB_PORT || 3306,        // Fallback para porta local
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log('Successfully connected to the database via pool.');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed via pool:', err);
  });

module.exports = pool;