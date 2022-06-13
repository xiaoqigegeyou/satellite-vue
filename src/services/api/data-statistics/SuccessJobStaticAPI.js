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

//任务节点分布
router.get('/taskNodeData',(req,res)=>{
    //获取查询参数 { status：'FAILED' startTime: '1593619200000', endTime: '1594223999000' }
    const params = req.query;
    //console.log(params);
    const sqlHis = $sql.MapInfo.showTaskNodeDataByDateHis;
    const sqlToday = $sql.MapInfo.showTaskNodeDataByDateToday;
    let resultArr = [];
    //判断是否需要查找当天的表
    var flag = false;
    var now = new Date().getTime();
    if(parseInt(params.startTime) < now && now < parseInt(params.endTime))flag=true;

    // 查询历史表任务节点分布数据
    conn.query(sqlHis,[params.status,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))],function(err,result){
        if(err){
            console.log(err);
        }
        if(result){
            //console.log(result);
            resultArr = resultArr.concat(result);

            //查询当天表的节点分布情况
            if(flag){
                conn.query(sqlToday,[params.status,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))],function(err,result){
                    if(err){
                        console.log(err);
                    }
                    if(result){
                        //console.log(result);
                        //合并数据
                        if(resultArr.length > 0){
                            for(let i=0;i<=resultArr.length;i++){
                                let element = resultArr[i];
                                for(let j=0;j<result.length;j++){
                                    if(result[j].name == element.name){
                                        element.value += result[j].value;
                                        //删除该数组中的此对象
                                        result.splice(j,1);
                                        break;
                                    }
                                }
                            }
                        }
                        //遍历完成若第二个数组中还有元素（表示第一个数组中没有的，而第二个数组中有的），直接合并数组
                        if(result.length>0){
                            resultArr = resultArr.concat(result);
                        }
                        //console.log(resultArr);
                        jsonWrite(res,resultArr);

                    }
                });

            }else{
                jsonWrite(res,resultArr);
            }

        }
    });

});

//获取任务量数据
router.get('/taskStaData',(req,res)=>{
    //获取查询参数{ status：'FAILED' startTime: '1593619200000', endTime: '1594223999000' }
    const params = req.query;
    //console.log(params)
   /*  const sql = $sql.ImageProcessFlow.showTaskStaDataByStatusTime;
    conn.query(sql,[params.status,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))],function(err,result){
        if(err){
            console.log(err);
        }
        if(result){
            console.log(result);
            // 返回信息
            jsonWrite(res,result);
        }
    }); */



    let sqlHis = $sql.Application.showByTimeAndStatusHisFail;
    let sqlToday = $sql.Application.showByTimeAndStatusTodayFail;
    let resultArr = [];
    //console.log(new Date(parseInt(params.startTime)).toLocaleString());
    if(params.status === 'SUCCEEDED'){
        sqlHis = $sql.Application.showByTimeAndStatusHisSuccess;
        sqlToday = $sql.Application.showByTimeAndStatusTodaySuccess;
    }

    //判断是否需要查找当天的表
    var flag = false;
    var now = new Date().getTime();
    if(parseInt(params.startTime) < now && now < parseInt(params.endTime))flag=true;
    //查询历史表中的数据 params.status:查询状态
    conn.query(sqlHis,[params.status,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))],function(err,result){
        if(err){
            //console.log(err);
        }
        if(result){
            //console.log('获取历史表数据...result：');
            //console.log(result);
            //jsonWrite(res,result);
            resultArr = resultArr.concat(result);
            //console.log("resultArr");
            //console.log(resultArr);
            if(flag){
                //查询当天表中的数据
                conn.query(sqlToday,[params.status,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))],function(err,result){
                    if(err){
                        console.log(err);
                    }
                    if(result){
                        //console.log('2');
                        //console.log("查询result：");
                        //console.log(result);
                        //jsonWrite(res,result);
                        resultArr = resultArr.concat(result);
                        //console.log(resultArr);
                        //console.log("resultArr：");
                        jsonWrite(res,resultArr);
                    }
                });
            }else{
                jsonWrite(res,resultArr);
            }
        }
        
        
    });
    
    
    
});

//任务阶段统计返回数据
router.get('/taskPhaseStaData',(req,res)=>{
    //获取查询参数{ status：'FAILED' startTime: '1593619200000', endTime: '1594223999000' }
    const params = req.query;

    /* const sql = $sql.ImageProcessFlow.showTaskPhaseStaDataByStatusTime;
    conn.query(sql,[params.status,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))],function(err,result){
        if(err){
            console.log(err);
        }
        if(result){
            console.log(result);
            jsonWrite(res,result);
        }
    }); */


    const sqlHis = $sql.Application.showByStepAndStatusHis;
    const sqlToday = $sql.Application.showByStepAndStatusToday;
    let resultArr = [];

    //判断是否需要查找当天的表
    var flag = false;
    var now = new Date().getTime();
    if(parseInt(params.startTime) < now && now < parseInt(params.endTime))flag=true;

    conn.query(sqlHis,[params.status,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))],function(err,result){
        if(err){
            //console.log(err);
        }
        if(result){
            resultArr = resultArr.concat(result);
        }
        if(flag){
            //查询当天表中的数据
            conn.query(sqlToday,[params.status,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))],function(err,result){
                if(err){
                    //console.log(err);
                }
                if(result){
                    //console.log('2');
                    //jsonWrite(res,result);
                    //合并数组
                    if(resultArr.length>0){
                        for(let i=0;i<resultArr.length;i++){
                            let element = resultArr[i];
                            for(let j=0;j<result.length;j++){
                                //当前数组中含有id相同的元素
                                if(element.id === result[j].id){
                                    //将amount进行相加
                                    element.amount += result[j].amount;
                                    //删除该数组中的此对象
                                    result.splice(j,1);
                                    break;
                                }
                            }
                        }
                    }
                    
                    //遍历完成若第二个数组中还有元素（表示第一个数组中没有的，而第二个数组中有的），直接合并数组
                    if(result.length>0){
                        resultArr = resultArr.concat(result);
                    }
                    //console.log(resultArr);
                    jsonWrite(res,resultArr);
                }
            });
        }else{
            jsonWrite(res,resultArr);
        }
        
    })

});

// 按照卫星名对任务分组查询
router.get('/satelliteDisStaData',(req,res)=>{
    //获取查询参数{ status：'FAILED' startTime: '1593619200000', endTime: '1594223999000' }
    const params = req.query;

    /* const sql = $sql.ImageProcessFlow.showTaskSatelliteDisStaData;
    conn.query(sql,[params.status,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))],function(err,result){
        if(err){
            console.log(err);
        }
        if(result){
            console.log(result);
            jsonWrite(res,result);
        }
    }); */

    let sqlHis = $sql.Application.showBySatelliteAndStatusHisFail;
    let sqlToday = $sql.Application.showBySatelliteAndStatusTodayFail;
    let resultArr = [];

    //判断是否需要查找当天的表
    var flag = false;
    var now = new Date().getTime();
    if(parseInt(params.startTime) < now && now < parseInt(params.endTime))flag=true;

    if(params.status === 'SUCCEEDED'){
        sqlHis = $sql.Application.showBySatelliteAndStatusHisSuccess;
        sqlToday = $sql.Application.showBySatelliteAndStatusTodaySuccess;
    }

    //查询历史表中的数据
    conn.query(sqlHis,[params.status,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))],function(err,result){
        if(err){
            //console.log(err);
        }
        if(result){
           resultArr = resultArr.concat(result);
           if(flag){
            //查询当天表中的数据
            conn.query(sqlToday,[params.status,$FormatDate(parseInt(params.startTime)),$FormatDate(parseInt(params.endTime))],function(err,result){
                if(err){
                    //console.log(err);
                }
                if(result){
                    //合并数组
                    if(resultArr.length>0){
                        for(let i=0;i<resultArr.length;i++){
                            let element = resultArr[i];
                            for(let j=0;j<result.length;j++){
                                //当前数组中含有id相同的元素
                                if(element.name === result[j].name){
                                    //将amount进行相加
                                    element.value += result[j].value;
                                    //删除该数组中的此对象
                                    result.splice(j,1);
                                    break;
                                }
                            }
                        }
                    }
                    
                    //遍历完成若第二个数组中还有元素（表示第一个数组中没有的，而第二个数组中有的），直接合并数组
                    if(result.length>0){
                        resultArr = resultArr.concat(result);
                    }

                   // console.log(resultArr);
                    jsonWrite(res,resultArr);
                    }
                });
            }else{
                jsonWrite(res,resultArr);
            }
        }
        
        
    });
});

module.exports = router