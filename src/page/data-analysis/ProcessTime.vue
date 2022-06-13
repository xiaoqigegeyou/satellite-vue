<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- :lazy=true 开启延迟加载-->
      <el-tab-pane label="任务步骤" name="first" :lazy="true">
        <Steps></Steps>
      </el-tab-pane>
      <el-tab-pane label="省市" name="second" :lazy="true">
        <Province></Province>
      </el-tab-pane>
      <el-tab-pane label="卫星" name="third" :lazy="true">
        <Satellite></Satellite>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SingleNode from "./processtime/SingleNode";
import Steps from "./processtime/Steps";
import Province from "./processtime/Province";
import Satellite from "./processtime/Satellite";
export default {
  data() {
    return {
      activeName: "first",
    };
  },
  components: {
    SingleNode,
    Steps,
    Province,
    Satellite,
  },
  methods: {
    // 切换不同的标签页时会触发
    handleClick() {},
  },
};
</script>

<style lang="scss" scoped>
.el-tabs {
  background: #fff;
}
</style>