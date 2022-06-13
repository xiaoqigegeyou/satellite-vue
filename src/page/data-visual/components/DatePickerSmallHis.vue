<!---  点击历史查询时显示的日期选择器 --->
<template>
   <el-row>
        
         <el-date-picker
          v-model="dateValue"
          size="small"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期" >
        </el-date-picker>
        &emsp;&emsp; &emsp;&emsp;
         <el-button type="primary" size="small" icon="el-icon-search" @click='reverseMessage'>查找</el-button>
    </el-row>
</template>

<script>
export default {
    props:['dateValues'],
  data () {
      const now_status ={
          SUCCEEDED:'success',
          FAILED:'error',
          RUNNING:'finish'
      }
      return {
          now_status,
          tableData: {},
          active:1,
          ruleForm: {
              region: 'now',
          },
          //查询时间
          dateValue:this.dateValues,
      }
  },
  methods: {
      showMessage(type,message){
          this.$message({
              type: type,
              message: message
          });
      },
    reverseMessage () {
        // this.showMessage('success',this.dateValues);
        this.$emit('getData', this.dateValue)
    }
  },
    mounted () {
        /* var timestamp = Date.parse(new  Date());
          this.getDate([timestamp,timestamp]); */
        //设置默认时间
        // this.setDefaultDate();
    },
}
</script>
