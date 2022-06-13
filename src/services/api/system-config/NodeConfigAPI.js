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
}
//节点信息查询
router.get('/AllNodeInfo', (req, res) => {
    const sql = $sql.BasicConfCluster.selectAll
    const params = req.body
    //console.log(params)
    conn.query(sql, function (err, result) {
        if (err) {
            //console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})



// 增加节点信息
router.post('/addNode', (req, res) => {
    const sql = $sql.BasicConfCluster.insert
    const params = req.body
    //console.log('添加', params)
    conn.query(sql, [params.name, params.domain, params.ip4, params.ip6,params.remark], function (err, result) {
        if (err) {
            //console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})
// 接口：删除信息
router.post('/delNode', (req, res) => {
    const sql = $sql.BasicConfCluster.delete
    const params = req.body
    //console.log('删除', params)
    conn.query(sql, [params.name], function (err, result) {
        if (err) {
            //console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})

// 接口：修改信息
// router.post('/updateStu', (req, res) => {
//     const sql = $sql.Stu.update
//     const params = req.body
//     //console.log('修改', params)
//     conn.query(sql, [params.stu_name, params.stu_sex, params.stu_college, params.stu_class, params.stu_Id], function (err, result) {
//         if (err) {
//             //console.log(err)
//         }
//         if (result) {
//             jsonWrite(res, result)
//         }
//     })
// })
module.exports = router