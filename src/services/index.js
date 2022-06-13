// node 后端服务器
//data-statistics
const SuccessJobStaticApi = require('./api/data-statistics/SuccessJobStaticAPI')
//user
const UserApi = require('./api/user/UserAPI')
//data-visual
const NodeJobApi = require('./api/data-visual/NodeJobAPI')
const DataDisposeApi = require('./api/data-visual/DataDisposeAPI')
//dispose
const ErrorDisposeApi = require('./api/dispose/ErrorDisposeAPI')
//system-config
const NodeConfigApi = require('./api/system-config/NodeConfigAPI')
const ProvinceConfigApi = require('./api/system-config/ProvinceConfigAPI')
const SatelliteConfigApi = require('./api/system-config/SatelliteConfigAPI')
const StepConfigApi = require('./api/system-config/StepConfigAPI')
// push
const PushApi = require('./api/push/PushAPI')
// index
const indexApi = require('./api/index/indexAPI')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
//采用设置所有均可访问的方法解决跨域问题
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() === 'options')
        res.send(200); //让options尝试请求快速结束
    else
        next();
})
app.use(bodyParser.json()) // 以json格式返回出去
app.use(bodyParser.urlencoded({ extended: false }))
// 后端api路由

app.use('/api/SuccessStatic',SuccessJobStaticApi)
app.use('/api/User',UserApi)
app.use('/api/NodeJob',NodeJobApi)
app.use('/api/DataDispose',DataDisposeApi)
app.use('/api/ErrorDispose',ErrorDisposeApi)
app.use('/api/NodeConfig',NodeConfigApi)
app.use('/api/ProvinceConfig',ProvinceConfigApi)
app.use('/api/SatelliteConfig',SatelliteConfigApi)
app.use('/api/StepConfig',StepConfigApi)
app.use('/api/Push',PushApi)
app.use('/api/Index',indexApi)
// 监听端口
app.listen(3000)
console.log('success listen at port:3000......')