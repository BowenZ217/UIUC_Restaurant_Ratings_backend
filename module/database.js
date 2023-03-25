const mysql = require('mysql2');
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4', // 指定字符集
    port: process.env.DB_PORT
};

const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection((error, connection) => {
    if (error) {
        console.error('Error connecting to the database:', error);
        setTimeout(() => {
        console.log('Retrying to connect to the database...');
        pool.getConnection((error, connection) => {
            if (error) {
            console.error('Error connecting to the database:', error);
            } else {
            console.log('Successfully connected to the database.');
            connection.release();
            }
        });
        }, 5000);
    } else {
        console.log('Successfully connected to the database.');
        connection.release();
    }
});

const promisePool = pool.promise();

module.exports = promisePool;
