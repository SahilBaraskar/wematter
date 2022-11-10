const mysql = require('mysql2');
const env = require('./key');

const dbPool = mysql.createPool(
    {
        host: 'localhost',
        user: env.user,
        database: env.database,
        password: env.password,
        port: 3306
    }
)

module.exports = dbPool.promise();