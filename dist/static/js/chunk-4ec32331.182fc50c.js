(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4ec32331"],{"0b26":function(e,t,a){"use strict";a("293e")},"293e":function(e,t,a){},"4bc0":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-scrollbar",{staticStyle:{height:"120%"}},[a("el-col",{attrs:{span:24}},[a("el-card",{attrs:{shadow:"always"}},[a("el-row",[a("el-form",{ref:"StepForm",attrs:{model:e.StepForm,"label-width":"80px"}},[a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"id"}},[a("el-input",{model:{value:e.StepForm.id,callback:function(t){e.$set(e.StepForm,"id",t)},expression:"StepForm.id"}})],1)],1),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"步骤名称"}},[a("el-input",{model:{value:e.StepForm.step_name,callback:function(t){e.$set(e.StepForm,"step_name",t)},expression:"StepForm.step_name"}})],1)],1),a("el-col",{attrs:{span:6}},[a("el-form-item",{attrs:{label:"后缀名称"}},[a("el-input",{model:{value:e.StepForm.suffix_name,callback:function(t){e.$set(e.StepForm,"suffix_name",t)},expression:"StepForm.suffix_name"}})],1)],1),a("el-col",{attrs:{span:6}},[a("el-form-item",[a("el-button",{attrs:{type:"primary",size:"small",plain:""}},[e._v("添加")]),a("el-button",{attrs:{type:"danger",size:"small",plain:""}},[e._v("删除")])],1)],1)],1)],1)],1)],1),a("el-row",{staticClass:"top"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData.slice((e.currentPage-1)*e.pageSize,e.currentPage*e.pageSize)}},[a("el-table-column",{attrs:{prop:"id",label:"编号"}}),a("el-table-column",{attrs:{prop:"step_name",label:"步骤名称"}}),a("el-table-column",{attrs:{prop:"suffix_name",label:"后缀名称"}})],1),a("div",{staticClass:"block",staticStyle:{"margin-top":"15px"}},[a("el-pagination",{attrs:{align:"center","current-page":e.currentPage,"page-sizes":[5,10],"page-size":e.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.tableData.length},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)],1)],1)},n=[],s=(a("96cf"),a("1da1")),i=(a("ef97"),{data:function(){return{currentPage:1,total:20,pageSize:5,StepForm:{id:"",step_name:"",suffix_name:""},tableData:this.getStepList()}},methods:{handleSizeChange:function(e){console.log("每页 ".concat(e," 条")),this.currentPage=1,this.pageSize=e},handleCurrentChange:function(e){console.log("当前页: ".concat(e)),this.currentPage=e},getStepList:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(){var t,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$http.get("StepConfig/AllStep");case 2:t=e.sent,a=t.data,this.tableData=a;case 5:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),submitStepForm:function(e){var t=this;this.$refs[e].validate(function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(a){var r,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!a){e.next=6;break}return e.next=3,t.$http.post("StepConfig/addStep",t.StepForm);case 3:r=e.sent,n=r.data,n.affectedRows>0?(t.showMessage("success","添加成功！"),t.$router.push("StepConfig")):t.showMessage.error("添加失败！");case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())},deleteStep:function(e){var t=this;this.$refs[e].validate(function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(a){var r,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!a){e.next=6;break}return e.next=3,t.$http.post("StepConfig/delStep",t.StepForm);case 3:r=e.sent,n=r.data,n.affectedRows>0?(t.showMessage("success","删除成功！"),t.$router.push("StepConfig")):t.showMessage.error("删除失败！");case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())}}}),o=i,l=(a("0b26"),a("2877")),c=Object(l["a"])(o,r,n,!1,null,"2898ee4a",null);t["default"]=c.exports}}]);