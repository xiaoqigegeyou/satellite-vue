(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6c621963"],{"02ab":function(t,e,a){},"0acc":function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("section",[a("DatePicker",{on:{getDate:t.getDate}}),a("el-row",{staticClass:"top"},[a("el-col",{directives:[{name:"loading",rawName:"v-loading",value:t.loading1,expression:"loading1"}],attrs:{span:9,offset:1,"element-loading-text":"正在获取"}},[a("chart",{ref:"taskNodeDis",attrs:{options:t.taskNodeDis,"auto-resize":!0}})],1),a("el-col",{directives:[{name:"loading",rawName:"v-loading",value:t.loading2,expression:"loading2"}],attrs:{span:9,offset:1,"element-loading-text":"正在获取"}},[a("chart",{ref:"taskSta",attrs:{options:t.taskSta,"auto-resize":!0}})],1)],1),a("el-row",[a("el-col",{directives:[{name:"loading",rawName:"v-loading",value:t.loading3,expression:"loading3"}],attrs:{span:9,offset:1,"element-loading-text":"正在获取"}},[a("chart",{ref:"taskPhaseSta",attrs:{options:t.taskPhaseSta,"auto-resize":!0}})],1),a("el-col",{directives:[{name:"loading",rawName:"v-loading",value:t.loading4,expression:"loading4"}],attrs:{span:9,offset:1,"element-loading-text":"正在获取"}},[a("chart",{ref:"satelliteDisSta",attrs:{options:t.satelliteDisSta,"auto-resize":!0}})],1)],1)],1)},i=[],n=(a("96cf"),a("1da1")),r=(a("c037"),a("94b1"),a("bfd6")),o=(a("bc3a"),a("af94"),new Array(4)),l=[],c=[],u={title:{text:"景数统计（每日）",left:"center",bottom:0},color:["#3398DB"],tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},grid:{containLabel:!0},xAxis:[{type:"category",data:c,axisTick:{alignWithLabel:!0},axisLabel:{show:!0,interval:0,rotate:40,textStyle:{color:"#000"}}}],yAxis:[{type:"value",axisLabel:{show:!0,textStyle:{color:"#000"}}}],series:[{name:"景数",type:"bar",barWidth:"60%",label:{normal:{show:!0,position:"top"}},data:l}]},h=[{value:3,name:"gpu09"},{value:1,name:"gpu04"},{value:2,name:"gpu21"},{value:5,name:"gpu30"},{value:8,name:"gpu27"}],d=[],g=[];function p(t,e){}var m={title:{text:"任务节点分布",left:"center",bottom:0},tooltip:{trigger:"item",formatter:"任务量：{b} : {c} ({d}%)"},series:[{name:"节点分布",type:"pie",center:["45%","50%"],radius:"60%",itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(255, 255, 255, 0.5)"}},label:{emphasis:{show:!0,textStyle:{fontSize:"16"}}},data:h}]},f={title:{text:"任务步骤统计",left:"center",bottom:0},tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},grid:{left:"3%",right:"8%",bottom:"10%",top:"10%",containLabel:!0},xAxis:{type:"value",boundaryGap:[0,.01],axisLabel:{show:!0,textStyle:{color:"#000"}}},yAxis:{type:"category",data:[],axisLabel:{show:!0,textStyle:{color:"#000"}}},series:[{name:"数量",type:"bar",label:{normal:{show:!0,position:"right"}},data:d}]},D={title:{text:"景数卫星分布统计",left:"center",bottom:0},tooltip:{trigger:"item",formatter:"{a} <br/>{b}: {c} ({d}%)"},series:[{name:"景数",type:"pie",radius:["50%","70%"],center:["50%","42%"],avoidLabelOverlap:!1,label:{emphasis:{show:!0,textStyle:{fontSize:"30",fontWeight:"bold"}}},data:g}]};function S(t){console.log(t);var e=t[0],a=t[1];return p(e,a),o[0]=m,o[1]=u,o[2]=f,o[3]=D,o}var v={name:"dataStatistics",props:{flage:String},data:function(){return{taskNodeDis:{},taskSta:{},taskPhaseSta:{},satelliteDisSta:{},queryDate:[],loading1:!0,loading2:!0,loading3:!0,loading4:!0}},methods:{getDate:function(t){null!=t&&2==t.length?(this.queryDate[0]=t[0],this.queryDate[1]=t[1]+864e5-1):this.setDefaultDate();S(this.queryDate);this.taskNodeDis=o[0],this.taskSta=o[1],this.taskPhaseSta=o[2],this.satelliteDisSta=o[3],console.log(this.queryDate),this.getTaskNodeData(this.queryDate),this.getTaskStaData(this.queryDate),this.taskPhaseStaData(this.queryDate),this.satelliteDisStaData(this.queryDate),this.$refs.taskNodeDis.mergeOptions(this.taskNodeDis),this.$refs.taskSta.mergeOptions(this.taskSta),this.$refs.taskPhaseSta.mergeOptions(this.taskPhaseSta),this.$refs.satelliteDisSta.mergeOptions(this.satelliteDisSta)},getTaskNodeData:function(){var t=Object(n["a"])(regeneratorRuntime.mark((function t(e){var a,s,i,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return this.loading1=!0,a=e[0],s=e[1],t.next=5,this.$http.get("SuccessStatic/taskNodeData?status="+this.flage+"&startTime="+a+"&endTime="+s);case 5:i=t.sent,n=i.data,console.log(n),this.taskNodeDis.series[0].data=n,this.loading1=!1;case 10:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}(),getTaskStaData:function(){var t=Object(n["a"])(regeneratorRuntime.mark((function t(e){var a,s,i,n,r,o,l,c;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return this.loading2=!0,a=e[0],s=e[1],t.next=5,this.$http.get("SuccessStatic/taskStaData?status="+this.flage+"&startTime="+a+"&endTime="+s);case 5:for(i=t.sent,n=i.data,console.log(n),r=[],o=[],l=0;l<n.length;l++)c=n[l],r.push(c.amount),o.push(c.day);this.taskSta.xAxis[0].data=o,this.taskSta.series[0].data=r,this.loading2=!1;case 14:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}(),taskPhaseStaData:function(){var t=Object(n["a"])(regeneratorRuntime.mark((function t(e){var a,s,i,n,r,o,l,c;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return this.loading3=!0,a=e[0],s=e[1],t.next=5,this.$http.get("SuccessStatic/taskPhaseStaData?status="+this.flage+"&startTime="+a+"&endTime="+s);case 5:for(i=t.sent,n=i.data,console.log(n),r=[],o=[],l=0;l<n.length;l++)c=n[l],o.push(c.amount),r.push(c.step_name);this.taskPhaseSta.yAxis.data=r,this.taskPhaseSta.series[0].data=o,this.loading3=!1;case 14:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}(),satelliteDisStaData:function(){var t=Object(n["a"])(regeneratorRuntime.mark((function t(e){var a,s,i,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return this.loading4=!0,a=e[0],s=e[1],t.next=5,this.$http.get("SuccessStatic/satelliteDisStaData?status="+this.flage+"&startTime="+a+"&endTime="+s);case 5:i=t.sent,n=i.data,console.log(n),this.satelliteDisSta.series[0].data=n,this.loading4=!1;case 10:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}(),setDefaultDate:function(){var t=new Date(new Date((new Date).toLocaleDateString()).getTime()+864e5-1),e=Date.parse(t),a=Date.parse(new Date(t.getTime()-6048e5+1));this.queryDate=[a,e]}},components:{DatePicker:r["a"]},mounted:function(){this.setDefaultDate(),this.getDate(this.queryDate)},watch:{}},x=v,w=(a("a497"),a("2877")),k=Object(w["a"])(x,s,i,!1,null,"a5c053ee",null);e["a"]=k.exports},a497:function(t,e,a){"use strict";a("02ab")},bfd6:function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-row",[a("el-card",{attrs:{shadow:"always"}},[a("el-date-picker",{attrs:{size:"small",type:"daterange","value-format":"timestamp","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期"},model:{value:t.dateValues,callback:function(e){t.dateValues=e},expression:"dateValues"}}),t._v("\n          \n      "),a("el-button",{attrs:{type:"primary",size:"small",icon:"el-icon-search"},on:{click:t.reverseMessage}},[t._v("查找")])],1)],1)},i=[],n={data:function(){return{dateValues:""}},methods:{reverseMessage:function(){this.$emit("getDate",this.dateValues)}}},r=n,o=a("2877"),l=Object(o["a"])(r,s,i,!1,null,null,null);e["a"]=l.exports},c695:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-row",[a("statistics",{attrs:{flage:t.error}})],1)],1)},i=[],n=a("0acc"),r={data:function(){return{error:"FAILED"}},methods:{},components:{statistics:n["a"]}},o=r,l=a("2877"),c=Object(l["a"])(o,s,i,!1,null,null,null);e["default"]=c.exports}}]);