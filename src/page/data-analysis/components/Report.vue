<template>
  <div>
    <el-drawer style="height:100vh"
      :title='title'
      :visible.sync="visible"
      direction="rtl"
      :show-close="false"
    >
      <div class="content" v-html="content">
        
      </div>
    </el-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
        // 将子组件传递来的值变为本地数据
        visible: this.drawer_visible
    };
  },
  props:['title','content','drawer_visible'],
  methods:{
      handleClose(done){
          done()
      }
  },
  watch:{
      // 实现父子组件的双向数据绑定
      drawer_visible(newVal,oldVal){
          this.visible = newVal
      },
      visible(newVal,oldVal){
          this.$emit('updateReportVisable',newVal)
      }
  }
};
</script>
<style lang="scss">
.content{
  padding-left: 20px;
}
/*1.显示滚动条：当内容超出容器的时候，可以拖动：*/
.el-drawer__body {
    overflow: auto;
    /* overflow-x: auto; */
}
 
/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar{
    display: none;
}
</style>