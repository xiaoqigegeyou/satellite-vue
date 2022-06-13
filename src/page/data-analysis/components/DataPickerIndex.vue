<!---  卡片式日期选择器 --->
<template>
   <el-row>
        <el-card shadow="always">
         <el-date-picker
          v-model="dateValues"
          size="small"
          type="daterange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期" >
        </el-date-picker>
        &emsp;&emsp; &emsp;&emsp;
         <el-button type="primary" size="small" icon="el-icon-search" @click='reverseMessage'>查找</el-button>
         <el-button type="success" size="small" icon="el-icon-tickets" @click='handleSeeReport'>查看分析报告</el-button>
         </el-card>
    </el-row>
</template>

<script>
export default {
  data () {
    return {
      dateValues:  [1612108800000, 1612713600000]
    }
  },
  methods: {
    reverseMessage () {
      this.$emit('getDate', this.dateValues)
    },
    // 点击查看分析报告按钮
    handleSeeReport(){
      this.$emit('handleSeeReport')
    }
  }
}
</script>
