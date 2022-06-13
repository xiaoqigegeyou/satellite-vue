<template>
  <div>
    <el-row>
      <el-col v-loading="loading1">
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
              ref="applicationChart"
              :options="applicationChartData"
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
import Picker from "../components/DataPickerIndex";
import echarts from "echarts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/bar";
import "echarts/lib/component/dataZoom";
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
      applicationChartData: {
        title: {
          text: "Application任务",
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
          data: [],
        },
        yAxis: {
          name: "数量",
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
            name: "失败数量",
            type: "line",
            stack: "总量",
            data: [],
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
            // markLine: {
            //   data: [{ type: "average", name: "平均值" }],
            // },
          },
          {
            name: "被杀死数量",
            type: "line",
            stack: "总量",
            data: [],
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
            // markLine: {
            //   data: [{ type: "average", name: "平均值" }],
            // },
          },
          {
            name: "等待数量",
            type: "line",
            stack: "总量",
            data: [],
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
            // markLine: {
            //   data: [{ type: "average", name: "平均值" }],
            // },
          },
          {
            name: "正在运行数量",
            type: "line",
            stack: "总量",
            data: [],
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
            // markLine: {
           
            //   label:{ formatter:function(value){ return  value.toFixed(0)}}, 
            //   data: [{ type: "average", name: "平均值" }],
            // },
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
    this.getApplicationChartData();
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
      this.getApplicationChartData();
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
      //   this.queryDate = [startTimeStamp, endTimeStamp];
      this.queryDate = [1612108800000, 1612713600000 + 24 * 60 * 60 * 1000 - 1];
    },
    async getApplicationChartData() {
      this.loading1 = true;
      const params = {
        startTime: this.queryDate[0],
        endTime: this.queryDate[1],
      };

      const { data: result } = await this.$http.get(
        "clusterStatus/applicationChart",
        { params }
      );
      //console.log(result);
      let x_data = [];
      let fail_data = [];
      let killed_data = [];
      let wait_data = [];
      let run_data = [];

      result.forEach((v) => {
        x_data.push(v.createdAt);
        fail_data.push(v.appsFailed);
        killed_data.push(v.appsKilled);
        wait_data.push(v.appsPending);
        run_data.push(v.appsRunning);
      });
      this.applicationChartData.xAxis.data = x_data;
      this.applicationChartData.series[0].data = fail_data;
      this.applicationChartData.series[1].data = killed_data;
      this.applicationChartData.series[2].data = wait_data;
      this.applicationChartData.series[3].data = run_data;

      this.loading1 = false;

      this.getAppForecastData();
    },
    async getAppForecastData() {
      let Runlist = [];
      let Waitlist = [];
      let Killlist = [];
      let Faillist = [];
      for (let i = 0; i < this.applicationChartData.xAxis.data.length; i++) {
        const item1 = {
          day: this.applicationChartData.xAxis.data[i],
          amount: this.applicationChartData.series[3].data[i],
        };
        Runlist.push(item1);
        const item2 = {
          day: this.applicationChartData.xAxis.data[i],
          amount: this.applicationChartData.series[2].data[i],
        };
        Waitlist.push(item2);
        const item3 = {
          day: this.applicationChartData.xAxis.data[i],
          amount: this.applicationChartData.series[1].data[i],
        };
        Killlist.push(item3);
        const item4 = {
          day: this.applicationChartData.xAxis.data[i],
          amount: this.applicationChartData.series[0].data[i],
        };
        Faillist.push(item4);
      }
      //   运行
      const { data: result } = await this.$http.post(
        "clusterStatus/AppRunForecast",
        Runlist
      );
      console.log(result);
      let x_data = [];
      let ser_data = [];
      result.forEach((v) => {
        x_data.push(v.day);
        ser_data.push(parseFloat(v.amount).toFixed(0));
      });
      this.applicationChartData.xAxis.data = x_data;

      this.applicationChartData.series[3].data = ser_data;
      // 等待
      const { data: result2 } = await this.$http.post(
        "clusterStatus/AppPendForecast",
        Waitlist
      );
      console.log(result2);
      x_data = [];
      ser_data = [];
      result2.forEach((v) => {
        x_data.push(v.day);
        ser_data.push(parseFloat(v.amount).toFixed(0));
      });

      this.applicationChartData.series[2].data = ser_data;
      // 杀死
      const { data: result3 } = await this.$http.post(
        "clusterStatus/AppKillForecast",
        Killlist
      );
      console.log(result3);
      x_data = [];
      ser_data = [];
      result3.forEach((v) => {
        x_data.push(v.day);
        ser_data.push(parseFloat(v.amount).toFixed(0));
      });

      this.applicationChartData.series[1].data = ser_data;
      // 失败
      const { data: result4 } = await this.$http.post(
        "clusterStatus/AppFailForecast",
        Faillist
      );
      console.log(result4);
      x_data = [];
      ser_data = [];
      result4.forEach((v) => {
        x_data.push(v.day);
        ser_data.push(parseFloat(v.amount).toFixed(0));
      });

      this.applicationChartData.series[0].data = ser_data;
    },
    // 点击查看分析报告按钮
    handleSeeReport() {
      const time = this.applicationChartData.xAxis.data;
      const fail_data = this.applicationChartData.series[0].data;
      const killed_data = this.applicationChartData.series[1].data;
      const wait_data = this.applicationChartData.series[2].data;
      const run_data = this.applicationChartData.series[3].data;
      // 求出各个数组的均值

      console.log(run_data);
      const fail_ave = parseFloat(
        (
          fail_data.reduce((a, b) => parseFloat(a) + parseFloat(b)) /
          fail_data.length
        ).toFixed(0)
      );
      const killed_ave = parseFloat(
        (
          killed_data.reduce((a, b) => parseFloat(a) + parseFloat(b)) /
          killed_data.length
        ).toFixed(0)
      );
      const wait_ave = parseFloat(
        (
          wait_data.reduce((a, b) => parseFloat(a) + parseFloat(b)) /
          wait_data.length
        ).toFixed(0)
      );
      const run_ave = parseFloat(
        (
          run_data.reduce((a, b) => parseFloat(a) + parseFloat(b)) /
          run_data.length
        ).toFixed(0)
      );

      console.log(fail_ave);

      console.log(wait_ave);

      console.log(killed_ave);

      console.log(run_ave);
      // 存放超过标准值的数组
      let fail_index_data = [];
      let killed_index_data = [];
      let wait_index_data = [];
      let run_index_data = [];
      // 记录超过均值5倍的索引
      fail_data.forEach((item, index) => {
        if (item >= fail_ave * 5) fail_index_data.push(index);
      });
      killed_data.forEach((item, index) => {
        if (item >= killed_ave * 5) killed_index_data.push(index);
      });
      wait_data.forEach((item, index) => {
        if (item >= wait_ave * 5) wait_index_data.push(index);
      });
      run_data.forEach((item, index) => {
        if (item >= run_ave * 5) run_index_data.push(index);
      });
      // 数据量太多，只取超过的日期 精确到天
      let fail_set = new Set();
      let killed_set = new Set();
      let wait_set = new Set();
      let run_set = new Set();

      fail_index_data.forEach((item) => fail_set.add(time[item].split(" ")[0]));
      killed_index_data.forEach((item) =>
        killed_set.add(time[item].split(" ")[0])
      );
      wait_index_data.forEach((item) => wait_set.add(time[item].split(" ")[0]));
      run_index_data.forEach((item) => run_set.add(time[item].split(" ")[0]));

      const start_date = new Date(this.queryDate[0]).format("yyyy-MM-dd");
      const end_date = new Date(this.queryDate[1]).format("yyyy-MM-dd");

      let ht = `<div style="color:#30475e;">查询时间：<b>${start_date}</b> 至 <b>${end_date}</b></div>
            <br/>
            <div><b>失败任务</b></div>
            <br/>
            <div>平均值：${fail_ave}</div>
            <div>需注意的日期（超出均值5倍）：
            `;
      if (fail_ave != 0) {
        for (let item of fail_set) {
          ht += `<span style="color:#ffa62b;"><b>${item}</b>,  </span>`;
        }
      }
      ht += `</div>`;

      ht += `<br/>
            <div><b>被杀死任务</b></div>
            <br/>
            <div>平均值：${killed_ave}</div>
            <div>需注意的日期（超出均值5倍）：`;
      for (let item of killed_set) {
        ht += `<span style="color:#ffa62b;"><b>${item}</b>,  </span>`;
      }
      ht += `</div>`;

      ht += `<br/>
            <div style="color:red"><b>等待任务(⭐)</b></div>
            <br/>
            <div>平均值：${wait_ave}</div>
            <div>需注意的日期（超出均值5倍）：`;
      for (let item of wait_set) {
        ht += `<span style="color:#ffa62b;"><b>${item}</b>,  </span>`;
      }
      ht += `</div>`;

      ht += `<br/>
            <div style="color:red"><b>正在运行任务(⭐)</b></div>
            <br/>
            <div>平均值：${run_ave}</div>
            <div>需注意的日期（超出均值5倍）：`;
      for (let item of wait_set) {
        ht += `<span style="color:#ffa62b;"><b>${item}</b>,  </span>`;
      }
      ht += `</div>`;

      ht += `<br/><br/><div style="color:red;font-size:small;">注意：<br/>
            1.平均值为0时，超出均值5倍的数据没有参考价值！<br/>
            2.失败任务和被杀死任务数据量较少，参考价值不高！<br/>
            3.针对人工确定需要注意的日期可以进一步查询集群的内存、虚拟内核等数据进一步判断！<br/><br/></div>`;

      this.report_content = ht;
      // 显示抽屉
      this.report_visible = true;
    },
    // 分析报告是否显示状态发生改变时触发
    updateReportVisable(status) {
      this.report_visible = status;
    },
  },
};
</script>