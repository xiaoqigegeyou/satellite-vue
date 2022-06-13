<template>
  <div>
    <el-row>
     <statistics v-bind:flage="error"></statistics>
    </el-row>
  </div>
</template>

<script>
import statistics from './components/statistics.vue'
export default {
  data(){
    return{
      //标记当前的查询状态：FAILED
      error:"FAILED"
    }
  },
  methods:{
  
  },
  components:{
    statistics
  }
}
</script>
