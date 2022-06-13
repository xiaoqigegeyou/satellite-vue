<template>
  <div class="bottom-charts">
    <div class="bc-chart-item">
      <div class="bcci-header">各节点内存占用</div>
      <!-- <dv-active-ring-chart :config="bottomChartsData.config1" />
      <Label-Tag :config="bottomChartsData.labelConfig1" /> -->
      <chart
        id="nodeChart"
        ref="applicationChart"
        class="dv-active-ring-chart"
        :options="option"
      ></chart>
    </div>
    <dv-decoration-2 class="decoration-1" :reverse="true" style="width: 5px" />

    <div class="bc-chart-item">
      <div class="bcci-header">失败任务分布</div>
      <!-- <dv-active-ring-chart :config="bottomChartsData.config2" />
      <Label-Tag :config="bottomChartsData.labelConfig2" /> -->
      <chart
        id="failChart"
        ref="applicationChart"
        class="dv-active-ring-chart"
        :options="option2"
      ></chart>
    </div>

    <dv-decoration-2 class="decoration-2" :reverse="true" style="width: 5px" />

    <div class="bc-chart-item">
      <div class="bcci-header">容器分配情况</div>
      <dv-active-ring-chart :config="config" />
      <!-- <dv-active-ring-chart :config="bottomChartsData.config3" -->
      <Label-Tag :config="labelConfig" />
    </div>

    <dv-decoration-2 class="decoration-3" :reverse="true" style="width: 5px" />

    <div class="bc-chart-item">
      <div class="bcci-header">节点VCore使用状况</div>
      <chart
        id="nodeVCoreChart"
        ref="applicationChart"
        class="dv-active-ring-chart"
        :options="option3"
      ></chart>
       <Label-Tag :config="labelConfig2" />
      <!-- <Label-Tag :config="bottomChartsData.labelConfig4" /> -->
    </div>
  </div>
</template>

<script>
import LabelTag from "./LabelTag";
import { autoHover ,clearLoop } from '@/utils/autoTool';
export default {
  name: "BottomCharts",
  props: {
    bottomChartsData: Object,
  },
  components: {
    LabelTag,
  },
  data() {
    return {
      option: {},
      option2: {},
      option3: {},
      config: {},
     
      labelConfig: {
        data: ["已分配容器", "预留容器", "待处理容器"],
      },
      labelConfig2:{
         data: ["使用中", "展示节点"],
          colors: [ '#3de7c9',  '#ffc530']
      },
       tootipTimer:0,
    };
  },
  created() {
    this.getData();
    this.getData2();
    this.getData3();
    this.getData4();
  },
  mounted() {
    this.$nextTick(() => {
      setInterval(this.getData, 60000 * 2);
    });
    this.$nextTick(() => {
      setInterval(this.getData2, 60000 * 2);
    });
    this.$nextTick(() => {
      setInterval(this.getData3, 60000 * 2);
    });
    this.$nextTick(() => {
      setInterval(this.getData4, 40000 );
    });
  },
  methods: {
    async getData4() {
      const { data: result } = await this.$http.get("charts/nodes");

      this.echarts_4(result);
      console.log("底四刷新");
    },
    echarts_4(data) {
      console.log(1);
      var used_vcore_data = [];
      var avail_vcore_data = [];
      var x_name = [];
      for (var i = 0; i < data.length; i++) {
        used_vcore_data.push(data[i].usedVcore);
        avail_vcore_data.push(data[i].availableVcote);

        x_name.push(data[i].nodeId.split(".")[0].split("-")[1]);
      }

      var myChart = this.$echarts.init(
        document.getElementById("nodeVCoreChart")
      );

      var option3 = {
        tooltip: {
          show: true,
          trigger: "item",
          formatter: "{b} : <br />{c}",
        },
        angleAxis: {
          splitLine: {
            show: false,
          },
        },
        radiusAxis: {
          type: "category",
          textStyle: {
            color: "#fff",
            // fontSize: "12",
          },
          show: false,
          data: x_name,
          z: 10,
        },
        polar: {},
        series: [
          {
            type: "bar",
            name:"使用中",
            data: used_vcore_data,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#0be7cd" },
                  { offset: 1, color: "#13dcca" },
                ]),
              },
               emphasis: {
            color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#ffc530", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#fff", // 100% 处的颜色
                    },
                  ],
                  false
                ),
        }
            },
            coordinateSystem: "polar",
            name: "A",
            stack: "a",
          },
        ],
        textStyle: {
          color: "black",
        },
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option3);
      this.tootipTimer && this.tootipTimer.clearLoop(); // this.tootipTimer 在data里定义
      this.tootipTimer = 0;
      this.tootipTimer = autoHover(myChart, option3, 10, 4000);
    },
    async getData3() {
      const { data: result } = await this.$http.get("charts/cluster");
      this.echarts_3(result);
      console.log("底三刷新");
    },
    echarts_3(data) {
      this.config = {
        data: [
          {
            name: "已分配容器",
            value: data.containersAllocated,
          },
          {
            name: "预留容器",
            value: data.containersReserved,
          },
          {
            name: "待处理容器",
            value: data.containersPending,
          },
        ],
        color: ["#3de7c9", "#ffc530", "#469f4b"],
        radius: "65%",
        activeRadius: "70%",
      };
    },

    async getData2() {
      const { data: result } = await this.$http.get("charts/fail");
      this.echarts_2(result);
      console.log("底二刷新");
    },
    echarts_2(data) {
      var x_name = [];
      var fail_data = [];
      var nums = 0;
      for (var key in data) {
        var name = key.split(".")[0].split("-")[1];
        x_name.push(name);
        fail_data.push(data[key]);
        nums += data[key];
      }
      // 插入排序 优化
      for (let i = 1; i < x_name.length; i++) {
        let p = x_name[i];
        let p_f = fail_data[i];
        let j = i - 1;

        while (j >= 0 && x_name[j] > p) {
          x_name[j + 1] = x_name[j];
          fail_data[j + 1] = fail_data[j];
          j--;
        }

        x_name[j + 1] = p;
        fail_data[j + 1] = p_f;
      }

      var myChart = this.$echarts.init(document.getElementById("failChart"));

      var option2 = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },

        grid: {
          left: "0%",
          top: "10px",
          right: "0%",
          bottom: "2%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: x_name,
            axisLine: {
              // show: true,
              lineStyle: {
                color: "#fff",
              },
            },

            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
              rotate: 40,
              show: true,
              splitNumber: 15,
              textStyle: {
                color: "#fff",
                fontSize: "12",
              },
            },
          },
        ],
        yAxis: [
          {
            name: "个",
            type: "value",
            axisLabel: {
              //formatter: '{value} %',
              show: true,
              textStyle: {
                color: "#fff",
                fontSize: "12",
              },
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#fff",
                width: 1,
                type: "solid",
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
            type: "bar",
            data: fail_data,
            barWidth: "35%", //柱子宽度
            // barGap: 1, //柱子之间间距
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#469f4b", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#10A7DB", // 100% 处的颜色
                    },
                  ],
                  false
                ),
                barBorderRadius: [30, 30, 0, 0],
                shadowColor: "rgba(0,255,225,1)",
                shadowBlur: 4,
              },
            },
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option2);
    },
    async getData() {
      const { data: result } = await this.$http.get("charts/nodes");
      this.echarts_1(result);
      console.log("底一刷新");
    },
    echarts_1(data) {
      //数据准备
      var memory_data = [];
      //var y_max = data[0].availMemory + data[0].usedMemory;
      var x_name = [];
      for (var i = 0; i < data.length; i++) {
        /*if (data[i].availMemory + data[i].usedMemory > y_max) {
                y_max = data[i].availMemory + data[i].usedMemory;
            }*/ memory_data.push(
          parseFloat(
            (data[i].usedMemory / (data[0].availMemory + data[0].usedMemory)) *
              100
          ).toFixed(0)
        );
        x_name.push(data[i].nodeId.slice(3, 8));
      }

      var myChart = this.$echarts.init(document.getElementById("nodeChart"));

      var option = (option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#dddc6b",
            },
          },
        },
        grid: {
          top: "33%",
          right: "5%",
          left: "12%",
          bottom: "20%",
        },
        xAxis: [
          {
            type: "category",
            color: "#fff",
            data: x_name,
            axisPointer: {
              type: "line",
            },
            axisLine: {
              lineStyle: {
                color: "#fff",
              },
            },
            axisLabel: {
              margin: 20,
              color: "#fff",
              textStyle: {
                fontSize: 12,
              },
            },
          },
        ],
        yAxis: [
          {
            name: "占用率",
            min: 0,
            max: 100,
            axisLine: {
              lineStyle: {
                color: "#fff",
              },
            },
            axisLabel: {
              formatter: "{value}%",
              color: "#fff",
            },
            // axisLine: {
            //     show: false
            // },
            splitLine: {
              lineStyle: {
                color: "#fff",
              },
            },
          },
        ],
        series: [
          {
            type: "bar",
            data: memory_data,
            barWidth: "8px",
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#ffc530", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#10A7DB", // 100% 处的颜色
                    },
                  ],
                  false
                ),
                barBorderRadius: [30, 30, 0, 0],
                shadowColor: "rgba(0,255,225,1)",
                shadowBlur: 4,
              },
            },
            label: {
              normal: {
                show: true,
                lineHeight: 30,
                width: 62,
                height: 30,
                // backgroundColor: '#fff',
                borderRadius: 200,
                position: ["-10", "-70"],
                distance: 1,
                formatter: ["    {d|●}", " {a|{c}%}     \n", "    {b|}"].join(
                  ""
                ),
                rich: {
                  d: {
                    color: "#3CDDCF",
                  },
                  a: {
                    color: "#fff",
                    align: "center",
                  },
                  b: {
                    width: 1,
                    height: 25,
                    borderWidth: 1,
                    borderColor: "#234e6c",
                    align: "left",
                  },
                },
              },
            },
          },
        ],
      });

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
.bottom-charts {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;

  .bc-chart-item {
    width: 25%;
    height: 100%;
    padding-top: 20px;
    box-sizing: border-box;
  }

  .bcci-header {
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
  }

  .dv-active-ring-chart {
    height: calc(~"100% - 80px");
    width: 100%;
  }

  .label-tag {
    height: 30px;
  }

  .active-ring-name {
    font-size: 18px !important;
  }

  .decoration-1,
  .decoration-2,
  .decoration-3 {
    display: absolute;
    left: 0%;
  }
}
</style>
