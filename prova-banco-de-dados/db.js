// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'encosis2025',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testa a conexão com o banco de dados
pool.getConnection()
  .then(connection => {
    console.log('Connected to the database successfully.');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

module.exports = pool;
