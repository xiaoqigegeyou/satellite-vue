const models = require('../../db')
const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const $sql = require('../../sqlMap')

//获取数据库连接
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

router.post('/archive',(req,res) =>{
    /* 
    { "satellite" : "ZY3", "provinceid" : "4446", 
    "productid" : "1234151", "archivestatus" : "COMPLETED/FATLED",
    "message": "success"
    }
    */
   console.log(req.params);
   // 获取
    const params = req.body;
    console.log(params);
    const finishTime = new Date();
    const timeStamp = finishTime.getTime().toString();
    const state = 'FINISHED';
    const stepID = 12;
    let circleId = "";
    let finalStatus = "SUCCEEDED";
    if(params.archivestatus == 'FATLED'){
        finalStatus = "FAILED";
    }

    // 根据产品号和卫星名查询圈号
    const selectSql = $sql.Push.selectCricleIdFromHisAndToday;
    const selectParams = [params.satellite,params.productid,params.satellite,params.productid];
    conn.query(selectSql,selectParams,function(err,result){
        if(err){
            console.log(err);
        }
        if(result){
            console.log(result);
            for(let i=0;i<result.length;i++){
                const element = result[i];
                if(element.circle_id != null && element.circle_id != ''){
                    circleId=element.circle_id;
                    break;
                }
            }

        }
    });

    //插入
    const sql = $sql.Push.insertPushDataToApplicationInfo;
    const sqlParams = [params.satellite,parseInt(params.provinceid),params.productid,finishTime,timeStamp,state,stepID,circleId,finalStatus];

    conn.query(sql,sqlParams,function(err,result){
        var resultData = {};
        if(err){
            console.log(err);
        }
        if(result){
            console.log(result);
            if(result.affectedRows > 0){
                resultData = { "result" : "SUCCESS" , "pushtime" : finishTime };
                jsonWrite(res,resultData);
                return;
            }
        }
        resultData = { "result" : "FAIL" , "pushtime" : finishTime };
        jsonWrite(res,resultData)
    });


})



module.exports = router