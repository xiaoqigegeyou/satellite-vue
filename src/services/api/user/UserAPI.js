const models = require('../../db')
const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const $sql = require('../../sqlMap')
// 连接数据库
const conn = mysql.createConnection(models.mysql)
conn.connect()
const jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '1', msg: '操作失败'
        })
    } else {
        res.json(
            ret
        )
    }
};
//检查用户名是否可用
router.get('/checkUsername',(req,res) => {
    const username = req.query.username;
    const sql = $sql.User.selectByUsername;
    conn.query(sql,[username],function(err,result){
        if(err){
            //console.log(err);
        }
        if(result){
            //console.log(result);
            jsonWrite(res,result);
        }
    });
});

//注册
router.post('/regist',(req,res)=>{
    //{ username: 'admin', password: '123456', repassword: '123456' }
    const params = req.body;
    const sql = $sql.User.insert;
    conn.query(sql,[params.username,params.password],function(err,result){
        if(err){
            //console.log(err);
        }
        if(result){
            //console.log(result);
            jsonWrite(res,result);
        }
    });
    
});

//登录
router.post('/login',(req,res) => {
    //{ username: 'admin', password: '123456' }
    const user = req.body;
    //console.log(user);
    const sql = $sql.User.selectByUsernameAndPassword;
    conn.query(sql,[user.username,user.password],function(err,result){
        if(err){
            //console.log(err);
        }
        if(result){
            //console.log(result);
            jsonWrite(res,result);
        }
    });
})

module.exports = router;