import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/";
// 'development',use package;'production':use cdn;
import ElementUI from "element-ui";
Vue.use(ElementUI, { size: "mini" });
import("element-ui/lib/theme-chalk/index.css");

import "./components/iconSvg"; // iconSvg

import "@/permission"; // permission control

import "@/mockjs"; // mock数据

/* // 图标
import './icons' */


// DataV将自动注册所有组件为全局组件
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

// // i18n国际化
// import i18n from "@/lang";

//引入Echarts图表
import ECharts from "vue-echarts";

import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";

import 'echarts/lib/chart/scatter';
Vue.component("chart", ECharts);

import echarts2 from 'echarts'
Vue.prototype.$echarts = echarts2

import 'echarts/theme/macarons'


// 分享功能集合
import { shareConfig } from "./utils/share";

//引入axios
import axios from 'axios';
import { from } from "core-js/fn/array";
//axios.defaults.baseURL='http://172.13.24.103:3000/api/';
axios.defaults.baseURL='http://localhost:3000/api/';
//全局注册axios
Vue.prototype.$http = axios;
Vue.prototype.shareConfig = shareConfig;

Vue.config.productionTip = false;

Vue.config.devtools = true

Date.prototype.format = function(fmt) { 
  var o = { 
     "M+" : this.getMonth()+1,                 //月份 
     "d+" : this.getDate(),                    //日 
     "h+" : this.getHours(),                   //小时 
     "m+" : this.getMinutes(),                 //分 
     "s+" : this.getSeconds(),                 //秒 
     "q+" : Math.floor((this.getMonth()+3)/3), //季度 
     "S"  : this.getMilliseconds()             //毫秒 
 }; 
 if(/(y+)/.test(fmt)) {
         fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
 }
  for(var k in o) {
     if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
  }
 return fmt; 
}

new Vue({
  router,
  store,
  // i18n,
  render: h => h(App)
}).$mount("#app");
