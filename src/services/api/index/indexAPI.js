const models = require('../../db')//db.js路径
const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const $sql = require('../../sqlMap')//sqlMap.js路径
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
router.get('/LeftDate', (req, res) => {
    const sql = $sql.Index.selectLeft
    const params = req.body
    //console.log(params)
    conn.query(sql,[], function (err, result) {
        if (err) {
            //console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})
router.get('/CenterDate', (req, res) => {
    const sql = $sql.Index.selectCenter
    const params = req.body
    //console.log(params)
    conn.query(sql,[], function (err, result) {
        if (err) {
            //console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})
router.get('/RunDate', (req, res) => {
    const sql = $sql.Index.selectRun
    const params = req.body
    //console.log(params)
    conn.query(sql,[], function (err, result) {
        if (err) {
            //console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})
router.get('/RightDate', (req, res) => {
    const sql = $sql.Index.selectRight
    const params = req.body
    //console.log(params)
    conn.query(sql,[], function (err, result) {
        if (err) {
            //console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})
module.exports = router