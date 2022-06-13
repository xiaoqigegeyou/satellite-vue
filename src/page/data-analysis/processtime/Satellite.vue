<template>
  <div>
    <el-row>
    
      <el-col :span="23">
        <DatePicker
          @getDate="getDate"
          @handleSeeReport="handleSeeReport"
        ></DatePicker>
        <el-row class="top">
          <el-col :span="19">
            <div class="block">
              <chart
                id="myChart"
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
            <PocessTimeTable :tableList="tableList"></PocessTimeTable>
            <el-switch
              class="seemode"
              v-if="satelliteName == 'all'"
              v-model="seeMode"
              active-text="卫星总览"
              inactive-text="分卫星查看"
            >
            </el-switch>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 侧边抽屉分析报告 -->
    <Report
      :title="report_title"
      :content="report_content"
      :drawer_visible="report_visible"
      @updateReportVisable="updateReportVisable"
    ></Report>
  </div>
</template>

<script>
import "echarts/lib/chart/bar";
import echarts from "echarts";
import DatePicker from "@/page/data-analysis/components/DatePickerSmallSatellite.vue";
import PocessTimeTable from "../components/ProcessTimeTable.vue";
import Report from "../components/Report";
export default {
  data() {
    return {
      // 侧边报告需要的数据
      report_title: "分析报告",
      report_content: "",
      report_visible: false,
      // 查看模式
      seeMode: true,
      // 右侧表格数据
      tableList: [],
      //左侧节点信息列表
      nodeList: ["kj-gpu01.bigdata.com"],
      //查询日期
      queryDate: [],
      //当前激活的查询节点，全部为all，其他节点形式为：kj-gpu30.bigdata.com
      queryNode: "all",
      // 查询的步骤id
      satelliteName: "all",
      // 是否显示图表加载中
      loading1: false,
      nodeJob: {
        title: {
          text: "任务平均运行时间统计",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [],
          left: "60%",
        },
        xAxis: {
          name: "日期",
          type: "category",
          data: [],
        },
        yAxis: {
          name: "平均运行时间(s)",
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
        series: [],
      },
    };
  },
  mounted() {
    // 设置默认查询时间
    this.setDefaultDate();
    // 获取所有节点列表的信息
    // this.getAllNodeList();
      this.getSatelliteData();
    
  },
  methods: {
    // 点击时间选择器的查找触发的函数
    getDate(dateValue, satelliteName, node) {
      if (dateValue != null && dateValue.length == 2) {
        this.queryDate[0] = dateValue[0];
        this.queryDate[1] = dateValue[1] + 24 * 60 * 60 * 1000 - 1;
      } else {
        //设置为默认的查询时间
        this.setDefaultDate();
      }
      this.satelliteName = satelliteName;
      this.nodeList = node;
      this.getSatelliteData();
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
      // this.queryDate = [startTimeStamp, endTimeStamp];
       this.queryDate = [1612108800000, 1612713600000+ 24 * 60 * 60 * 1000 - 1];
    },
    // 获取省份的平均处理时间的数据
    async getSatelliteData() {
      let myChart = echarts.init(document.getElementById("myChart"));
      this.nodeJob = {
        title: {
          text: "任务平均运行时间统计",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [],
          left: "60%",
        },
        xAxis: {
          name: "日期",
          type: "category",
          data: [],
        },
        yAxis: {
          name: "平均运行时间(s)",
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
        series: [],
      };
      var option = this.nodeJob;
      myChart.clear();
      myChart.setOption(option);
      //this.dateValue = dateValue

      this.tableList = [];

      this.loading1 = true;
      let dataList = [];
      let set = [];
      for (let item of this.nodeList) {
        const params = {
          startTime: this.queryDate[0],
          endTime: this.queryDate[1],
          node: item,
          satelliteName: this.satelliteName,
          seeMode: this.seeMode,
        };

        const { data: result } = await this.$http.get("processTime/satellite", {
          params,
        });

        for (let i = 0; i < result.length; i++) {
          result[i].amount = parseFloat((result[i].amount / 1000).toFixed(1));
          result[i].name = item.slice(3, 8);
          dataList.push(result[i]);
          set.push(result[i].day);
        }
      }
      this.tableList = dataList;
      console.log(this.tableList);
    let setDay1 = new Set(set);

      // console.log(new Set(set));
      let setDay = [];
      for (let item1 of setDay1) {
        setDay.push(item1);
      }
      // 对X轴时间排序
      setDay = setDay.sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      for (let item of this.nodeList) {
        console.log(11);
        let seriesData = [];
        for (let item1 of setDay) {
          var obj = dataList.find(function (obj) {
            return obj.day === item1 && obj.name === item.slice(3, 8);
          });
          if (obj == undefined) {
            seriesData.push(0);
          } else {
            seriesData.push(obj.amount);
          }

          console.log(obj);
          console.log(seriesData);
        }

        this.nodeJob.legend.data.push(item.slice(3, 8));
        this.nodeJob.series.push({
          name: item.slice(3, 8),
          data: seriesData,
          type: "bar",
          barGap: "20%",
          barCategoryGap: "40%",
          markPoint: {
            data: [
              { type: "max", name: "Max" },
              { type: "min", name: "Min" },
            ],
          },
          markLine: {
            data: [{ type: "average", name: "Avg" }],
          },
        });
      }
      for (let item1 of setDay) {
        this.nodeJob.xAxis.data.push(item1);
      }

      if (!this.seeMode && this.satelliteName == "all") {
        this.nodeJob.xAxis.name = "卫星";
      } else {
        this.nodeJob.xAxis.name = "时间";
      }

      this.loading1 = false;

      option = this.nodeJob;
      console.log(this.nodeJob);
      myChart.setOption(option);
    },
    // 点击查看分析报告按钮
    handleSeeReport() {
      if (this.satelliteName == "all") {
        if (!this.seeMode) {
          this.generatePerSatelliteReport();
        } else {
          this.generatePeport();
        }
      } else {
        this.generatePeport();
      }
      this.report_visible = true;
    },
    // 分步骤查看生成分析报告
    generatePerSatelliteReport() {
      const start_date = new Date(this.queryDate[0]).format("yyyy-MM-dd");
      const end_date = new Date(this.queryDate[1]).format("yyyy-MM-dd");
      let ht = "";
      let len = this.nodeList.length <= 1 ? 1 : this.nodeList.length;
      for (let index = 0; index < len; index++) {
        let node = this.nodeList[index];
        if (node === "all") node = "全部节点";

        let sate_name_data = this.nodeJob.xAxis.data;
        let process_data = this.nodeJob.series[index].data;

        const ave = parseFloat(
          (process_data.reduce((a, b) => a + b) / process_data.length).toFixed(
            1
          )
        );

        let max = {
          sate_name: sate_name_data[0],
          amount: process_data[0],
        };
        let min = {
          sate_name: sate_name_data[0],
          amount: process_data[0],
        };

        let abnormal_data = [];

        process_data.forEach((item, index) => {
          if (item > max.amount) {
            max.sate_name = sate_name_data[index];
            max.amount = item;
          }
          if (item < min.amount) {
            min.sate_name = sate_name_data[index];
            min.amount = item;
          }
          if (item > 1.8 * ave) {
            const t = {
              sate_name: sate_name_data[index],
              amount: item,
            };
            abnormal_data.push(t);
          }
        });
        ht += `<div style="color:#30475e;">查询时间：<b>${start_date}</b> 至 <b>${end_date}</b></div>
          <br/>
          <div>查询节点：<b>${node}</b></div>
          <br/>`;

        ht += `<div>所有步骤的平均处理时间为：<span style="color:red"><b>${ave} s</b></span></div>
          <br/>
          <div>处理耗时最短的卫星为<span style="color:green"><b>${min.sate_name}</b></span>,
          耗时<span style="color:green"><b>${min.amount} s</b></span></div>
          <br/>
          <div>处理耗时最长的卫星为<span style="color:red"><b>${max.sate_name}</b></span>,
          耗时<span style="color:red"><b>${max.amount} s</b></span></div>
          <br/>
          <div>可能需要注意的卫星如下（处理时间超多均值的80%）：</div>
          `;
        abnormal_data.forEach((item) => {
          ht += `<br/><div><span style="color:red"><b>${item.sate_name}:${item.amount}s</b></span></div>`;
        });
        ht += "--------------------------------------------------------------";
      }
      this.report_content = ht;
    },
    // 分步骤查看生成分析报告
    generatePeport() {
      const start_date = new Date(this.queryDate[0]).format("yyyy-MM-dd");
      const end_date = new Date(this.queryDate[1]).format("yyyy-MM-dd");
      let ht = "";
      let len = this.nodeList.length <= 1 ? 1 : this.nodeList.length;
      for (let index = 0; index < len; index++) {
        let node = this.nodeList[index];
        if (node === "all") node = "全部节点";

        let sate_name_data = this.nodeJob.xAxis.data;
        let process_data = this.nodeJob.series[index].data;

        const ave = parseFloat(
          (process_data.reduce((a, b) => a + b) / process_data.length).toFixed(
            1
          )
        );

        let max = {
          sate_name: sate_name_data[0],
          amount: process_data[0],
        };
        let min = {
          sate_name: sate_name_data[0],
          amount: process_data[0],
        };

        let abnormal_data = [];

        process_data.forEach((item, index) => {
          if (item > max.amount) {
            max.sate_name = sate_name_data[index];
            max.amount = item;
          }
          if (item < min.amount) {
            min.sate_name = sate_name_data[index];
            min.amount = item;
          }
          if (item > 1.8 * ave) {
            const t = {
              sate_name: sate_name_data[index],
              amount: item,
            };
            abnormal_data.push(t);
          }
        });
        ht += `<div style="color:#30475e;">查询时间：<b>${start_date}</b> 至 <b>${end_date}</b></div>
          <br/>
          <div>查询节点：<b>${node}</b></div>
          <br/>`;

        ht += `<div>平均处理时间为：<span style="color:red"><b>${ave} s</b></span></div>
          <br/>
          <div>处理耗时最短的日期为<span style="color:green"><b>${min.sate_name}</b></span>,
          耗时<span style="color:green"><b>${min.amount} s</b></span></div>
          <br/>
          <div>处理耗时最长的日期为<span style="color:red"><b>${max.sate_name}</b></span>,
          耗时<span style="color:red"><b>${max.amount} s</b></span></div>
          <br/>
          <div>可能需要注意的日期如下（处理时间超多均值的80%）：</div>
          `;
        abnormal_data.forEach((item) => {
          ht += `<br/><div><span style="color:red"><b>${item.sate_name}:${item.amount}s</b></span></div>`;
        });
        ht += "--------------------------------------------------------------";
      }
      this.report_content = ht;
    },
    // 分析报告是否显示状态发生改变时触发
    updateReportVisable(status) {
      this.report_visible = status;
    },
  },
  components: {
    DatePicker,
    PocessTimeTable,
    Report,
  },
  watch: {
    seeMode() {
      this.getSatelliteData();
    },
  },
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