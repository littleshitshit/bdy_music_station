const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost', //数据库地址
    port: '3306',//端口号
    user: 'root',//用户名
    password: 'admin',//密码
    database: 'musicwebstation'//数据库名称
});
connection.connect();

module.exports= connection;
