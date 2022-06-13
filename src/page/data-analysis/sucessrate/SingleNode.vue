<template>
  <div>
    <el-row>
      <el-col :span="3">
        <el-aside
          width="96%"
          style="background-color: #fff; height: 650px; overflow-x: hidden"
        >
          <el-menu
            :default-openeds="['1']"
            default-active="all"
            @select="menuSlect"
          >
            <el-submenu index="1">
              <template slot="title"
                ><i class="el-icon-message"></i>集群节点</template
              >
              <!-- 全部节点 -->
              <el-menu-item index="all">全部节点</el-menu-item>
              <!-- 遍历显示集群节点 默认查询第一个节点 -->
              <el-menu-item
                :index="node.domain"
                v-for="node in nodeList"
                :key="node.id"
                >{{ node.name }}</el-menu-item
              >
            </el-submenu>
          </el-menu>
        </el-aside>
      </el-col>
      <el-col :span="20">
        <DatePicker @getDate="getDate" @handleSeeReport='handleSeeReport'></DatePicker>
        <el-row class="top">
          <el-col :span="19">
            <div class="block">
              <chart
                ref="nodeJob"
                :options="nodeJob"
                :auto-resize="true"
                v-loading="loading1"
                theme="macarons"
              ></chart>
            </div>
          </el-col>
          <!-- 信息内容 -->
          <el-col :span="5">
             <SuccessRateTable :tableList="tableList"></SuccessRateTable>
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
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import DatePicker from '../components/DatePickerSmall'
import SuccessRateTable from "../components/SuccessRateTable.vue"
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
      // 右侧表格数据
      tableList:[],
      //右侧节点信息列表
      nodeList: [],
      //查询日期
      queryDate: [],
      //当前激活的查询节点，全部为all，其他节点形式为：kj-gpu30.bigdata.com
      queryNode: "all",
      // 是否显示图表加载中
      loading1 : false,
      nodeJob:{
        title: {
          text: "任务成功率统计",
          left: "center",
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}%'
        },
        xAxis: {
          name:'日期',
          type: 'category',
          data: []
        },
        yAxis: {
          name:'成功率(%)',
          type: 'value'
        },
        series: [{
          data: [],
          type: 'line'
        }]
      }
    };
  },
  components: {
    DatePicker,
    SuccessRateTable,
    Report
  },
  mounted(){
    // 设置默认查询时间
    this.setDefaultDate();
      // 获取节点列表
      this.getAllNodeList();
      
  },
  methods:{
      //获取所有的节点信息
    async getAllNodeList(){
      const {data:result} = await this.$http.get('NodeJob/allNode');
      //console.log(result);
      this.nodeList = result;
      // 加载第一个节点的数据
      this.getNodeData(this.queryNode);
    },
    // 获取图表的数据
    async getNodeData(node){
      this.loading1 = true;
      /* if('all'===node){
        node = this.nodeList[0].domain;
      } */
      const params = {
        startTime : this.queryDate[0],
        endTime : this.queryDate[1],
        node,
        seeMode: this.seeMode
      }

      const {data:result} = await this.$http.get('successRate/singleNode',{params});
      console.log(result);
      result.forEach(a=>{
        a.amount*=100
        a.amount = a.amount.toFixed(2)
      })
      this.tableList=result
      let xAxisData = [];
      let seriesData = [];
      for(let i=0;i<result.length;i++){
        xAxisData.push(result[i].day);
        seriesData.push(result[i].amount);
      }

      if(!this.seeMode && this.queryNode == 'all'){
        this.nodeJob.xAxis.name = '节点'
        this.nodeJob.series[0].type = 'bar'
      }else{
        this.nodeJob.xAxis.name = '日期'
        this.nodeJob.series[0].type = 'line'
      }
      this.nodeJob.xAxis.data = xAxisData;
      this.nodeJob.series[0].data = seriesData;

      this.loading1 = false;
    },
    // 选择不同节点时触发此函数
    menuSlect(index){
      // 加载节点的平均处理时间
      this.queryNode = index;
      this.getNodeData(this.queryNode);
    },
    // 选择日期时触发此函数
    getDate (dateValue) {
      //this.dateValue = dateValue
      if(dateValue!=null && dateValue.length == 2){
          this.queryDate[0] = dateValue[0];
          this.queryDate[1] = dateValue[1]+24*60*60*1000-1;
      }else{
        //设置为默认的查询时间
        this.setDefaultDate();
      }
      console.log(this.queryDate)

      // 获取数据加载图表
      this.getNodeData(this.queryNode);
    },
    //设置查询时间为前30天
    setDefaultDate(){
      //默认查询为当前30天
      //获取当天结束时间的时间（23:59）
      var nowDayEnd = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)
      //查询时间终止时间
      var endTimeStamp = Date.parse(nowDayEnd)
      //查询起始时间：终止时间前推30天(00:00)
      var startTimeStamp = Date.parse(new Date(nowDayEnd.getTime()-30*24*60*60*1000+1))

      //当前默认的查询日期前30天
      this.queryDate = [startTimeStamp,endTimeStamp];
    },
    // 点击查看分析报告按钮
    handleSeeReport(){
      if(this.queryNode == 'all' && !this.seeMode){
        this.generatePerNodeReport()
      }else{
        this.generateReport()
      }
      this.report_visible = true
    },
    // 分节点生成报告
    generatePerNodeReport(){
      const start_date = new Date(this.queryDate[0]).format("yyyy-MM-dd")
      const end_date = new Date(this.queryDate[1]).format("yyyy-MM-dd")
      let node = this.queryNode
      if(node === 'all')node = "全部节点"

      let node_name = this.nodeJob.xAxis.data
      let success_data = this.nodeJob.series[0].data
      console.log(success_data);

      const ave = parseFloat((success_data.reduce((a,b)=>parseFloat(a)+parseFloat(b),0)/success_data.length).toFixed(2))

      let max = {
        node: node_name[0],
        amount: success_data[0]
      }
      let min = {
        node: node_name[0],
        amount: success_data[0]
      }
      let abnormal_data = []

      success_data.forEach((item,index)=>{
        item = parseFloat(item)
        if(item > max.amount){
          max.node = node_name[index]
          max.amount = item
        }
        if(item < min.amount){
          min.node = node_name[index]
          min.amount = item
        }
        if(item < 90){
          let t = {
            node: node_name[index],
            amount: item
          }
          abnormal_data.push(t)
        }
      })
       let ht = `<div style="color:#30475e;">查询时间：<b>${start_date}</b> 至 <b>${end_date}</b></div>
        <br/>
        <div>查询节点：<b>${node}</b></div>
        <br/>`

        ht+=`<div>平均成功率为：<span style="color:red"><b>${ave} %</b></span></div>
        <br/>
        <div>成功率最高的节点为<span style="color:green"><b>${max.node}</b></span>
        ：<span style="color:green"><b>${max.amount} %</b></span></div>
        <br/>
        <div>成功率最低的节点为<span style="color:red"><b>${min.node}</b></span>
        ：<span style="color:red"><b>${min.amount} %</b></span></div>
        <br/>
        <div>可能需要注意的节点如下（成功率低于90%）：</div>
        `
        abnormal_data.forEach(item=>{
          ht+=`<br/><div><span style="color:red"><b>${item.node}:${item.amount}%</b></span></div>`
        })
        this.report_content = ht
    },
    // 生成其他分析报告
    generateReport(){
      const start_date = new Date(this.queryDate[0]).format("yyyy-MM-dd")
      const end_date = new Date(this.queryDate[1]).format("yyyy-MM-dd")
      let node = this.queryNode
      if(node === 'all')node = "全部节点"

      let node_name = this.nodeJob.xAxis.data
      let success_data = this.nodeJob.series[0].data

      const ave = parseFloat((success_data.reduce((a,b)=>parseFloat(a)+parseFloat(b),0)/success_data.length).toFixed(2))

      let max = {
        node: node_name[0],
        amount: success_data[0]
      }
      let min = {
        node: node_name[0],
        amount: success_data[0]
      }
      let abnormal_data = []

      success_data.forEach((item,index)=>{
        item = parseFloat(item)
        if(item > max.amount){
          max.node = node_name[index]
          max.amount = item
        }
        if(item < min.amount){
          min.node = node_name[index]
          min.amount = item
        }
        if(item < 90){
          let t = {
            node: node_name[index],
            amount: item
          }
          abnormal_data.push(t)
        }
      })
       let ht = `<div style="color:#30475e;">查询时间：<b>${start_date}</b> 至 <b>${end_date}</b></div>
        <br/>
        <div>查询节点：<b>${node}</b></div>
        <br/>`

        ht+=`<div>平均成功率为：<span style="color:red"><b>${ave} %</b></span></div>
        <br/>
        <div>成功率最高的日期为<span style="color:green"><b>${max.node}</b></span>
        ：<span style="color:green"><b>${max.amount} %</b></span></div>
        <br/>
        <div>成功率最低的日期为<span style="color:red"><b>${min.node}</b></span>
        ：<span style="color:red"><b>${min.amount} %</b></span></div>
        <br/>
        <div>可能需要注意的日期如下（成功率低于90%）：</div>
        `
        abnormal_data.forEach(item=>{
          ht+=`<br/><div><span style="color:red"><b>${item.node}:${item.amount}%</b></span></div>`
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
.top{
  margin-top: 10px;
}
.el-scrollbar__wrap{
  overflow-x: hidden;
}
.echarts {
    width: 100%;
    height: 600px;
}
</style>