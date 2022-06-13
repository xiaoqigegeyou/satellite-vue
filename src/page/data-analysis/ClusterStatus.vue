<template>
  <div>
    <el-tabs v-model="activeName">
      <!-- :lazy=true 开启延迟加载-->
      <el-tab-pane label="Application数量" name="first" :lazy="true">
        <Application></Application>
      </el-tab-pane>
      <el-tab-pane label="内存&虚拟核" name="second" :lazy="true">
        <Memory></Memory>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>
<style scoped>
.el-tabs {
  background: #fff;
}
</style>
<script>
import Application from "./clusterstatus/Application";
import Memory from "./clusterstatus/Memory";
import Node from "./clusterstatus/Node";
import VirtualCore from "./clusterstatus/VirtualCore";
export default {
  data() {
    return {
      activeName: "first",
    };
  },
  components: {
    Application,
    Memory,
    Node,
    VirtualCore,
  },
};
</script>