const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit,
    host: 'localhost',
    port: '3900',
    user: 'gvm',
    password: 'gvmsistemas#',
    database: 'cim'
});

console.log('pool => criado');

pool.on('release', () => console.log('pool => conexão retornada'));

process.on('SIGINT', () =>
    pool.end(err => {
        if (err) return console.log(err);
        console.log('pool => fechado');
        process.exit(0);
    })
);

module.exports = pool;