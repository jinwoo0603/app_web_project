const mysql = require('mysql2');

// MySQL 연결 설정
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'notation',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Promise 기반으로 변환
const promisePool = pool.promise();

module.exports = promisePool;
