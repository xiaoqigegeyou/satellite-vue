const models = require('../../db')
const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const $sql = require('../../sqlMap')
const $FormatDate = require('../../util/DateUtil')
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
//查询所有的节点信息
router.get('/allNode',(req,res) => {
    const sql = $sql.BasicConfCluster.selectAll;
    conn.query(sql,function(err,result){
        if(err){
           // console.log(err);
        }
        if(result){
            // console.log(result);
            jsonWrite(res,result);
        }
    })
})

//查询每日的任务统计（全部节点和单个节点）
router.get('/JobAmount',(req,res) => {
    const params = req.query;
   // console.log(params);
    //返回结果
    let resultArr = [];

    //判断是否需要查找当天的表
    var flag = false;
    var now = new Date().getTime();
    if(parseInt(params.startTime) < now && now < parseInt(params.endTime))flag=true;

    if(params.node == null){
        //查询全部
       const sqlHis = $sql.MapInfo.showAllNodePreJobAmountByDateHis;
       conn.query(sqlHis,[$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))],function(err,result){
           if(err){
              // console.log(err);
           }
           if(result){
              // console.log("all");
               //console.log(result);
               resultArr = resultArr.concat(result);
               if(flag){
                   // 需要查询当天表
                   const sqlToday = $sql.MapInfo.showAllNodePreJobAmountByDateToday;
                   conn.query(sqlToday,[$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))],function(err,result){
                       if(err){
                          // console.log(err);
                       }
                       if(result){
                           //console.log("today");
                           resultArr = resultArr.concat(result);
                           //console.log(resultArr);
                           jsonWrite(res,resultArr);
                       }
                   })
               }else{
                //console.log(resultArr);
                jsonWrite(res,resultArr);
               }
           }
       })
    }else{
        //查询指定节点
        // 数据库添加了端口号 kj-gpu11.bigdata.com:8042
        params.node = params.node + ':8042';
       const sqlHis = $sql.MapInfo.showOneNodePreJobAmountByDateHis;
       conn.query(sqlHis,[params.node,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))],function(err,result){
        if(err){
           // console.log(err);
        }
        if(result){
           // console.log("one");
            //console.log(result);
            resultArr = resultArr.concat(result);
            if(flag){
                // 需要查询当天表
                const sqlToday = $sql.MapInfo.showOneNodePreJobAmountByDateToday;
                conn.query(sqlToday,[params.node,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))],function(err,result){
                    if(err){
                     //   console.log(err);
                    }
                    if(result){
                      //  console.log("today");
                        resultArr = resultArr.concat(result);
                       // console.log(resultArr);
                        jsonWrite(res,resultArr);
                    }
                })
            }else{
                //console.log(resultArr);
                jsonWrite(res,resultArr);
            }        
        }
    })
    } 
})

router.get('/AllNodeJobPage',(req,res) => {
    /* {
        startTime: '1593964800000',
        endTime: '1594569599000',
        pageNo: '1',
        pageSize: '7',
        node: all
      } */
    const params = req.query;
    // console.log(params);
     //返回结果
    let resultData = {total:0,list:[]};
     //判断是否需要查找当天的表
     var flag = false;
     var now = new Date().getTime();
     if(parseInt(params.startTime) < now && now < parseInt(params.endTime))flag=true;
     // 计算limit开始条件
     const start = (parseInt(params.pageNo) - 1) * parseInt(params.pageSize);

     if(params.node == null){
         //查询全部节点
         if(flag){
             //含有当天表
             const sql = $sql.MapInfo.showAllNodePageByDateAndToday;
             conn.query(sql,[$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime)),
                $FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime)),
                $FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime)),
                $FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime)),
                start,parseInt(params.pageSize)],
                function(err,result){
                    if(err){
                        //console.log(err);
                    }
                    if(result){
                        //console.log("allNodeToday");
                        //console.log(result);
                        //resultData = resultData.concat(result);
                        //console.log(resultData);
                        //jsonWrite(res,resultData);

                        resultData.total = result[0][0]['COUNT(1)'] + result[1][0]['COUNT(1)'];
                        resultData.list = result[2];
                        jsonWrite(res,resultData)
                    }
                })
         }else{
            //只查询历史表
            const sql = $sql.MapInfo.showAllNodePageByDateHis;
            conn.query(sql,[$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime)),
                $FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime)),
                start,parseInt(params.pageSize)],function(err,result){
                if(err){
                   // console.log(err);
                }
                if(result){
                    //console.log("allNode");
                    //resultData = resultData.concat(result);
                    resultData.total = result[0][0]['COUNT(1)'];
                    resultData.list = result[1];
                    //console.log(resultData);
                    jsonWrite(res,resultData);             
                }
            })
         }
     }else{
         //查询指定节点
         // 数据库添加了端口号 kj-gpu11.bigdata.com:8042
        params.node = params.node + ':8042';
         if(flag){
            //含有当天表
            const sql = $sql.MapInfo.showOneNodePageByDateAndToday;
            conn.query(sql,[params.node,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime)),
                params.node,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime)),
                params.node,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime)),
                params.node,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime)),
                start,parseInt(params.pageSize)],function(err,result){
                   if(err){
                       //console.log(err);
                   }
                   if(result){
                       //console.log("oneNodeToday");
                       //resultData = resultData.concat(result);
                       resultData.total = result[0][0]['COUNT(1)'] + result[1][0]['COUNT(1)'];
                       resultData.list = result[2];
                      // console.log(resultData);
                       jsonWrite(res,resultData);
                   }
               })
        }else{
           //只查询历史表
           const sql = $sql.MapInfo.showOneNodePageByDateHis;
           conn.query(sql,[params.node,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime)),
            params.node,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime)),
            start,parseInt(params.pageSize)],function(err,result){
               if(err){
                   //console.log(err);
               }
               if(result){
                  // console.log("oneNode");
                   //resultData = resultData.concat(result);
                   resultData.total = result[0][0]['COUNT(1)'];
                   resultData.list = result[1];
                  // console.log(resultData);
                   jsonWrite(res,resultData);             
               }
           })
        }
     }




})
module.exports = router