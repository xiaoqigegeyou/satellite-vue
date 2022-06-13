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
//信息查询
router.get('/AllProvinceInfo', (req, res) => {
    const sql = $sql.BasicConfProvincial.selectAll
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
router.post('/addProvince', (req, res) => {
    const sql = $sql.BasicConfProvincial.insert
    const params = req.body
    //console.log('添加', params)
    conn.query(sql, [params.name, params.code], function (err, result) {
        if (err) {
            //console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})
// 接口：删除信息
router.post('/delProvince', (req, res) => {
    const sql = $sql.BasicConfProvincial.delete
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
module.exports = router