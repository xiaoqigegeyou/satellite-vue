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
         </el-card>
    </el-row>
</template>

<script>
export default {
  data () {
    return {
      dateValues:  [1612108800000, 1612713600000+ 24 * 60 * 60 * 1000 - 1]
 

    }
  },
  methods: {
    reverseMessage () {
      this.$emit('getDate', this.dateValues)
    }
  }
}
</script>
