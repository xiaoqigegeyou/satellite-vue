<template>
  <div class="right-chart-2">
    <div class="rc1-header">集群信息</div>

    <div class="rc1-chart-container">
      <div class="left">
        <div class="number" :class="status ? 'animate' : ''" v-show="status">{{ avgcpu }} %</div>
        <div :class="status ? 'animate' : ''" v-show="status">{{cpuText}}</div>
        <div class="number" :class="!status ? 'animate' : ''" v-show="!status">{{ avgmemory }} %</div>
        <div :class="!status ? 'animate' : ''" v-show="!status">{{memoryText}}</div>
 
      </div>

      <dv-charts id="cluslistechart" class="right" :option="option" />
    </div>
  </div>
</template>

<script>
export default {
  name: "RightChart2",
  data() {
    return {
      option: {},
      avgcpu: 0.0,
      avgmemory: 0.0,
      memoryText:'内存平均占用率',
      cpuText:'CPU平均占用率',
      status: false,
    };
  },
  created() {
    this.getData();
    
  },
  mounted() {
    this.$nextTick(() => {
      setInterval(this.getData, 60000*2);
    });
   this.textSwicth()
  },
  methods: {
    textSwicth() {
      setInterval(() => {
        this.status = !this.status
      }, 6000)
    },
    async getData() {
      const { data: result } = await this.$http.get("charts/cluslist");
      this.echarts_4(result);
      console.log("右二刷新");
    },
    echarts_4(data) {
      //处理数据
      var cpu_data = [];
      var memory_data = [];
      var x_data = [];
      var avgcpu = 0;
      var avgmemory = 0;
      for (var i = 0; i < data.length; i++) {
        let date = new Date(data[i].createdAt).format("h:mm");
        x_data.push(date);
         avgcpu += ((data[i].vcoreTotal - data[i].vcoreAvailable) / data[i].vcoreTotal) *
            100;
        
        avgmemory +=  ((data[i].memoryTotal - data[i].memoryAvailable) /
            data[i].memoryTotal) *
            100;
        var cpu = parseFloat(
          ((data[i].vcoreTotal - data[i].vcoreAvailable) / data[i].vcoreTotal) *
            100
        ).toFixed(2);
        var memory = parseFloat(
          ((data[i].memoryTotal - data[i].memoryAvailable) /
            data[i].memoryTotal) *
            100
        ).toFixed(2);
       
        cpu_data.push(cpu);
        memory_data.push(memory);
      }
      this.avgcpu =parseFloat(avgcpu / data.length).toFixed(2); 
  
      this.avgmemory =parseFloat( avgmemory / data.length).toFixed(2); 

      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(
        document.getElementById("cluslistechart")
      );

      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#dddc6b",
            },
          },
        },
        legend: {
          top: "0%",
          left:"50%",
          data: ["虚拟核", "内存"],
          textStyle: {
            color: "#fff",
            fontSize: "12",
          },
        },
        grid: {
          left: "10",
          top: "30",
          right: "10",
          bottom: "10",
          containLabel: true,
        },

        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLabel: {
              textStyle: {
                color: "#fff",
                fontSize: 12,
              },
            },
            axisLine: {
              lineStyle: {
                color: "#fff",
              },
            },

            data: x_data,
          },
          {
            axisPointer: { show: false },
            axisLine: { show: false },
            position: "bottom",
            offset: 20,
          },
        ],

        yAxis: [
          {
            name: "占用率",
            nameTextStyle: {
              color: "#fff",
            },
            type: "value",
            max: 100,
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: "#fff",
              },
            },
            axisLabel: {
              formatter: "{value} %",
              textStyle: {
                color: "#fff",
                fontSize: 12,
              },
            },

            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)",
              },
            },
          },
        ],
        series: [
          {
            name: "虚拟核",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                color: "#0184d5",
                width: 2,
              },
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(1, 132, 213, 0.4)",
                    },
                    {
                      offset: 0.8,
                      color: "rgba(1, 132, 213, 0.1)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
              },
            },
            itemStyle: {
              normal: {
                color: "#0184d5",
                borderColor: "rgba(221, 220, 107, .1)",
                borderWidth: 12,
              },
            },
            data: cpu_data,
          },
          {
            name: "内存",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                color: "#00d887",
                width: 2,
              },
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0, 216, 135, 0.4)",
                    },
                    {
                      offset: 0.8,
                      color: "rgba(0, 216, 135, 0.1)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
              },
            },
            itemStyle: {
              normal: {
                color: "#00d887",
                borderColor: "rgba(221, 220, 107, .1)",
                borderWidth: 12,
              },
            },
            data: memory_data,
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
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
.right-chart-2 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .rc1-header {
    font-size: 24px;
    font-weight: bold;
    height: 30px;
    line-height: 30px;
  }

  .rc1-chart-container {
    flex: 1;
    display: flex;
  }

  .left {
    width: 30%;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .number {
      font-size: 34px;
      color: #096dd9;
      font-weight: bold;
      margin-bottom: 30px;
    }
  }

  .right {
    flex: 1;
    padding-bottom: 20px;
    padding-right: 20px;
    box-sizing: border-box;
  }
}
//淡入淡出动画
.animate {
  animation: myfirst 6s;
}
@keyframes myfirst {
  0% {
    opacity: 0;
  }
    25% {
    opacity: .5;
  }
  50% {
    opacity: .75;
  }
    75% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>