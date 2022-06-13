<!-- 处理步骤配置 -->
<template>
  <el-scrollbar style="height:120%">
      <el-col :span="24">
          <el-card shadow="always">

            <el-row>
              <el-form ref="StepForm" :model="StepForm" label-width="80px">
                  <el-col :span="6">
                      <el-form-item label="id">
                          <el-input v-model="StepForm.id"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="6">
                      <el-form-item label="步骤名称">
                          <el-input v-model="StepForm.step_name"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="6">
                      <el-form-item label="后缀名称">
                          <el-input v-model="StepForm.suffix_name"></el-input>
                      </el-form-item>
                  </el-col>
                   <el-col :span="6">
                    <el-form-item>
                      <el-button type="primary" size="small" plain>添加</el-button>
                      <el-button type="danger" size="small" plain>删除</el-button>
                    </el-form-item>
                  </el-col>
              </el-form>
            </el-row>
         </el-card>
      </el-col>
    <el-row class="top">
           <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
            <el-table-column prop="id" label="编号" >
            </el-table-column>
            <el-table-column prop="step_name" label="步骤名称" >
            </el-table-column>
            <el-table-column prop="suffix_name" label="后缀名称">
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <div class="block" style="margin-top:15px;">
            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5,10]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
            </el-pagination>
        </div>
    </el-row>

  </el-scrollbar>
</template>

<script>
import 'echarts/lib/chart/line'
export default {
  data () {
    return {
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 5, // 每页的数据条数
      StepForm: {
          id:'',
          step_name:'',
          suffix_name:''
      },
      tableData:this.getStepList(),
    }
  },
  methods: {

    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.currentPage = 1
      this.pageSize = val
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
    },
      async getStepList(){
          const {data:result} = await this.$http.get('StepConfig/AllStep');
          //console.log(result);
          this.tableData = result;
      },
      submitStepForm(StepForm) {
          this.$refs[StepForm].validate(async(valid) => {
              if (valid) {
                  const {data:result} = await this.$http.post('StepConfig/addStep',this.StepForm);
                  if(result.affectedRows > 0){
                      this.showMessage('success','添加成功！');
                      this.$router.push('StepConfig');
                  }else{
                      this.showMessage.error('添加失败！');
                  }
              }
          });
      },
      deleteStep(SatelliteForm){
          this.$refs[SatelliteForm].validate(async(valid) => {
              if (valid) {
                  const {data:result} = await this.$http.post('StepConfig/delStep',this.StepForm);
                  if(result.affectedRows > 0){
                      this.showMessage('success','删除成功！');
                      this.$router.push('StepConfig');
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
}
</style>
