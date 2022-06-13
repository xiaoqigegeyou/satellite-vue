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
router.get('/AllSatellite', (req, res) => {
    const sql = $sql.Satellite.show
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
// 增加信息
router.post('/addSatellite', (req, res) => {
    const sql = $sql.Satellite.insert
    const params = req.body
    //console.log('添加', params)
    conn.query(sql, [params.satellite_name], function (err, result) {
        if (err) {
            //console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})
// 删除信息
router.post('/delSatellite', (req, res) => {
    const sql = $sql.Satellite.delete
    const params = req.body
    //console.log('删除', params)
    conn.query(sql, [params.satellite_name], function (err, result) {
        if (err) {
            //console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})
module.exports = router