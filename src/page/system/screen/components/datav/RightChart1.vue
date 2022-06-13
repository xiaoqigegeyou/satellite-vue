<template>
  <div class="right-chart-1">
    <!-- <div class="rc1-chart-container"> -->
    <!-- <div class="rc1-header">现金流量表</div>

      <div class="left">
        <div class="number">0000.00</div>
        <div>期末现金流</div>
      </div> -->
    <div class="rc1-header">Application数量统计</div>
    <!-- <dv-capsule-chart class="right" :config="config" /> -->
    <chart id='applicationChart' class="right" ref="applicationChart" :options="option"></chart>
  </div>
  <!-- </div> -->
</template>

<script>
// import "echarts";
import { autoHover ,clearLoop } from '@/utils/autoTool';
export default {
  name: "RightChart1",
  data() {
    return {
      option: {},
      tootipTimer:0,
    };
  },
  created() {
    this.getData();
  },
  mounted() {
      this.$nextTick(() => {
      setInterval(this.getData, 60000*1.3);
    });
  },
  methods: {
    async getData() {
      const { data: result } = await this.$http.get("charts/cluslist");
      this.echarts_1(result);
      console.log("右一刷新");
    },
 
    echarts_1(data) {
      // console.log(data);
      let killedList = [];
      let failedList = [];
      let pendingList = [];
      let runningList = [];
      let x_name = [];

      data.forEach(function (app) {
        let date = new Date(app.createdAt).format("h:mm");
        // console.log(date);
      
         
        x_name.push(date);
        killedList.push(app.appsKilled);
        failedList.push(app.appsFailed);
        pendingList.push(app.appsPending);
        runningList.push(app.appsRunning);
      });
    
      var option = {
        color: ["#3de7c9","#469f4b", "#FFBF00","#ff6600","#FF0087"],
        textStyle: {
          color: "#fff",
        },
        tooltip: {
          trigger: "axis",
      axisPointer: { type: 'shadow' },
     
        },
        legend: {
          data: ["正在运行", "等待","失败","杀死",],
           left: "50%",
          textStyle: {
            color: "#fff",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: x_name,
            axisLine: {
              show: true,
              lineStyle: {
                color: "rgba(255,255,255,.6)",
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "个数",
            nameTextStyle: {
              color: "rgba(255,255,255,.6)",
            },
          },
        ],
        series: [
          {
            name: "正在运行",
            type: "line",
            stack: "总量",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
                      color: {
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [{
                offset: 0, color: '#3de7c9' // 0% 处的颜色
            }, {
                offset: 1, color: '#469f4b' // 100% 处的颜色
            }],
            global: false // 缺省为 false
        }
              
            },
            emphasis: {
              focus: "series",
            },
            data: runningList,
          },
          
             {
            name: "等待",
            type: "line",
            stack: "总量",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            label: {
              show: true,
              position: "top",
            },
            areaStyle: {
              opacity: 0.8,
                       color: {
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [{
                offset: 0, color: '#469f4b' // 0% 处的颜色
            }, {
                offset: 1, color: '#FFBF00' // 100% 处的颜色
            }],
            global: false // 缺省为 false
        }
            },
            emphasis: {
              focus: "series",
            },
            data: pendingList,
          },
          {
            name: "失败",
            type: "line",
            stack: "总量",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
                        color: {
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [{
                offset: 0, color: '#FFBF00' // 0% 处的颜色
            }, {
                offset: 1, color: '#ff6600' // 100% 处的颜色
            }],
            global: false // 缺省为 false
        }
            },
            emphasis: {
              focus: "series",
            },
            data: failedList,
          },
          {
            name: "杀死",
            type: "line",
            stack: "总量",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
                        color: {
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [{
                offset: 0, color: '#ff6600' // 0% 处的颜色
            }, {
                offset: 1, color: '#FF0087' // 100% 处的颜色
            }],
            global: false // 缺省为 false
        }
            },
            emphasis: {
              focus: "series",
            },
            data: killedList,
          },
       
        ],
      };
       
    let myChart = this.$echarts.init(document.getElementById('applicationChart'))
    myChart.setOption(option, true);
      this.tootipTimer && this.tootipTimer.clearLoop(); // this.tootipTimer 在data里定义
      this.tootipTimer = 0;
      this.tootipTimer = autoHover(myChart, option, 34, 3000);
 
    },
   
  },
};
</script>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
}
.right-chart-1 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .rc1-header {
    font-size: 20px;
    font-weight: bold;
    height: 20px;
    line-height: 70px;
    margin-left: 20px;
  }

  .rc1-chart-container {
    // flex: 1;
    display: flex;
    flex-direction: column;
  }
  .right {
    flex: 1;
    display: flex;
    width: 98%;
    height: 90%;
    top: 3%;
    left: 5%;

    padding-bottom: 20px;
    padding-right: 20px;
    box-sizing: border-box;
    flex-direction: column;
  }
  .left {
    width: 30%;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .number {
      font-size: 28px;
      color: #096dd9;
      font-weight: bold;
      margin-bottom: 30px;
    }
  }
}
</style>
