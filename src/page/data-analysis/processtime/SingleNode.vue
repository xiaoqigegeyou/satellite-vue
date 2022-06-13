<template>
  <div>
    <el-row>
      <el-col :span="23">
        <DatePicker @getDate="getDate" @handleSeeReport='handleSeeReport'></DatePicker>
        <el-row class="top">
          <!-- 图表 -->
          <el-col :span="19">
            <div class="block">
              <chart id="myChart"
                ref="nodeJob"
                :options="nodeJob"
                :auto-resize="true"
                 theme="macarons"
                v-loading="loading1"
              ></chart>
            </div>
          </el-col>
          <!-- 信息内容 -->
          <el-col :span="5">
             <PocessTimeTable :tableList="tableList"></PocessTimeTable>
             <el-switch class="seemode" v-if="queryNode == 'all'"
              v-model="seeMode"
              active-text="节点总览"
              inactive-text="分节点查看">
            </el-switch>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 侧边抽屉分析报告 -->
    <Report :title="report_title" :content="report_content" :drawer_visible="report_visible" @updateReportVisable="updateReportVisable"></Report>
  </div>
</template>

<script>
import echarts from "echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';
import DatePicker from '../components/DatePickerSmall'
import PocessTimeTable from "../components/ProcessTimeTable.vue"
import Report from '../components/Report'
export default {
  data() {
    return {
       // 侧边报告需要的数据
      report_title:'分析报告',
      report_content:'',
      report_visible: false,
      // 查看模式
      seeMode: true,
      // 图表数据
      tableList: [],
      //右侧节点信息列表
      nodeList: [],
      //查询日期
      queryDate: [],
      //当前激活的查询节点，全部为all，其他节点形式为：kj-gpu30.bigdata.com
      queryNode: "all",
      // 是否显示图表加载中
      loading1: false,
      nodeJob:{
        title: {
          text: "任务平均运行时间统计",
          left: "center",
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}s'
        },
        xAxis: {
          name:'日期',
          type: 'category',
          data: []
        },
        yAxis: {
          name:'平均运行时间(s)',
          type: 'value'
        },
        series: [{
          data: [],
          type: 'bar'
        }]
      }
    };
  },
  components: {
    DatePicker,
    PocessTimeTable,
    Report
  },
  mounted() {
    // 设置默认查询时间
    this.setDefaultDate();
    // 获取节点列表
    this.getAllNodeList();
  },
  methods: {
    //获取所有的节点信息
    async getAllNodeList() {
      const { data: result } = await this.$http.get("NodeJob/allNode");
      //console.log(result);
      this.nodeList = result;
      // 加载第一个节点的数据
      this.getNodeData(this.queryNode);
    },
    // 获取图表的数据
    async getNodeData(node) {
      this.loading1 = true;
      /* if('all'===node){
        node = this.nodeList[0].domain;
      } */
      const params = {
        startTime: this.queryDate[0],
        endTime: this.queryDate[1],
        node,
        seeMode:this.seeMode
      };

      const { data: result } = await this.$http.get("processTime/singleNode", {
        params,
      });
      console.log(result);
      let xAxisData = [];
      let seriesData = [];
      for(let i=0;i<result.length;i++){
        result[i].amount = parseFloat((result[i].amount/1000).toFixed(1))
        xAxisData.push(result[i].day);
        seriesData.push(result[i].amount);
      }
      this.tableList=result
      // 解决数据重绘问题
      let myChart = echarts.init(document.getElementById("myChart"))
      myChart.clear()
      this.nodeJob.xAxis.data = xAxisData;
      this.nodeJob.series[0].data = seriesData;

      if(!this.seeMode && this.queryNode == 'all'){
        this.nodeJob.xAxis.name = '节点'
      }else{
        this.nodeJob.xAxis.name = '日期'
      }

      this.loading1 = false;
    },
    // 选择不同节点时触发此函数
    menuSlect(index) {
      // 加载节点的平均处理时间
      this.queryNode = index;
      this.getNodeData(this.queryNode);
    },
    // 选择日期时触发此函数
    getDate(dateValue) {
      //this.dateValue = dateValue
      if (dateValue != null && dateValue.length == 2) {
        this.queryDate[0] = dateValue[0];
        this.queryDate[1] = dateValue[1] + 24 * 60 * 60 * 1000 - 1;
      } else {
        //设置为默认的查询时间
        this.setDefaultDate();
      }
      console.log(this.queryDate);

      // 获取数据加载图表
      this.getNodeData(this.queryNode);
    },
    //设置查询时间为前30天
    setDefaultDate() {
      //默认查询为当前30天
      //获取当天结束时间的时间（23:59）
      var nowDayEnd = new Date(
        new Date(new Date().toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000 -
          1
      );
      //查询时间终止时间
      var endTimeStamp = Date.parse(nowDayEnd);
      //查询起始时间：终止时间前推30天(00:00)
      var startTimeStamp = Date.parse(
        new Date(nowDayEnd.getTime() - 30 * 24 * 60 * 60 * 1000 + 1)
      );

      //当前默认的查询日期前30天
      this.queryDate = [startTimeStamp, endTimeStamp];
    },
    // 点击查看分析报告按钮
    handleSeeReport(){
      if(this.queryNode === 'all'){
        if(!this.seeMode){
          this.generateAllNodeReport()
        }else{
          this.generateOneNodeReport()
        }
      }else{
        this.generateOneNodeReport()
      }
      // 显示抽屉
      this.report_visible = true
    },
    // 当查找的为全部节点时，分析报告生成方法
    generateAllNodeReport(){
      const start_date = new Date(this.queryDate[0]).format("yyyy-MM-dd")
      const end_date = new Date(this.queryDate[1]).format("yyyy-MM-dd")
      let node = this.queryNode
      if(node === 'all')node = "全部节点"
      const step_id = this.stepId

      let step_name_data = this.nodeJob.xAxis.data
      let step_data = this.nodeJob.series[0].data

      const ave = parseFloat((step_data.reduce((a,b)=>a+b)/step_data.length).toFixed(1))

      let max = {
        step_name: step_name_data[0],
        amount: step_data[0]
      }
      let min = {
        step_name: step_name_data[0],
        amount: step_data[0]
      }

      let abnormal_data = []

      step_data.forEach((item,index)=>{
        if(item > max.amount){
          max.step_name = step_name_data[index]
          max.amount = item
        }
        if(item < min.amount){
          min.step_name = step_name_data[index]
          min.amount = item
        }
        if(item > 1.8*ave){
          const t = {
            step_name : step_name_data[index],
            amount: item
          }
          abnormal_data.push(t)
        }
      })

      let ht = `<div style="color:#30475e;">查询时间：<b>${start_date}</b> 至 <b>${end_date}</b></div>
      <br/>
      <div>查询节点：<b>${node}</b></div>
      <br/>`

      ht+=`<div>所有节点的平均处理时间为：<span style="color:red"><b>${ave} s</b></span></div>
      <br/>
      <div>处理耗时最短的节点为<span style="color:green"><b>${min.step_name}</b></span>,
      耗时<span style="color:green"><b>${min.amount} s</b></span></div>
      <br/>
      <div>处理耗时最长的节点为<span style="color:red"><b>${max.step_name}</b></span>,
      耗时<span style="color:red"><b>${max.amount} s</b></span></div>
      <br/>
      <div>可能需要注意的节点如下（处理时间超多均值的80%）：</div>
      `
      abnormal_data.forEach(item=>{
          ht+=`<br/><div><span style="color:red"><b>${item.step_name}:${item.amount}s</b></span></div>`
        })
      this.report_content = ht
    },
    // 当查找的为具体的节点时，分析报告生成的方法
    generateOneNodeReport(){
      const start_date = new Date(this.queryDate[0]).format("yyyy-MM-dd")
      const end_date = new Date(this.queryDate[1]).format("yyyy-MM-dd")
      let node = this.queryNode
      if(node === 'all')node = "全部节点"

      let time = this.nodeJob.xAxis.data
      let process_data = this.nodeJob.series[0].data

      const ave = parseFloat((process_data.reduce((a,b)=>a+b)/process_data.length).toFixed(1))

      let max = {
        date: time[0],
        amount: process_data[0]
      }
      let min = {
        date: time[0],
        amount: process_data[0]
      }

      let abnormal_data = []
      process_data.forEach((item,index)=>{
        if(item > max.amount){
          max.date = time[index]
          max.amount = item
        }
        if(item < min.amount){
          min.date = time[index]
          min.amount = item
        }
        if(item > 1.8*ave){
          const t = {
            date : time[index],
            amount: item
          }
          abnormal_data.push(t)
        }
      })

      let ht = `<div style="color:#30475e;">查询时间：<b>${start_date}</b> 至 <b>${end_date}</b></div>
      <br/>
      <div>查询节点：<b>${node}</b></div>
      <br/>`

      ht+=`<div>平均处理时间为：<span style="color:red"><b>${ave} s</b></span></div>
      <br/>
      <div>处理耗时最短的日期为<span style="color:green"><b>${min.date}</b></span>,
      耗时<span style="color:green"><b>${min.amount} s</b></span></div>
      <br/>
      <div>处理耗时最长的日期为<span style="color:red"><b>${max.date}</b></span>,
      耗时<span style="color:red"><b>${max.amount} s</b></span></div>
      <br/>
      <div>可能需要注意的日期如下（处理时间超多均值的80%）：</div>
      `
      abnormal_data.forEach(item=>{
        ht+=`<br/><div><span style="color:red"><b>${item.date}:${item.amount}s</b></span></div>`
      })

      this.report_content = ht

    },
    // 分析报告是否显示状态发生改变时触发
    updateReportVisable(status){
        this.report_visible = status
    }
  },
  watch:{
    seeMode(){
      this.getNodeData(this.queryNode)
    }
  }
};
</script>

<style lang="scss" scoped>
.top {
  margin-top: 10px;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.echarts {
    width: 100%;
    height: 600px;
}
</style>