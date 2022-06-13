const models = require('../../db');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../../sqlMap');
// 连接数据库
const conn = mysql.createConnection(models.mysql);
conn.connect();
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
//卫星下拉框
router.get('/Allsatellite', (req, res) => {
    const params = req.query;
    const sql = $sql.ErrorDispose.AllSatelliteName;
    // console.log(params)
    conn.query(sql,[], function (err, result) {
        if (err) {
            // console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
});
//省份下拉框
router.get('/Allprovince', (req, res) => {
    const params = req.query;
    const sql = $sql.ErrorDispose.AllProvinceName;
    // console.log(params)
    conn.query(sql,[], function (err, result) {
        if (err) {
            // console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
});
//步骤下拉框
router.get('/Allstep', (req, res) => {
    const params = req.query;
    const sql = $sql.ErrorDispose.AllStepName;
    // console.log(params)
    conn.query(sql,[], function (err, result) {
        if (err) {
            // console.log(err)
        }
        if (result) {
            jsonWrite(res, result)
        }
    })
});
//全部出错数据
router.get('/ErrorDisPoseData', (req, res) => {
    const params = req.query;
    // console.log(params)
    const sqlToday = $sql.ErrorDispose.ALLErrorToday;
    const sqlHis = $sql.ErrorDispose.ALLErrorHis;
    let resultArr = [];
    // 查询历史出错数据

    conn.query(sqlToday,[],function(err,result){
        if(err){
            // console.log(err);
        }
        if(result){
            // console.log(params)
            // console.log(result);
            resultArr = resultArr.concat(result);

            //查询当天出错数据
            conn.query(sqlHis,[],function(err,result){
                if(err){
                    // console.log(err);
                }
                if(result){
                    resultArr = resultArr.concat(result);
                    // console.log(resultArr);
                    jsonWrite(res,resultArr);
                }
            });

        }else{
            jsonWrite(res,resultArr);
        }
    });
});
//查询出错数据
router.get('/SearchErrorDisPoseData', (req, res) => {
    const params = req.query;
    // console.log(params)
    const sqlToday = $sql.ErrorDispose.selectErrorToday;
    const sqlHis = $sql.ErrorDispose.selectErrorHis;
    let resultArr = [];
    // 查询历史出错数据

    conn.query(sqlToday,[params.job_id,params.job_id,params.product_id,params.product_id,params.scene_no,params.scene_no,
        params.orbit_no,params.orbit_no, params.satellite_name,params.satellite_name,params.province_name,
        params.province_name,params.step_name,params.step_name],function(err,result){
        if(err){
            // console.log(err);
        }
        if(result){
            // console.log(params)
            // console.log(result);
            resultArr = resultArr.concat(result);

            //查询当天出错数据
            conn.query(sqlHis,[params.job_id,params.job_id,params.product_id,params.product_id,params.scene_no,params.scene_no,
                params.orbit_no,params.orbit_no, params.satellite_name,params.satellite_name,params.province_name,
                params.province_name,params.step_name,params.step_name],function(err,result){
                if(err){
                    // console.log(err);
                }
                if(result){
                    resultArr = resultArr.concat(result);
                    // console.log(resultArr);
                    jsonWrite(res,resultArr);
                }
            });

        }else{
            jsonWrite(res,resultArr);
        }
    });
});

module.exports = router;