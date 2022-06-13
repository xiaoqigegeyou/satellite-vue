const models = require('../../db')//db.js路径
const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const $sql = require('../../sqlMap')//sqlMap.js路径
const $FormatDate = require('../../util/DateUtil')
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
//卫星名称下拉框
router.get('/SatelliteName', (req, res) => {
    const sql = $sql.Satellite.show
    const params = req.body
    //console.log(params)
    conn.query(sql, [params.satellite_name], function (err, result) {
        if (err) {
            //console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})
//省份名称下拉框
router.get('/ProvincialName', (req, res) => {
    const sql = $sql.Provincial.show
    const params = req.body
    //console.log(params)
    conn.query(sql, [params.satellite_name], function (err, result) {
        if (err) {
            //console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})
//当天链路数据
router.get('/DataDisPoseToday', (req, res) => {
    const params = req.query
    const sql = $sql.Application.showByDataDisposeToday
    // console.log(params)
    conn.query(sql,[params.orbit_no], function (err, result) {
        if (err) {
            // console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})
//当天链路数据无圈号
router.get('/DataDisPoseTodayNULL', (req, res) => {
    const params = req.query
    const sql = $sql.Application.showByDataDisposeTodayNULL
    // console.log(params)
    conn.query(sql,[], function (err, result) {
        if (err) {
            // console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})


//圈号统计数据
router.get('/CircleToday', (req, res) => {
    const sql = $sql.Application.showCircleToday
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
//历史圈号统计数据
router.get('/CircleHis', (req, res) => {
    const params = req.query
    const sql = $sql.Application.showCircleHis
    // console.log(params)
    conn.query(sql,[$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))], function (err, result) {
        if (err) {
            // console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})
//历史链路数据
router.get('/DataDisPoseHis', (req, res) => {
    const params = req.query
    const sql = $sql.Application.showByDataDisposeHis
    // console.log(params)
    conn.query(sql,[$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime)),params.orbit_no], function (err, result) {
        if (err) {
            // console.log(err)
        }
        if (result) {
            // console.log(result)
            jsonWrite(res, result)
        }
    })
})
//历史链路数据无圈号
router.get('/DataDisPoseHisNULL', (req, res) => {
    const params = req.query
    const sql = $sql.Application.showByDataDisposeHisNULL
    // console.log(params)
    conn.query(sql,[$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))], function (err, result) {
        if (err) {
            // console.log(err)
        }
        if (result) {
            // console.log(result)
            jsonWrite(res, result)
        }
    })
})
//条件查询圈号统计数据
router.get('/CirclePro', (req, res) => {
    const params = req.query
    const sql = $sql.Application.showCirclePro
    // console.log(params)
    // console.log(sql)
    conn.query(sql,[params.orbit_no,params.orbit_no,params.scene_no,params.scene_no], function (err, result) {
        if (err) {
            // console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})
//条件查询链路数据
router.get('/DataDisPosePro', (req, res) => {
    const params = req.query
    const sql = $sql.Application.showByDataDisposePro
    // console.log(params)
    conn.query(sql,[params.orbit_no,params.orbit_no,params.scene_no,params.scene_no], function (err, result) {
        if (err) {
            // console.log(err)
        }
        if (result) {
            // console.log(result)
            jsonWrite(res, result)
        }
    })
})
//条件查询链路数据无圈号
router.get('/DataDisPoseProNULL', (req, res) => {
    const params = req.query
    const sql = $sql.Application.showByDataDisposeProNULL
    // console.log(params)
    conn.query(sql,[params.scene_no,params.scene_no], function (err, result) {
        if (err) {
            // console.log(err)
        }
        if (result) {
            // console.log(result)
            jsonWrite(res, result)
        }
    })
})
//条件查询圈号统计数据
router.get('/CircleAll', (req, res) => {
    const params = req.query
    const sql = $sql.Application.showCircleAll
    // console.log(params)
    // console.log(sql)
    conn.query(sql,[], function (err, result) {
        if (err) {
            // console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
})
//条件查询链路数据
// 接口：增加信息
// router.post('/addStu', (req, res) => {
//     const sql = $sql.Stu.add
//     const params = req.body
//     console.log('添加', params)
//     conn.query(sql, [params.stu_name, params.stu_sex, params.stu_college, params.stu_class], function (err, result) {
//         if (err) {
//             console.log(err)
//         }
//         if (result) {
//             jsonWrite(res, result)
//         }
//     })
// })
// 接口：删除信息
// router.post('/delStu', (req, res) => {
//     const sql = $sql.Stu.del
//     const params = req.body
//     console.log('删除', params)
//     conn.query(sql, [params.stu_Id], function (err, result) {
//         if (err) {
//             console.log(err)
//         }
//         if (result) {
//             jsonWrite(res, result)
//         }
//     })
// })

// 接口：修改信息
// router.post('/updateStu', (req, res) => {
//     const sql = $sql.Stu.update
//     const params = req.body
//     console.log('修改', params)
//     conn.query(sql, [params.stu_name, params.stu_sex, params.stu_college, params.stu_class, params.stu_Id], function (err, result) {
//         if (err) {
//             console.log(err)
//         }
//         if (result) {
//             jsonWrite(res, result)
//         }
//     })
// })
module.exports = router