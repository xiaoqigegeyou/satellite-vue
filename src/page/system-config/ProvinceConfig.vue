<!-- 省份配置 -->
<template>
  <el-scrollbar style="height:120%">
    <el-row>
      <el-col :span="24">
          <el-card shadow="always">
            <el-row>
              <el-form ref="ProvinceForm" :model="ProvinceForm" label-width="80px">
                  <el-col :span="8">
                    <el-form-item label="省份名称">
                      <el-input v-model="ProvinceForm.name"></el-input>
                    </el-form-item>
                  </el-col>
                 <el-col :span="8">
                    <el-form-item label="省份代码">
                      <el-input v-model="ProvinceForm.code"></el-input>
                    </el-form-item>
                  </el-col>
                   <el-col :span="6">
                    <el-form-item>
                      <el-button type="primary"  @click="submitForm('ProvinceForm')" size="small" plain>添加</el-button>
                        <el-button type="danger"  @click="deleteProvince('ProvinceForm')" size="small" plain>删除</el-button>
                    </el-form-item>
                  </el-col>
              </el-form>
            </el-row>
         </el-card>
      </el-col>
    </el-row>
    <el-row class="top">
           <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
            <el-table-column prop="id" label="序号" >
            </el-table-column>
            <el-table-column prop="province_name" label="省份名">
            </el-table-column>
            <el-table-column prop="code" label="省份代码">
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
     const item = {
      id: '1',
      name: '山东',
      code: '1111',
    }
    return {
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 5, // 每页的数据条数
      ProvinceForm: {
        name: '',
        code:''
      },
      tableData: this.getAllProvinceList(),
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
    async getAllProvinceList(){
          const {data:result} = await this.$http.get('ProvinceConfig/AllProvinceInfo');
          //console.log(result);
          this.tableData = result;
      },
      submitForm(ProvinceForm) {
          this.$refs[ProvinceForm].validate(async(valid) => {
              if (valid) {
                  const {data:result} = await this.$http.post('ProvinceConfig/addProvince',this.ProvinceForm);
                  //console.log(result);
                  //{fieldCount: 0, affectedRows: 1, insertId: 2, serverStatus: 2, warningCount: 0, …}affectedRows: 1changedRows: 0fieldCount: 0insertId: 2message: ""protocol41: trueserverStatus: 2warningCount: 0}
                  if(result.affectedRows > 0){
                      this.showMessage('success','添加成功！');
                      this.$router.push('provinceConfig');
                  }else{
                      this.showMessage.error('添加失败！');
                  }
              }
          });
      },
      deleteProvince(ProvinceForm){
          this.$refs[ProvinceForm].validate(async(valid) => {
              if (valid) {
                  const {data:result} = await this.$http.post('ProvinceConfig/delProvince',this.ProvinceForm);
                  if(result.affectedRows > 0){
                      this.showMessage('success','删除成功！');
                      this.$router.push('provinceConfig');
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
