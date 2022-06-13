<!-- 数据统计-->
<template>
  <section>
    <DatePicker @getDate="getDate"></DatePicker>
    <el-row class="top">
      <el-col :span="9" :offset="1" v-loading="loading1" element-loading-text="正在获取">
       <!-- 饼状图 任务节点分布-->
        <chart  ref="taskNodeDis" :options="taskNodeDis" :auto-resize="true"></chart>
      </el-col>
      <el-col :span="9" :offset="1" v-loading="loading2" element-loading-text="正在获取">
          <!-- 柱状图显示 任务量统计 -->
          <chart ref="taskSta" :options="taskSta" :auto-resize="true"></chart>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="9" :offset="1" v-loading="loading3" element-loading-text="正在获取">
        <!-- 横向柱状图  任务阶段统计 -->
        <chart ref="taskPhaseSta" :options="taskPhaseSta" :auto-resize="true"></chart>
      </el-col>
      <el-col :span="9" :offset="1" v-loading="loading4" element-loading-text="正在获取">
        <!-- 圆环图  卫星分布统计 -->
        <chart ref="satelliteDisSta" :options="satelliteDisSta" :auto-resize="true"></chart>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import DatePicker from '@/components/dateTab/DatePickerSmall.vue'
import {sayMsg,data} from './getData.js'
export default {
  name:"dataStatistics",
  props:{
    //标记当前的查询状态：SUCCEEDED、FAILED
    flage:String
  },
  data () {
    return {
      taskNodeDis:{},
      taskSta:{},
      taskPhaseSta:{},
      satelliteDisSta:{},
      //查询时间
      queryDate: [],
      //控制加载中显示
      loading1: true,
      loading2: true,
      loading3: true,
      loading4: true
    }
  },
  methods: {
    getDate(dateValue){
      if(dateValue!=null && dateValue.length == 2){
        //将结束时间修改为查询区间末尾一天的时结束时间 23:59
          this.queryDate[0] = dateValue[0];
          this.queryDate[1] = dateValue[1]+24*60*60*1000-1;
      }else{
        //设置为默认的查询时间
        this.setDefaultDate();
      }


      //得到日期查询数据
      var test = sayMsg(this.queryDate)
      this.taskNodeDis = data[0]
      this.taskSta = data[1]
      this.taskPhaseSta = data[2]
      this.satelliteDisSta = data[3]

      console.log(this.queryDate);
      //获取任务节点分布数据
      this.getTaskNodeData(this.queryDate)
      //获取任务量数据
      this.getTaskStaData(this.queryDate)
      //获取任务阶段统计数据
      this.taskPhaseStaData(this.queryDate)
      //获取按照卫星名统计的数据
      this.satelliteDisStaData(this.queryDate)

      this.$refs.taskNodeDis.mergeOptions(this.taskNodeDis)
      this.$refs.taskSta.mergeOptions(this.taskSta)
      this.$refs.taskPhaseSta.mergeOptions(this.taskPhaseSta)
      this.$refs.satelliteDisSta.mergeOptions(this.satelliteDisSta)
    },
    //获取任务节点分布数据
    async getTaskNodeData(time){
      //加载中
      this.loading1 = true;
      const startTime = time[0];
      const endTime = time[1];
      const {data:result} = await this.$http.get('SuccessStatic/taskNodeData?status='+this.flage+'&startTime='+startTime+'&endTime='+endTime);
      console.log(result);
      this.taskNodeDis.series[0].data = result;

      //取消加载中
      this.loading1 = false;
    },
    //获取任务量的数据
    async getTaskStaData(time){
      //加载中
      this.loading2 = true;
      const startTime = time[0];
      const endTime = time[1];
      const {data:result} = await this.$http.get('SuccessStatic/taskStaData?status='+this.flage+'&startTime='+startTime+'&endTime='+endTime);
      console.log(result);
      var taskStaDataArr = [];
      var taskStaDataXData = [];
      for (var i = 0; i < result.length; i++) {
        var element = result[i];
        taskStaDataArr.push(element.amount);
        taskStaDataXData.push(element.day);
      }
      this.taskSta.xAxis[0].data = taskStaDataXData;
      this.taskSta.series[0].data = taskStaDataArr;
      //取消加载中
      this.loading2 = false;

    },
    //获取任务阶段统计数据
    async taskPhaseStaData(time){
      //加载中
      this.loading3 = true;
      const startTime = time[0];
      const endTime = time[1];
      const {data:result} = await this.$http.get('SuccessStatic/taskPhaseStaData?status='+this.flage+'&startTime='+startTime+'&endTime='+endTime);
      console.log(result);
      var taskPhaseStaYData = [];
      var taskPhaseStaDataArr = [];
      for(let i=0;i<result.length;i++){
        var element = result[i];
        taskPhaseStaDataArr.push(element.amount);
        taskPhaseStaYData.push(element.step_name);
      }
      this.taskPhaseSta.yAxis.data = taskPhaseStaYData;
      this.taskPhaseSta.series[0].data = taskPhaseStaDataArr;

      //取消加载中
      this.loading3 = false;
    },
    //获取按照卫星名统计的数据
    async satelliteDisStaData(time){
      //加载中
      this.loading4 = true;
      const startTime = time[0];
      const endTime = time[1];
      const {data:result} = await this.$http.get('SuccessStatic/satelliteDisStaData?status='+this.flage+'&startTime='+startTime+'&endTime='+endTime);
      console.log(result);
      this.satelliteDisSta.series[0].data = result;

      //取消加载中
      this.loading4 = false;
    },
    //设置默认时间一周
    setDefaultDate(){
      //默认查询为当前一周
      //获取当天结束时间的时间（23:59）
      var nowDayEnd = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)
      //查询时间终止时间
      var endTimeStamp = Date.parse(nowDayEnd)
      //查询起始时间：终止时间前推七天(00:00)
      var startTimeStamp = Date.parse(new Date(nowDayEnd.getTime()-7*24*60*60*1000+1))

      // this.queryDate = [startTimeStamp,endTimeStamp];
            this.queryDate = [1612108800000, 1612713600000+ 24 * 60 * 60 * 1000 - 1];
    }
  },
  components: {
    DatePicker
  },
  mounted () {
    /* var timestamp = Date.parse(new  Date());
      this.getDate([timestamp,timestamp]); */
      //设置默认时间
      this.setDefaultDate();

      //查询数据
      this.getDate(this.queryDate)
  },
  watch:{
   
  }
}
</script>

<style lang="scss" scoped>
.top{
  margin-top: 30px;
  height: 330px;
}

.echarts {
  width: 100%;
  height: 300px;
}
.el-scrollbar__wrap{
  overflow-x: hidden;
}
</style>
