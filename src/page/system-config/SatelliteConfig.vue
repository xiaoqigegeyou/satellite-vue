<!-- 卫星配置 -->
<template>
  <div>
    <el-row>
      <el-col :span="24">
          <el-card shadow="always">
            <el-row>
                <el-form ref="SatelliteForm" :model="SatelliteForm" label-width="80px">

                  <el-col :span="8">
                      <el-form ref="SatelliteForm" :model="SatelliteForm" label-width="80px">
                      <el-form-item label="卫星型号">
                      <el-input v-model="SatelliteForm.satellite_name"></el-input>
                     </el-form-item>
                     </el-form>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                        <el-button type="primary" @click="submitSatelliteForm('SatelliteForm')" size="small" plain class="submit_btn">添加</el-button>
                        <el-button type="danger"  @click="deleteSatellite('SatelliteForm')" size="small" plain>删除</el-button>
                    </el-form-item>
                  </el-col>
                </el-form>

            </el-row>
         </el-card>
      </el-col>
    </el-row>
    <el-row class="top">
           <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%;text-align: center;">
            <el-table-column prop="id" label="卫星编号">
            </el-table-column>
            <el-table-column prop="satellite_name" label="卫星型号">
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <div class="block" style="margin-top:15px;">
            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5,10]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
            </el-pagination>
        </div>
    </el-row>

  </div>
</template>

<script>
import 'echarts/lib/chart/line'
export default {
  data () {
      const item = {
      id: '1',
      name: 'GF2',
      code: '1111',
    }
    return {
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 5, // 每页的数据条数
      SatelliteForm: {
            satellite_name:''
      },
      tableData: this.getAllSatelliteList(),
    }
  },
  methods: {
      showMessage(type,message){
          this.$message({
              type: type,
              message: message
          });
      },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.currentPage = 1
      this.pageSize = val
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
    },
      async getAllSatelliteList(){
          const {data:result} = await this.$http.get('SatelliteConfig/AllSatellite');
          //console.log(result);
          this.tableData = result;
      },
      submitSatelliteForm(SatelliteForm) {
          this.$refs[SatelliteForm].validate(async(valid) => {
              if (valid) {
                  const {data:result} = await this.$http.post('SatelliteConfig/addSatellite',this.SatelliteForm);
                  if(result.affectedRows > 0){
                      this.showMessage('success','添加成功！');
                      this.$router.push('satelliteConfig');
                  }else{
                      this.showMessage.error('添加失败！');
                  }
              }
          });
      },
      deleteSatellite(SatelliteForm){
          this.$refs[SatelliteForm].validate(async(valid) => {
              if (valid) {
                  const {data:result} = await this.$http.post('SatelliteConfig/delSatellite',this.SatelliteForm);
                  if(result.affectedRows > 0){
                      this.showMessage('success','删除成功！');
                      this.$router.push('satelliteConfig');
                  }else{
                      this.showMessage.error('删除失败！');
                  }
              }
          });
      }
  }
}
</script>

<style lang="scss" scoped>
.top{
  margin-top: 10px;
  width: 97%;
  margin-left: 15px;
}
</style>
