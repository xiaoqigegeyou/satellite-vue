
<!-- 节点信息配置 -->
<template>
  <el-scrollbar style="height:120%">
    <el-row>
      <el-col :span="24">
          <el-card shadow="always">
<!--            <el-row>-->
<!--                <el-form ref="form" :model="form" label-width="80px">-->
<!--                  <el-col :span="8">-->
<!--                     <el-form-item label="检索方式">-->
<!--                      <el-select v-model="form.region" placeholder="请选择检索方式">-->
<!--                        <el-option label="全部机器" value="name"></el-option>-->
<!--                        <el-option label="条件检索" value="code"></el-option>-->
<!--                       </el-select>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                  <el-col :span="6">-->
<!--                    <el-form-item>-->
<!--                      <el-button type="primary" size="small" plain>查找</el-button>-->
<!--                    </el-form-item>-->
<!--                  </el-col>-->
<!--                </el-form>-->

<!--            </el-row>-->
<!--            <hr />-->
              
            <el-row>
              <el-form ref="NodeForm" :model="NodeForm" :rules="rules" class="NodeForm" label-width="80px">
                  <el-col :span="4">
                    <el-form-item label="机器名称">
                      <el-input v-model="NodeForm.name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                      <el-form-item label="域名">
                          <el-input v-model="NodeForm.domain"></el-input>
                      </el-form-item>
                  </el-col>
                 <el-col :span="4">
                    <el-form-item label="机器ip4">
                      <el-input v-model="NodeForm.ip4"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                      <el-form-item label="机器ip6">
                          <el-input v-model="NodeForm.ip6"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="4">
                      <el-form-item label="备注">
                          <el-input v-model="NodeForm.remark"></el-input>
                      </el-form-item>
                  </el-col>
                   <el-col :span="4">
                    <el-form-item>
                      <el-button type="primary" @click="submitNodeForm('NodeForm')" size="small" plain class="submit_btn">添加</el-button>
                        <el-button type="danger"  @click="deleteNode('NodeForm')" size="small" plain>删除</el-button>
                    </el-form-item>
                  </el-col>
              </el-form>
            </el-row>
         </el-card>
      </el-col>
    </el-row>
    <el-row class="top">
           <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%">
            <el-table-column prop="id" label="序号" width="180">
            </el-table-column>
            <el-table-column prop="name" label="机器名" width="180">
            </el-table-column>
            <el-table-column prop="domain" label="域名">
            </el-table-column>
            <el-table-column prop="ip4" label="机器IP4">
            </el-table-column>
            <el-table-column prop="ip6" label="机器IP6">
            </el-table-column>
            <el-table-column prop="remark" label="备注信息">
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
      name: 'Gpu01',
      ip: '192.168.1.1',
      beizhu:'master'
    }
    return {

        NodeForm: {
        name: '',
        domain:'',
        ip4:'',
        ip6:'',
        remark:'',
      },
      tableData:this.getAllNodeList(),
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 5 // 每页的数据条数
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
    async getAllNodeList(){
          const {data:result} = await this.$http.get('NodeConfig/AllNodeInfo');
          //console.log(result);
          this.tableData = result;
    },
      submitNodeForm(NodeForm) {
          this.$refs[NodeForm].validate(async(valid) => {
              if (valid) {
                  const {data:result} = await this.$http.post('NodeConfig/addNode',this.NodeForm);
                  if(result.affectedRows > 0){
                      this.showMessage('success','添加成功！');
                      this.$router.push('nodeConfig');
                  }else{
                      this.showMessage.error('添加失败！');
                  }
              }
          });
      },
      deleteNode(NodeForm){
          this.$refs[NodeForm].validate(async(valid) => {
              if (valid) {
                  const {data:result} = await this.$http.post('NodeConfig/delNode',this.NodeForm);
                  if(result.affectedRows > 0){
                      this.showMessage('success','删除成功！');
                      this.$router.push('nodeConfig');
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
