<template>
  <div>
    <el-row :span="23">
      <DatePicker
        @handleSeeReport="handleSeeReport"
        @switchMode="handleSwtichNode"
        @getDate="handleClickPickerButton"
        @firstQuery="setDefaultNode"
        ref="picker"
      ></DatePicker>
    </el-row>
    <el-row v-if="!mode">
      <!-- 节点内存占用区域 -->
      <el-col :span="24">
        <el-card>
          <el-row>
            <el-col>
              <chart
                id="memoryOption"
                :options="memoryOption"
                :auto-resize="true"
                theme="macarons"
                v-loading="loading1"
              ></chart>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!-- 虚拟核占用区域 -->
    <el-row v-if="!mode">
      <el-col>
        <el-card>
          <el-row>
            <el-col>
              <chart
                id="virtualCoreOption"
                :options="virtualCoreOption"
                :auto-resize="true"
                theme="macarons"
                v-loading="loading2"
              ></chart>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 表格显示区域 -->
    <el-row v-if="mode">
      <el-col>
        <el-card v-loading="loading3">
          <el-table
            :data="
              tableData.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )
            "
            stripe
            style="width: 100%"
          >
            <el-table-column prop="hostName" label="节点" width="180">
            </el-table-column>
            <el-table-column
              prop="numContainers"
              label="运行容器总数"
              width="180"
            >
            </el-table-column>
            <el-table-column prop="usedMemory" label="已使用内存（MB）">
            </el-table-column>
            <el-table-column prop="availMemory" label="可用内存（MB）">
            </el-table-column>
            <el-table-column prop="usedVcore" label="已使用vcore数">
            </el-table-column>
            <el-table-column prop="availableVcote" label="可用vcore数">
            </el-table-column>
            <el-table-column prop="createdAt" label="时间"> </el-table-column>
          </el-table>
          <!-- 分页器 -->
          <div class="block" style="margin-top: 15px">
            <el-pagination
              background
              align="center"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[15, 20, 30, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </el-card>
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
<style scoped>
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.echarts {
  width: 100%;
  height: 300px;
}
</style>
<script>
import "echarts/lib/chart/line";
import "echarts/lib/component/dataZoom";
import DatePicker from "../components/DatePickerNodeStatus";
import Report from "../components/Report";
export default {
  data() {
    return {
      // 侧边报告需要的数据
      report_title: "分析报告",
      report_content: "",
      report_visible: false,
      // 查询节点

      //查询日期
      queryDate: [],
      // 内存占用echarts对象
      memoryOption: {
        title: {
          text: "节点内存占用",
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
          data: [],
          left: "right",
        },
        xAxis: {
          name: "时间",
          type: "category",
          data: [],
        },
        yAxis: {
          name: "占用率(%)",
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
      loading1: false,
      virtualCoreOption: {
        title: {
          text: "虚拟核心占用",
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
          data: [],
          left: "right",
        },
        xAxis: {
          name: "时间",
          type: "category",
          data: [],
        },
        yAxis: {
          name: "占用率(%)",
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
      loading2: false,
      // 显示模式 false:图表模式 true:详细表格模式
      mode: false,
      tableData: [],
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 15, // 每页的数据条数
      // 表格加载中
      loading3: false,
      node: "",
      selectNodeList: ["kj-gpu01.bigdata.com"],
    };
  },
  components: {
    DatePicker,
    Report,
  },
  mounted() {
    this.setDefaultDate();
  
     this.handleClickPickerButton(this.queryDate,this.selectNodeList);
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
      // 调用后端分页
      //this.getNodePage()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      // 调用后端分页
      //this.getNodePage()
    },
    // 点击查找按钮
    handleClickPickerButton(dateValue, node) {
      var myChart = this.$echarts.init(document.getElementById("memoryOption"));
      this.memoryOption = {
        title: {
          text: "节点内存占用",
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
          data: [],
          left: "right",
        },
        xAxis: {
          name: "时间",
          type: "category",
          data: [],
        },
        yAxis: {
          name: "占用率(%)",
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

      var myChart2 = this.$echarts.init(
        document.getElementById("virtualCoreOption")
      );
      this.virtualCoreOption = {
        title: {
          text: "虚拟核心占用",
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
          data: [],
          left: "right",
        },
        xAxis: {
          name: "时间",
          type: "category",
          data: [],
        },
        yAxis: {
          name: "占用率(%)",
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

      var option = this.memoryOption;

      var option2 = this.virtualCoreOption;
      myChart.clear();
      myChart.setOption(option);

      myChart2.clear();
      this.selectNodeList = node;
      if (dateValue != null && dateValue.length == 2) {
        /* dateValue[1] = dateValue[1]+24*60*60*1000-1;
                this.queryDate = dateValue; */
        this.queryDate[0] = dateValue[0];
        this.queryDate[1] = dateValue[1] + 24 * 60 * 60 * 1000 - 1;
      } else {
        //设置为默认的查询时间
        this.setDefaultDate();
      }
      this.selectNodeList.forEach((item, index, arr) => {
        console.log(item); // a b c d e
        this.node = item;

        // 发起查询
        this.getMemoryOptionData(item);
        this.getVitualCoreOptionData(item);
        this.getNodeSatusTableData(item);
      });

      option = this.memoryOption;

      option2 = this.virtualCoreOption;
      myChart.clear();
      myChart.setOption(option);

      myChart2.clear();
      myChart2.setOption(option2);
    },
    // 子组件数据加载完毕后调用
    setDefaultNode(node) {
      // 设置默认查询时间
      this.setDefaultDate();
      this.node = node;
      // 发起查询
      this.getMemoryOptionData(node);
      this.getVitualCoreOptionData(node);
      this.getNodeSatusTableData();
    },

    // 获取内存占用图表的数据
    async getMemoryOptionData(item) {
      this.loading1 = true;
      const params = {
        startTime: this.queryDate[0],
        endTime: this.queryDate[1],
        node: this.node,
      };
      const { data: result } = await this.$http.get("nodeStatus/memory", {
        params,
      });
      let xAxisData = [];
      let seriesData = [];
      for (let i = 0; i < result.length; i++) {
        xAxisData.push(result[i].day);
        seriesData.push(result[i].amount);
      }
      this.memoryOption.series.push({
        name: item.slice(3, 8),
        data: seriesData,
        type: "line",
      });
      this.memoryOption.legend.data.push(item.slice(3, 8));
      if (this.memoryOption.xAxis.data.length <= 0) {
        this.memoryOption.xAxis.data = xAxisData;
      }
      console.log(this.memoryOption);
      this.loading1 = false;
    },
    // 获取虚拟核心占用图表的数据
    async getVitualCoreOptionData(item) {
      // if (item.length == 1) this.node = item[0];
      this.loading2 = true;
      const params = {
        startTime: this.queryDate[0],
        endTime: this.queryDate[1],
        node: this.node,
      };
      const { data: result } = await this.$http.get("nodeStatus/virtualCore", {
        params,
      });
      //console.log(result);
      // 设置图表数据
      //this.tableList = result
      let xAxisData = [];
      let seriesData = [];
      for (let i = 0; i < result.length; i++) {
        xAxisData.push(result[i].day);
        seriesData.push(result[i].amount);
      }
      this.virtualCoreOption.series.push({
        name: item.slice(3, 8),
        data: seriesData,
        type: "line",
      });
      this.virtualCoreOption.legend.data.push(item.slice(3, 8));
      if (this.virtualCoreOption.xAxis.data.length <= 0) {
        this.virtualCoreOption.xAxis.data = xAxisData;
      }
      this.loading2 = false;
    },
    // 获取表格中的数据
    async getNodeSatusTableData(item) {
      this.loading3 = true;
      const params = {
        startTime: this.queryDate[0],
        endTime: this.queryDate[1],
        node: this.node,
      };
      const { data: result } = await this.$http.get("nodeStatus/table", {
        params,
      });
      this.total += result.total;
      this.tableData = [...this.tableData, ...result.list];

      this.loading3 = false;
    },
    // 子组件调用函数 切换显示模式
    handleSwtichNode(mode) {
      this.mode = mode;
    },
    // 点击查看分析报告按钮
    handleSeeReport() {
      // 数据
      let ht = "";
      let len =
        this.selectNodeList.length <= 1 ? 1 : this.selectNodeList.length;
      for (let index = 0; index < len; index++) {
        const memory_data = this.memoryOption.series[index].data;
        const virtual_data = this.virtualCoreOption.series[index].data;
        const memory_time = this.memoryOption.xAxis.data;
        const virtual_time = this.virtualCoreOption.xAxis.data;

        if (
          memory_data == undefined ||
          memory_data.length <= 0 ||
          virtual_data == undefined ||
          virtual_data.length <= 0
        ) {
          ht = "无";
          break;
        }

        const node = this.selectNodeList[index];

        let memory_index = [];
        let memory_95_index = [];
        let virtual_index = [];
        let virtual_95_index = [];

        const memory_ave = parseFloat(
          (memory_data.reduce((a, b) => a + b) / memory_data.length).toFixed(2)
        );
        const virtual_ave = parseFloat(
          (virtual_data.reduce((a, b) => a + b) / virtual_data.length).toFixed(
            2
          )
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

        ht += `<div style="color:#30475e;">查询时间：<b>${start_date}</b> 至 <b>${end_date}</b></div>
      <br/>
      <div>节点：<span style:"color:red;"><b>${node}</b></span></div>
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
        ht += "--------------------------------------------------------------";
      }
      this.report_content = ht;
      // 显示抽屉
      this.report_visible = true;
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
      this.queryDate = [1612108800000, 1612713600000];

    },
    // 分析报告是否显示状态发生改变时触发
    updateReportVisable(status) {
      this.report_visible = status;
    },
  },
};
</script>