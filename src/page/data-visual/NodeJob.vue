<!-- 节点任务可视化  -->
<template>
  <div>
    <el-row>
      <el-col :span="3">
        <el-aside width="96%"  style="background-color: #fff;height:650px; overflow-x: hidden;">
          <el-menu :default-openeds="['1']" default-active="all" @select="menuSlect">
            <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>集群节点</template>
              <!-- 全部节点 -->
              <el-menu-item index="all">全部节点</el-menu-item>
              <el-menu-item :index="node.domain"  v-for="node in nodeList" :key="node.id">{{node.name}}</el-menu-item>
          </el-submenu>
          </el-menu>
        </el-aside>
      </el-col>
      <el-col :span="20">
        <DatePicker @getDate="getDate"></DatePicker>
        <el-row class="top">
          <div class="block">
              <chart ref="nodeJob" :options="nodeJob" :auto-resize="true" v-loading="loading1"></chart>
          </div>
          <!-- tableData.slice((currentPage-1)*pageSize,currentPage*pageSize) -->
          <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%"
            v-loading="loading2" :default-sort="tableSort" @sort-change="tableSortChangeHandle">
            <el-table-column prop="jobId" label="JobId" width="200px">
            </el-table-column>
            <el-table-column prop="taskID" label="TaskId">
            </el-table-column>
            <el-table-column prop="taskName" label="TaskName">
            </el-table-column>
            <el-table-column prop="node" label="运行节点">
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间" sortable='custom'>
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间" sortable='custom'>
            </el-table-column>
            <el-table-column prop="runTime" label="运行时间(S)" sortable='custom'>
            </el-table-column>
          </el-table>
          <!-- 分页器 -->
          <div class="block" style="margin-top:15px;">
            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[7,15,20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import 'echarts/lib/chart/line'
import DatePicker from '@/components/dateTab/DatePickerSmall.vue'
export default {
  data () {
    const item = {
      jobId: '1546008605570_0010',
      taskID: '色彩评价',
      taskName: '000000',
      node:'gpu11',
      startTime:'2019-10-04 15:45:07.0',
      endTime:'2019-10-04 15:47:37.0',
      runTime:'150.00'
    }
    return {
      tableData: [],
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 7,// 每页的数据条数
      //右侧节点信息列表
      nodeList: [],
      //查询日期
      queryDate: [],
      //当前激活的查询节点，全部为all，其他节点形式为：kj-gpu30.bigdata.com
      queryNode: 'all',
      //图标加载中
      loading1: true,
      //表格加载中
      loading2: true,
      // 步骤数组
      steps: [],
      nodeJob:{
        title: {
          text: "任务数量统计",
          left: "center",
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'line'
        }]
      },
      // 任务表格默认按照结束时间倒序排序
      tableSort: {
        prop: 'startTime',
        order: 'descending'
      }
    }
  },
  methods: {
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

      //点击查找时需要初始化当前页码
      this.currentPage = 1;
      //更新图表
      this.getNodeAmount();
      //更新分页表格
      this.getNodePage();
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.currentPage = 1
      this.pageSize = val
      // 调用后端分页
     //this.getNodePage()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      // 调用后端分页
     //this.getNodePage()
    },
    //设置查询时间为当前一周
    setDefaultDate(){
      //默认查询为当前一周
      //获取当天结束时间的时间（23:59）
      var nowDayEnd = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)
      //查询时间终止时间
      var endTimeStamp = Date.parse(nowDayEnd)
      //查询起始时间：终止时间前推七天(00:00)
      var startTimeStamp = Date.parse(new Date(nowDayEnd.getTime()-7*24*60*60*1000+1))

      //当前默认的查询日期为一周
      this.queryDate = [startTimeStamp,endTimeStamp];
    },
    //选择节点时触发
    menuSlect(index){
      //console.log(index);
      //更新查询节点
      this.queryNode = index;
      //点击节点时需要初始化当前页码
      this.currentPage = 1;
      //更新图表数据
      this.getNodeAmount();
      //查询表格数据
      this.getNodePage();
    },
    //获取所有的节点信息
    async getAllNodeList(){
      const {data:result} = await this.$http.get('NodeJob/allNode');
      //console.log(result);
      this.nodeList = result;
    },
    //查询任务量的每日统计，用于图表展示
    async getNodeAmount(){
      this.loading1 = true;
      const params = {
        startTime : this.queryDate[0],
        endTime : this.queryDate[1],
      }
      if(this.queryNode !== 'all'){
          params.node = this.queryNode;
      }
      
      const {data:result} = await this.$http.get('NodeJob/JobAmount',{params});
      console.log(result);//[ RowDataPacket { day: '2018-12-29', amount: 3115 } ]
      let xAxisData = [];
      let seriesData = [];
      for(let i=0;i<result.length;i++){
        xAxisData.push(result[i].day);
        seriesData.push(result[i].amount);
      }
      this.nodeJob.xAxis.data = xAxisData;
      this.nodeJob.series[0].data = seriesData;

      this.loading1 = false;
    },
    //获取分页表格中的数据 此处使用的实际为前端分页，
    //后端分页性能不理想，并且前端分页更利于排序
    async getNodePage(){
      this.loading2 = true;
      const params = {
        startTime : this.queryDate[0],
        endTime : this.queryDate[1],
        pageNo : this.currentPage,
        pageSize : this.pageSize
      }
      if(this.queryNode !== 'all'){
          params.node = this.queryNode;
      }
      const {data:result} = await this.$http.get('NodeJob/AllNodeJobPage',{params});
      this.total = result.total;
      result.list.forEach(e =>{
        e.taskName = this.getStepName(e.taskName);
        // 修改
        // 时间从ms改为s
        e.runTime = (e.runTime / 1000).toFixed(2);
      });
      console.log(result.list);

      this.tableData =result.list;

      this.loading2 = false;
    },
    // 获取步骤表的数据
    async getSteps(){
      const {data:result} = await this.$http.get('StepConfig/AllStep');
      this.steps = result;
    },
    getStepName(idStr){
        var id = parseInt(idStr);
        for(let i=0;i<this.steps.length;i++){
          if(id === this.steps[i].id){
            return this.steps[i].step_name;
          }
        }
    },
    // 表格中的排序条件发生变化时触发
    // table组件提供的排序功能只能对一页的数据进行排序，实现全排序需要自定义
    tableSortChangeHandle(options){
      // options:{column: {…}, prop: "endTime", order: "descending"}
      console.log(options);
      if(options.prop === 'runTime'){
        if(options.order === 'descending'){
          // 对运行时间列进行倒序排序
          this.tableData.sort((m,n) => parseFloat(n.runTime) - parseFloat(m.runTime))
          return
        }else if(options.order === 'ascending'){
          // 正序排序
          this.tableData.sort((m,n) => parseFloat(m.runTime) - parseFloat(n.runTime))
          return
        }
      }else if(options.prop === 'endTime'){
        // 对结束时间排序
        if(options.order === 'descending'){
          // 倒序
          this.tableData.sort((m,n) => Date.parse(n.endTime) - Date.parse(m.endTime))
          return
        }else if (options.order === 'ascending'){
          // 正序
          this.tableData.sort((m,n) => Date.parse(m.endTime) - Date.parse(n.endTime))
          return
        }
      }else if(options.prop === 'startTime'){
        // 对开始时间排序
        if(options.order === 'descending'){
          // 倒序
          this.tableData.sort((m,n) => Date.parse(n.startTime) - Date.parse(m.startTime))
          return
        }else if (options.order === 'ascending'){
          // 正序
          this.tableData.sort((m,n) => Date.parse(m.startTime) - Date.parse(n.startTime))
          return
        }
      }

      // 不排序 按照jobid
      this.tableData.sort((m,n)=>(''+m.jobId).localeCompare(n.jobId))
    }
  },
  components: {
    // 组件
    DatePicker
  },
  
  mounted(){

    //获取所有的节点配置信息
    this.getAllNodeList();
    //设置默认查询时间
    this.setDefaultDate();
    //获取图表数据
    this.getNodeAmount();
    // 获取全部步骤信息
    this.getSteps();
    //获取分页表格数据
    this.getNodePage();


  }
}
</script>

<style lang="scss" scoped>
// .top{
//   margin-top: 10px;
// }
.el-scrollbar__wrap{
  overflow-x: hidden;
}
.echarts {
        width: 100%;
        height: 300px;
}
</style>
