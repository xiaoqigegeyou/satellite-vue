<!-- 数据处理可视化 -->
<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>检索条件</span>
      </div>
      <el-row>
        <el-form :inline="true" :model="ruleForm" ref="ruleForm">
          <el-card>
            <el-form-item label="检索方式" prop="region">
              <!-- 添加下拉列表值改变触发的函数 -->
              <el-select
                v-model="ruleForm.region"
                placeholder="请选择检索方式"
                @change="getNewDate()"
              >
                <el-option label="当天数据" value="now"></el-option>
                <el-option label="历史查询" value="his"></el-option>
                <el-option label="条件查询" value="pro"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <!-- 历史查询显示的查询子菜单：@getData='updateHisValue' 绑定子组件点击搜索触发父组件的函数 -->
              <HisDatePicker
                :dataVaules="queryDate"
                @getData="HisDataSearch"
                v-show="ruleForm.region === 'his'"
              ></HisDatePicker>
            </el-form-item>
            <el-form-item>
              <!-- 省份卫星查询显示的查询子菜单 -->
              <ProDatePicker
                @getData="ProDataSearch"
                v-show="ruleForm.region === 'pro'"
              ></ProDatePicker>
            </el-form-item>
          </el-card>
        </el-form>
      </el-row>
    </el-card>

    <el-row>
      <el-table
        v-loading="loadFlag"
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        border
        style="width: 100%"
        @expand-change="handleExpendRow"
      >
        <el-table-column
          prop="orbit_no"
          label="圈号"
          width="100px"
        ></el-table-column>
        <el-table-column prop="id" type="expand" align="center" label="展开">
          <template slot-scope="props">
            <el-table
              :data="
                tableData[props.row.id].dicts.slice(
                  (currentPage2 - 1) * pageSize2,
                  currentPage2 * pageSize2
                )
              "
            >
              <el-table-column
                prop="job_name"
                label="任务名称"
                width="100px"
              ></el-table-column>
              <el-table-column
                prop="scene_no"
                label="景号"
                width="80px"
              ></el-table-column>
              <el-table-column
                prop="province_name"
                label="省市名称"
                width="80px"
              ></el-table-column>
              <el-table-column
                prop="finished_time"
                label="完成时间"
                width="150px"
              ></el-table-column>
              <el-table-column prop="id" label="处理进程">
                <template slot-scope="scope">
                  <el-steps
                    :active="
                      tableData[props.row.id].dicts[scope.row.id].step_id - 1
                    "
                    :process-status="
                      now_status[
                        tableData[props.row.id].dicts[scope.row.id].final_status
                      ]
                    "
                    finish-status="success"
                  >
                    <el-step
                      v-for="step in tableData[props.row.id].dicts[
                        scope.row.id
                      ].steps.split(',')"
                      :key="step"
                    >
                      <span slot="title">{{ step }}</span>
                    </el-step>
                  </el-steps>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页器内部 -->
            <div class="block" style="margin-top: 15px">
              <el-pagination
                align="center"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange2"
                :current-page="currentPage2"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize2"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData[props.row.id].dicts.length"
              >
              </el-pagination>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="统计信息">
          <template slot-scope="scope">
            总数：{{ tableData[scope.row.id].num }}, 成功数：{{
              tableData[scope.row.id].success
            }}, 失败数：{{ tableData[scope.row.id].error }},正在处理：{{
              tableData[scope.row.id].running
            }}
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->

      <div class="block" style="margin-top: 15px">
        <el-pagination
          align="center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length"
        >
        </el-pagination>
      </div>
    </el-row>
  </div>
</template>

<script>
/* 引入历史查询显示的具体查询组件 */
import HisDatePicker from "@/page/data-visual/components/DatePickerSmallHis.vue";
/* 引入卫星名查询显示的具体查询组件 */
import ProDatePicker from "@/page/data-visual/components/DatePickerSmallProvince.vue";
import DatePickerSmallHis from "./components/DatePickerSmallHis";
export default {
  data() {
    const now_status = {
      SUCCEEDED: "success",
      FAILED: "error",
      RUNNING: "finish",
      /* 云判高覆盖修改默认样式 */
      STOP: "process",
    };
    return {
      now_status,
      tableData: null,
      active: 1,
      ruleForm: {
        region: "now",
      },
      //查询省份
      provinceValue: "",
      //查询卫星
      clusterValue: "",
      currentPage: 1, // 当前页码
      total: 2000, // 总条数
      pageSize: 50, // 每页的数据条数
      //二级表格分页
      clusterValue2: "",
      currentPage2: 1, // 当前页码
      total2: 2000, // 总条数
      pageSize2: 20, // 每页的数据条数
      queryDate: {},
      // 景号
      s_id: "-1",
      // 产品号
      product_id: "-1",
      // 省份code数组
      province_nos: [],
      // 表格加载中
      loadFlag: false,
      o_id: "-1",
    };
  },
  components: {
    // 历史查询菜单子组件
    HisDatePicker,
    // 其他查询菜单子组件
    ProDatePicker,
  },
  methods: {
    getReodom() {
      var stat = ["finish", "error", "success"];
      return stat[parseInt(Math.round(Math.random() * 2))];
    },
    HisDataSearch(dateValues) {
      this.getHisDate(dateValues);
    },
    ProDataSearch(o_id, s_id, product_id, provinces_nos) {

     
      // if (o_id == "" && s_id == "" && product_id == "" ) {
      //   console.log(111);
      //     this.getDataList();

      // } else {
        if (o_id == "") {
          o_id = "-1";
          console.log(o_id);
        }
        if (s_id == "") {
          s_id = "-1";
        }
        if (product_id == "") {
          product_id = "-1";
        }
        // this.showMessage('success',s_id);
        this.s_id = null;
        this.s_id = s_id;
        this.o_id = o_id;
        this.product_id = product_id;
        this.province_nos = provinces_nos;
        this.getProData(o_id, s_id, product_id, provinces_nos);
      // }
    },
    showMessage(type, message) {
      this.$message({
        type: type,
        message: message,
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
      this.reload();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.reload();
    },
    //二级表格分页
    handleSizeChange2(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage2 = 1;
      this.pageSize2 = val;
      this.reload();
    },
    handleCurrentChange2(val) {
      console.log(`当前页: ${val}`);
      // this.showMessage('success',result);
      this.currentPage2 = val;
      this.reload();
    },

    async getDataList() {
      this.loadFlag = true;
      const { data: result } = await this.$http.get("DataDispose/CircleToday");
      //console.log(result);
      // this.showMessage('success',result);
      this.tableData = result;
      this.loadFlag = false;
    },

    handleExpendRow(row, expandedRows) {
      //这里是点击每一行会触发的方法

      if (!row.dicts) {
        //这里做了一个判断，首先判断这一行的数据对象有没有dicts这个属性，如果没说明没有数据我们需要请求后台，相当于懒加载
        if (this.ruleForm.region === "now") {
          this.queryDictData(row.id, row.orbit_no); //关键就是这个方法，row.id是父分组的id需要传给后台查询该子分组的信息
        } else if (this.ruleForm.region === "his") {
          this.queryDictDataHis(row.id, row.orbit_no);
        } else {
          this.queryDictDataPro(row.id, row.orbit_no);
        }
      }
    },
    queryDictData(id, orbit_no) {
      let self = this;
      if (orbit_no == "无圈号数据") {
        this.$http.get("DataDispose/DataDisPoseTodayNULL").then((rspData) => {
          //这里是我们项目里封装的ajax请求方法，相当于axios.post()
          const index = self.tableData.findIndex((data) => data.id === id); //首先pageData.results绑定的是父表格的数据，那么我们要把子表格数据塞到对应的父分组，那我们要知道是哪一个分组，这里的findIndex就是通过id去查找对应的父分组在数据数组里的下标
          self.$set(self.tableData[index], "dicts", rspData.data); //这里就是给父表格数据数组self.pageData.results第index个对象加上dicts这个属性，然后把rspData.data我们从后台拿到的数据绑定到dicts这个key里
        });
      } else {
        this.$http
          .get("DataDispose/DataDisPoseToday?orbit_no=" + orbit_no)
          .then((rspData) => {
            //这里是我们项目里封装的ajax请求方法，相当于axios.post()
            const index = self.tableData.findIndex((data) => data.id === id); //首先pageData.results绑定的是父表格的数据，那么我们要把子表格数据塞到对应的父分组，那我们要知道是哪一个分组，这里的findIndex就是通过id去查找对应的父分组在数据数组里的下标
            self.$set(self.tableData[index], "dicts", rspData.data); //这里就是给父表格数据数组self.pageData.results第index个对象加上dicts这个属性，然后把rspData.data我们从后台拿到的数据绑定到dicts这个key里
          });
      }
      this.currentPage2 = 1;
    },

    async getHisDate(dateValue) {
      this.loadFlag = true;
      if (dateValue != null && dateValue.length == 2) {
        //将结束时间修改为查询区间末尾一天的时结束时间 23:59
        this.queryDate[0] = dateValue[0];
        this.queryDate[1] = dateValue[1] + 24 * 60 * 60 * 1000 - 1;
      } else {
        //默认查询为当前一周
        //获取当天结束时间的时间（23:59）
        var nowDayEnd = new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            24 * 60 * 60 * 1000 -
            1
        );
        //查询时间终止时间
        var endTimeStamp = Date.parse(nowDayEnd);
        //查询起始时间：终止时间前推七天(00:00)
        var startTimeStamp = Date.parse(
          new Date(nowDayEnd.getTime() - 7 * 24 * 60 * 60 * 1000 + 1)
        );

        this.queryDate = [startTimeStamp, endTimeStamp];
      }

      // this.showMessage('success',);
      var startTime = this.queryDate[0];
      var endTime = this.queryDate[1];

      const { data: result } = await this.$http.get(
        "DataDispose/CircleHis?startTime=" + startTime + "&endTime=" + endTime
      );
      //console.log(result);
      // this.showMessage('success',result);
      this.tableData = null;
      this.tableData = result;
      this.loadFlag = false;
      console.log(result);
    },
    queryDictDataHis(id, orbit_no) {
      let self = this;
      var startTime = this.queryDate[0];
      var endTime = this.queryDate[1];
      if (orbit_no == "无圈号数据") {
        this.$http
          .get(
            "DataDispose/DataDisPoseHisNULL?startTime=" +
              startTime +
              "&endTime=" +
              endTime
          )
          .then((rspData) => {
            //这里是我们项目里封装的ajax请求方法，相当于axios.post()
            console.log(rspData);
            const index = self.tableData.findIndex((data) => data.id === id); //首先pageData.results绑定的是父表格的数据，那么我们要把子表格数据塞到对应的父分组，那我们要知道是哪一个分组，这里的findIndex就是通过id去查找对应的父分组在数据数组里的下标
            self.$set(self.tableData[index], "dicts", rspData.data); //这里就是给父表格数据数组self.pageData.results第index个对象加上dicts这个属性，然后把rspData.data我们从后台拿到的数据绑定到dicts这个key里
          });
      } else {
        // this.showMessage('success','进入方法');
        this.$http
          .get(
            "DataDispose/DataDisPoseHis?startTime=" +
              startTime +
              "&endTime=" +
              endTime +
              "&orbit_no=" +
              orbit_no
          )
          .then((rspData) => {
            //这里是我们项目里封装的ajax请求方法，相当于axios.post()
            const index = self.tableData.findIndex((data) => data.id === id); //首先pageData.results绑定的是父表格的数据，那么我们要把子表格数据塞到对应的父分组，那我们要知道是哪一个分组，这里的findIndex就是通过id去查找对应的父分组在数据数组里的下标
            self.$set(self.tableData[index], "dicts", rspData.data); //这里就是给父表格数据数组self.pageData.results第index个对象加上dicts这个属性，然后把rspData.data我们从后台拿到的数据绑定到dicts这个key里
          });
      }
      this.currentPage2 = 1;
    },
    getNewDate() {
      if (this.ruleForm.region === "now") {
        this.tableData = null;
        this.getDataList();
      } else if (this.ruleForm.region === "his") {
        this.tableData = null;
        this.getHisDate();
      } else {
        this.tableData = null;
        this.getAllData();
      }
    },
    //设置默认时间一周
    setDefaultDate() {
      //默认查询为当前一周
      //获取当天结束时间的时间（23:59）
      var nowDayEnd = new Date(
        new Date(new Date().toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000 -
          1
      );
      //查询时间终止时间
      var endTimeStamp = Date.parse(nowDayEnd);
      //查询起始时间：终止时间前推七天(00:00)
      var startTimeStamp = Date.parse(
        new Date(nowDayEnd.getTime() - 7 * 24 * 60 * 60 * 1000 + 1)
      );
      this.queryDate = [startTimeStamp, endTimeStamp];
    },
    async getProData(o_id, s_id, product_id, provinces_nos) {
      this.loadFlag = true;
      const { data: result } = await this.$http.get(
        "DataDispose/CirclePro?orbit_no=" +
          o_id +
          "&scene_no=" +
          s_id +
          "&product_id=" +
          product_id +
          "&province_nos=" +
          provinces_nos
      );
      //console.log(result);
      this.tableData = result;
      this.loadFlag = false;
    },
    queryDictDataPro(id, orbit_no) {
      let self = this;
      if (orbit_no == "无圈号数据") {
        this.$http
          .get(
            "DataDispose/DataDisPoseProNULL?scene_no=" +
              this.s_id +
              "&product_id=" +
              this.product_id +
              "&province_nos=" +
              this.province_nos
          )
          .then((rspData) => {
            //这里是我们项目里封装的ajax请求方法，相当于axios.post()
            const index = self.tableData.findIndex((data) => data.id === id); //首先pageData.results绑定的是父表格的数据，那么我们要把子表格数据塞到对应的父分组，那我们要知道是哪一个分组，这里的findIndex就是通过id去查找对应的父分组在数据数组里的下标
            self.$set(self.tableData[index], "dicts", rspData.data); //这里就是给父表格数据数组self.pageData.results第index个对象加上dicts这个属性，然后把rspData.data我们从后台拿到的数据绑定到dicts这个key里
          });
      } else {
        // this.showMessage('success',orbit_no);
        this.$http
          .get(
            "DataDispose/DataDisPosePro?orbit_no=" +
              orbit_no +
              "&scene_no=" +
              this.s_id +
              "&product_id=" +
              this.product_id +
              "&query_orbit_no=" +
              this.o_id +
              "&province_nos=" +
              this.province_nos
          )
          .then((rspData) => {
            //这里是我们项目里封装的ajax请求方法，相当于axios.post()
            const index = self.tableData.findIndex((data) => data.id === id); //首先pageData.results绑定的是父表格的数据，那么我们要把子表格数据塞到对应的父分组，那我们要知道是哪一个分组，这里的findIndex就是通过id去查找对应的父分组在数据数组里的下标
            self.$set(self.tableData[index], "dicts", rspData.data); //这里就是给父表格数据数组self.pageData.results第index个对象加上dicts这个属性，然后把rspData.data我们从后台拿到的数据绑定到dicts这个key里
          });
      }
      this.currentPage2 = 1;
    },
    async getAllData() {
      const { data: result } = await this.$http.get("DataDispose/CircleAll");
      //console.log(result);
      this.tableData = null;
      this.tableData = result;
    },
  },
  mounted() {
    this.getDataList();
  },
};
</script>

<style lang="scss">
/* 云判高云覆盖率修改默认样式 */
.el-step__description.is-process {
  color: orange;
}
.el-step__head.is-process {
  color: orange;
  border-color: orange;
}
.el-step__title.is-process {
  color: orange;
}
</style>
