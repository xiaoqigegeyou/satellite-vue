// db.js
// 数据库连接配置
module.exports = {
    /* mysql: {
        host: 'cspro.top', // 新建数据库连接时的 主机名或ID地址 内容
        user: 'hadoop',
        password: 'hadoop123..', // root 密码
        database: 'cluster_visualization', // 数据库名
        port: '3306',
        timezone: "08:00"
    } */
    // mysql: {
    //     host: 'localhost', // 新建数据库连接时的 主机名或ID地址 内容
    //     user: 'root',
    //     password: 'root', // root 密码
    //     database: 'cluster_visualization', // 数据库名
    //     port: '3306',
    // }
    mysql: {
        host: 'localhost', // 新建数据库连接时的 主机名或ID地址 内容
        user: 'root',
        password: 'root', // root 密码
        database: 'hadoop_test', // 数据库名
        port: '3306',
        multipleStatements: true // 允许执行多条语句
    }
}