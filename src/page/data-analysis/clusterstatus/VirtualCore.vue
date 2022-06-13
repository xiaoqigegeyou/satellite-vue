<template>
  <div>
    <el-row>
      <el-col>
        <Picker @getDate="handleClickSearch"></Picker>
      </el-col>
    </el-row>
    <el-card>
      <el-row>
        <el-col>
          <div class="block">
            <chart
              ref="virtualCoreChart"
              :options="virtualCoreChartData"
              :auto-resize="true"
              v-loading="loading1"
              theme="shine"
            ></chart>
          </div>
        </el-col>
      </el-row>
    </el-card>
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
import Picker from "@/components/dateTab/DatePickerSmall";
export default {
  data() {
    return {
      queryDate: "",
      loading1: false,
      virtualCoreChartData: {
        title: {
          text: "集群虚拟核占用",
          left: "center",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
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
  },
  mounted() {
    this.setDefaultDate();
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
      this.queryDate = [startTimeStamp, endTimeStamp];
    },
    async getVirtualCoreChartData() {
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
        ser_data.push((v.vcoreAllocated / v.vcoreTotal) * 100);
      });

      this.virtualCoreChartData.xAxis.data = x_data;
      this.virtualCoreChartData.series[0].data = ser_data;

      this.loading1 = false;
    },
  },
};
</script>