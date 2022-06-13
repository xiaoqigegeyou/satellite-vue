<!-- 错误处理 -->
<template>
  <el-scrollbar style="height:120%">
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">

          <el-row>
            <el-form ref="ErrorForm" :model="ErrorForm"  class="ErrorForm" label-width="80px">
              <el-col :span="6">
                <el-form-item label="任务编号">
                  <el-input v-model="ErrorForm.job_id"></el-input>
                </el-form-item>
              </el-col>
                <el-col :span="6">
                    <el-form-item label="产品号">
                        <el-input v-model="ErrorForm.product_id"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="景号">
                        <el-input v-model="ErrorForm.scene_no"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="圈号">
                        <el-input v-model="ErrorForm.orbit_no"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="卫星">
                        <el-select  placeholder="请选择卫星" v-model="ErrorForm.satellite_name">
                            <el-option :key="ALL.satellite_name" :label="ALL.label" :value='ALL.satellite_name'></el-option>
                            <el-option v-for="item in CluOptions" :key="item.id" :label="item.satellite_name" :value="item.satellite_name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="省份">
                        <el-select  placeholder="请选择省份" v-model="ErrorForm.province_name">
                            <el-option :key="ALL.code" :label="ALL.label" :value='ALL.code'></el-option>
                            <el-option v-for="item in ProOptions" :key="item.code" :label="item.province_name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="步骤">
                        <el-select  placeholder="请选择步骤" v-model="ErrorForm.step_name">
                            <el-option :key="ALL.id" :label="ALL.label" :value='ALL.id'></el-option>
                            <el-option v-for="item in StepOptions" :key="item.id" :label="item.step_name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                <el-form-item>
                  <el-button type="primary" @click="submitNodeForm" size="small" plain class="submit_btn">查询</el-button>
                    &nbsp;&nbsp;&nbsp;
                  <el-button type="danger"  @click="UpdateError" size="small" plain>重做</el-button>
                </el-form-item>
                </el-col>
            </el-form>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="top">
      <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%"  @selection-change="changeFun" stripe>
        <el-table-column type="selection" >
        </el-table-column>
        <el-table-column prop="job_id" label="任务编号" >
        </el-table-column>
        <el-table-column prop="satellite_name" label="卫星名" >
        </el-table-column>
        <el-table-column prop="product_id" label="产品号">
        </el-table-column>
        <el-table-column prop="scene_no" label="景号">
        </el-table-column>
        <el-table-column prop="orbit_no" label="圈号">
        </el-table-column>
        <el-table-column prop="province_name" label="省份">
        </el-table-column>
        <el-table-column prop="step_name" label="出错步骤">
        </el-table-column>
        <el-table-column prop="finished_time" label="完成时间">
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="block" style="margin-top:15px;">
        <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20,50,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
        </el-pagination>
      </div>
    </el-row>


    <!-- 用户点击重做是弹出的重做步骤选择框 -->
    <el-dialog
      title="选择重做任务步骤"
      :visible.sync="dialogVisible"
      width="50%">
      <el-table :data="selectedReDoTaskList" stripe>
        <el-table-column property="job_id" label="任务编号" width="200"></el-table-column>
        <el-table-column property="step_name" label="出错步骤" width="200"></el-table-column>
        <el-table-column prop="reDoStepId" property="reDoStepId" label="重做步骤">
          <template v-slot="scope">
            <!-- 此处有select无法选中的bug 在@change中解决 -->
            <el-select @change="change"  placeholder="请选择步骤" v-model="scope.row.reDoStepId">
                <el-option v-for="item in scope.row.reDoStepsList" :key="item.id" :label="item.step_name" :value="item.id"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="reDoError">重 做</el-button>
      </span>
    </el-dialog>
  </el-scrollbar>
</template>

<script>
  import 'echarts/lib/chart/line'
  export default {
    data () {
      return {
        ErrorForm: {
          job_id:'',
          satellite_name:'-1',
          product_id:'',
          scene_no:'',
          orbit_no:'',
          province_name:'-1',
          step_name:'-1',
          finished_time:'',
        },
        ALL:{
            label:'全部',
            satellite_name:'-1',
            code:'-1',
            id:'-1',
        },
        // 用户勾选重做任务列表数据
        checkBoxData: [],
        CluOptions:[],
        ProOptions:[],
        StepOptions:[],
        tableData:[],
        currentPage: 1, // 当前页码
        total: 2000, // 总条数
        pageSize: 50, // 每页的数据条数
        // 是否显示选择重做任务步骤对话框
        dialogVisible : false,
        // 用户选择的重做任务列表数据
        selectedReDoTaskList:[]
      }
    },
    mounted(){
      this.getAllsatellite();
      this.getAllprovince();
      this.getAllstep();
      this.getAllErrorList();
    },
    methods: {
      // Vue2.x BUG Tbale的Watch在Select变化后不生效问题
      // 强行修改table绑定的数据，触发watch
      change(){
        this.selectedReDoTaskList.push({reDoStepId : -1})
        this.selectedReDoTaskList.splice(this.selectedReDoTaskList.length-1,1)
        //this.$forceUpdate()
      },
        //消息提示
      showMessage(type,message){
        this.$message({
          type: type,
          message: message
        });
      },
        //分页功能
        handleSizeChange (val) {
            console.log(`每页 ${val} 条`)
            this.currentPage = 1
            this.pageSize = val
        },
        handleCurrentChange (val) {
            console.log(`当前页: ${val}`)
            this.currentPage = val
        },
      //复选框取值
      changeFun(val) {
          this.checkBoxData = val;
          // this.showMessage('success','点击');
        },
        //卫星下拉框
        async getAllsatellite(){
            const {data:result} = await this.$http.get('ErrorDispose/Allsatellite');
            //console.log(result);
            this.CluOptions = result
        },
        //省份下拉框
        async getAllprovince(){
            const {data:result} = await this.$http.get('ErrorDispose/Allprovince');
            //console.log(result);
            this.ProOptions = result;
        },
        //步骤下拉框
        async getAllstep(){
            const {data:result} = await this.$http.get('ErrorDispose/Allstep');
            //console.log(result);
            this.StepOptions = result;
        },
        //获取全部错误数据
      async getAllErrorList(){
        const {data:result} = await this.$http.get('ErrorDispose/ErrorDisPoseData');
        console.log(result);
        this.tableData = result;
      },
        //错误数据按条件查询提交
      submitNodeForm(){
        this.getErrorList()
          this.showMessage('success','查询成功');
      },
        //错误数据按条件查询实现
        async getErrorList(){
            var job_id = this.ErrorForm.job_id
            var product_id = this.ErrorForm.product_id
            var scene_no= this.ErrorForm.scene_no
            var orbit_no= this.ErrorForm.orbit_no
            if(job_id=='')job_id = '-1';
            if(product_id=='')product_id = '-1';
            if(scene_no=='')scene_no = '-1';
            if(orbit_no=='')orbit_no = '-1';
            var url = 'ErrorDispose/SearchErrorDisPoseData?jobId='+job_id+'&productId='+product_id+
                    '&sceneNo='+scene_no+'&orbitNo='+orbit_no+'&satelliteName='+this.ErrorForm.satellite_name
                    +'&provinceId='+this.ErrorForm.province_name+'&stepId='+this.ErrorForm.step_name
            // this.showMessage('success',url);
            const {data:result} = await this.$http.get(url);
            //console.log(result);
            this.tableData = null;
            this.tableData = result;
            this.currentPage = 1

        },
        //点击页面上的重做按钮
        UpdateError(){
          this.selectedReDoTaskList = this.checkBoxData
          if(this.selectedReDoTaskList.length == 0){
            return
          }
          // 添加步骤id数据
          this.selectedReDoTaskList.forEach(v=>{
            v.reDoStepId = this.findStepIdByStepName(v.step_name)
            // 可以选择的重做列表数据 用于填充下拉框
            v.reDoStepsList = this.getEnableReDoStepList(v.reDoStepId)
          })
          console.log(this.selectedReDoTaskList);
          // 显示选择重做步骤对话框
          this.dialogVisible = true
          /* //复选框值在this.checkBoxData里,如第一个的job_id为this.checkBoxData[0].job_id
          for(var i=0;i<this.checkBoxData.length;i++){
              //this.showMessage('success',this.checkBoxData[i].job_id);
              const {data:result} = await this.$http.get('ErrorDispose/redo?jobId=' + this.checkBoxData[i].job_id);
              //console.log(result);
              if(!result){
                this.$message.error('jobID:' + this.checkBoxData[i].job_id + '任务重做失败！');
              }else{
                this.$message.success('jobID:' + this.checkBoxData[i].job_id + '任务重做成功！');
              }
              // 重做后重新查询
              this.getErrorList();
          } */

            // this.showMessage('success','此功能暂未实现');
        },
        // 根据步骤名称返回步骤id
        findStepIdByStepName(name){
          let id = -1
           this.StepOptions.forEach(v=>{
             if(v.step_name == name){
               id = v.id
               return
             }
           }) 
           return id
        },
        // 剔除出错步骤之后的步骤
        getEnableReDoStepList(stepId){
          let list = this.StepOptions
          list = list.filter(({id})=>id <= stepId)
          return list
        },// 重做 对话框中的重做按钮
        async reDoError(){
          // 隐藏对话框
          this.dialogVisible = false
          
          for(var i=0;i<this.selectedReDoTaskList.length;i++){
            console.log(this.selectedReDoTaskList[i]);
              //this.showMessage('success',this.checkBoxData[i].job_id);
              const {data:result} = await this.$http.get('ErrorDispose/redo?jobId=' 
                    + this.selectedReDoTaskList[i].job_id + '&reDoStepId=' + this.selectedReDoTaskList[i].reDoStepId);
              //console.log(result);
              if(!result){
                this.$message.error('jobID:' + this.selectedReDoTaskList[i].job_id + '任务重做失败！');
              }else{
                this.$message.success('jobID:' + this.selectedReDoTaskList[i].job_id + '任务重做成功！');
              }
              // 重做后重新查询
              this.getErrorList();
          }
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
