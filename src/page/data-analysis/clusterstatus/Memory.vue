<template>
  <div>
    <el-row>
      <el-col>
        <Picker
          @getDate="handleClickSearch"
          @handleSeeReport="handleSeeReport"
        ></Picker>
      </el-col>
    </el-row>
    <el-card>
      <el-row>
        <el-col>
          <div class="block">
            <chart
              ref="memoryChart"
              :options="memoryChartData"
              :auto-resize="true"
              v-loading="loading1"
              theme="macarons"
            ></chart>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- 侧边抽屉分析报告 -->
    <Report
      :title="report_title"
      :content="report_content"
      :drawer_visible="report_visible"
      @updateReportVisable="updateReportVisable"
    ></Report>
  </div>
</template>
<style scoped>
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
<script>
import "echarts/lib/chart/line";
import "echarts/lib/component/dataZoom";
import Picker from "../components/DataPickerIndex";
import Report from "../components/Report";
export default {
  data() {
    return {
      // 侧边报告需要的数据
      report_title: "分析报告",
      report_content: "",
      report_visible: false,
      queryDate: "",
      loading1: false,
      loading2: false,
      memoryChartData: {
        title: {
          text: "集群内存&虚拟核占用",
          left: "center",
        },
        grid: {
          left: "3%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["内存占用", "虚拟核占用"],
          left: "right",
        },
        xAxis: {
          name: "日期",
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        },
        yAxis: {
          name: "占用（%）",
          type: "value",
          axisLabel: {
            formatter: "{value} %",
          },
        },
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 100,
          },
          {
            type: "inside",
            start: 0,
            end: 100,
          },
          {
            show: true,
            yAxisIndex: 0,
            filterMode: "empty",
            width: 30,
            height: "80%",
            showDataShadow: false,
            left: "93%",
          },
        ],
        series: [
          {
            name: "内存占用",
            type: "line",
            // stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210],

            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }],
            },
          },
          {
            name: "虚拟核占用",
            type: "line",
            // stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210],
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }],
            },
          },
        ],
      },
      virtualCoreChartData: {
        title: {
          text: "集群虚拟核占用",
          left: "center",
        },
        grid: {
          left: "3%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          name: "日期",
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        },
        yAxis: {
          name: "虚拟核占用（%）",
          type: "value",
        },
        dataZoom: [
          {
            show: true,
            start: 0,
            end: 100,
          },
          {
            type: "inside",
            start: 0,
            end: 100,
          },
          {
            show: true,
            yAxisIndex: 0,
            filterMode: "empty",
            width: 30,
            height: "80%",
            showDataShadow: false,
            left: "93%",
          },
        ],
        series: [
          {
            name: "虚拟核占用",
            type: "line",
            stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210],
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }],
            },
          },
        ],
      },
    };
  },
  components: {
    Picker,
    Report,
  },
  mounted() {
    this.setDefaultDate();
    this.getMemoryChartData();
    this.getVirtualCoreChartData();
  },
  methods: {
    handleClickSearch(dateValue) {
      if (dateValue != null && dateValue.length == 2) {
        /* dateValue[1] = dateValue[1]+24*60*60*1000-1;
                this.queryDate = dateValue; */
        this.queryDate[0] = dateValue[0];
        this.queryDate[1] = dateValue[1] + 24 * 60 * 60 * 1000 - 1;
      } else {
        //设置为默认的查询时间
        this.setDefaultDate();
      }
      this.getMemoryChartData();
      this.getVirtualCoreChartData();
    },
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
      // this.queryDate = [startTimeStamp, endTimeStamp];
       this.queryDate = [1612108800000, 1612713600000+ 24 * 60 * 60 * 1000 - 1];
  
    },
    async getMemoryChartData() {
      this.loading1 = true;
      const params = {
        startTime: this.queryDate[0],
        endTime: this.queryDate[1],
      };

      const { data: result } = await this.$http.get(
        "clusterStatus/applicationChart",
        { params }
      );
      console.log(result);
      let x_data = [];
      let ser_data = [];
      result.forEach((v) => {
        x_data.push(v.createdAt);
        if (v.memoryTotal == 0) {
          ser_data.push(0);
        } else {
          ser_data.push(
            parseFloat((v.memoryAllocated / v.memoryTotal) * 100).toFixed(2)
          );
        }
      });

      this.memoryChartData.xAxis.data = x_data;
      this.memoryChartData.series[0].data = ser_data;

      this.loading1 = false;

      // 预测
      this.getMemoryForecastData();
    },
    async getVirtualCoreChartData() {
      this.loading2 = true;
      const params = {
        startTime: this.queryDate[0],
        endTime: this.queryDate[1],
      };

      const { data: result } = await this.$http.get(
        "clusterStatus/applicationChart",
        { params }
      );
      console.log(result);
      let x_data = [];
      let ser_data = [];
      result.forEach((v) => {
        x_data.push(v.createdAt);
        if (v.vcoreTotal == 0) {
          ser_data.push(0);
        } else {
          ser_data.push(
            parseFloat((v.vcoreAllocated / v.vcoreTotal) * 100).toFixed(2)
          );
        }
      });

      this.memoryChartData.xAxis.data = x_data;
      this.memoryChartData.series[1].data = ser_data;
      this.loading2 = false;

      this.getVirtualCoreForecastData();
    },
    // 点击查看分析报告按钮
    handleSeeReport() {
      // 数据
      const memory_data = this.memoryChartData.series[0].data;
      const virtual_data = this.memoryChartData.series[1].data;
      const memory_time = this.memoryChartData.xAxis.data;
      const virtual_time = this.memoryChartData.xAxis.data;

      let memory_index = [];
      let memory_95_index = [];
      let virtual_index = [];
      let virtual_95_index = [];

      console.log(this.memoryChartData);
      const memory_ave = parseFloat(
        (
          memory_data.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) /
          memory_data.length
        ).toFixed(2)
      );
      const virtual_ave = parseFloat(
        (
          virtual_data.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) /
          virtual_data.length
        ).toFixed(2)
      );

      memory_data.forEach((item, index) => {
        if (item > 90) memory_index.push(index);
        if (item > 95) memory_95_index.push(index);
      });
      virtual_data.forEach((item, index) => {
        if (item > 90) virtual_index.push(index);
        if (item > 95) virtual_95_index.push(index);
      });

      let memory_set = new Set();
      let memory_95_set = new Set();
      let virtual_set = new Set();
      let virtual_95_set = new Set();

      memory_index.forEach((item) =>
        memory_set.add(memory_time[item].split(" ")[0])
      );
      memory_95_index.forEach((item) =>
        memory_95_set.add(memory_time[item].split(" ")[0])
      );
      virtual_index.forEach((item) =>
        virtual_set.add(virtual_time[item].split(" ")[0])
      );
      virtual_95_index.forEach((item) =>
        virtual_95_set.add(virtual_time[item].split(" ")[0])
      );

      const start_date = new Date(this.queryDate[0]).format("yyyy-MM-dd");
      const end_date = new Date(this.queryDate[1]).format("yyyy-MM-dd");

      let ht = `<div style="color:#30475e;">查询时间：<b>${start_date}</b> 至 <b>${end_date}</b></div>
            <br/>
            <div>集群平均内存占用为：<span style="color:red;"><b>${memory_ave}</b> %<span></div>
            <br/>
            <div>内存占用率超过<span style="color:#ffa62b;"><b>90%</b></span>的日期有如下：</div>`;
      memory_set.forEach((item) => {
        ht += `<span style="color:#ffa62b;"><b>${item}</b>,  </span>`;
      });
      ht += `</br></br><div>其中内存占用率超过<span style="color:#e40017;"><b>95%</b></span>的日期有：</div>`;
      memory_95_set.forEach((item) => {
        ht += `<span style="color:#e40017;"><b>${item}</b>,  </span>`;
      });

      ht += "</br></br>";

      ht += `<div>集群平均虚拟内核占用为：<span style="color:red;"><b>${virtual_ave}</b> %<span></div>
            <br/>
            <div>虚拟内核占用率超过<span style="color:#ffa62b;"><b>90%</b></span>的日期有如下：</div>
            <br/>`;
      virtual_set.forEach((item) => {
        ht += `<span style="color:#ffa62b;"><b>${item}</b>,  </span>`;
      });

      ht += `<br/><br/><div>其中虚拟内核占用率超过<span style="color:#e40017;"><b>95%</b></span>的日期有：</div>`;

      virtual_95_set.forEach((item) => {
        ht += `<span style="color:#e40017;"><b>${item}</b>,  </span>`;
      });

      this.report_content = ht;

      // 显示抽屉
      this.report_visible = true;
    },
    // 分析报告是否显示状态发生改变时触发
    updateReportVisable(status) {
      this.report_visible = status;
    },
    async getMemoryForecastData() {
      let list = [];
      for (let i = 0; i < this.memoryChartData.xAxis.data.length; i++) {
        const item = {
          day: this.memoryChartData.xAxis.data[i],
          amount: this.memoryChartData.series[0].data[i],
        };
        list.push(item);
      }

      const params = {
        list,
        //days: 20
      };

      const { data: result } = await this.$http.post(
        "clusterStatus/MemoryForecast",
        list
      );

      console.log(result);

      let x_data = [];
      let ser_data = [];
      result.forEach((v) => {
        x_data.push(v.day);
        ser_data.push(parseFloat(v.amount).toFixed(2));
      });

      this.memoryChartData.xAxis.data = x_data;
      this.memoryChartData.series[0].data = ser_data;
    },
    async getVirtualCoreForecastData() {
      let list = [];
      for (let i = 0; i < this.memoryChartData.xAxis.data.length; i++) {
        const item = {
          day: this.memoryChartData.xAxis.data[i],
          amount: this.memoryChartData.series[1].data[i],
        };
        list.push(item);
      }
      const { data: result } = await this.$http.post(
        "clusterStatus/VirtualCoreForecast",
        list
      );
      console.log(result);
      let x_data = [];
      let ser_data = [];
      result.forEach((v) => {
        x_data.push(v.day);
        ser_data.push(parseFloat(v.amount).toFixed(2));
      });
      this.memoryChartData.xAxis.data = x_data;
      // this.virtualCoreChartData.series[0].data = ser_data;
      this.memoryChartData.series[1].data = ser_data;
    },
  },
};
</script>