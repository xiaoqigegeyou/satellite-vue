<template>
  <div>
    <!-- 暂时不适用多标签页 -->
    <!-- <el-tabs v-model="activeName">
      <el-tab-pane label="内存占用" name="first" :lazy="true">
        <Memory></Memory>
      </el-tab-pane>
      <el-tab-pane label="虚拟核占用" name="second" :lazy="true">
        <VirtualCore></VirtualCore>
      </el-tab-pane>
    </el-tabs> -->
    <Memory></Memory>
  </div>
</template>


<style scoped>
</style>


<script>
import Memory from "./nodestatus/Memory";
import VirtualCore from "./nodestatus/VirtualCore";
export default {
  data() {
    return {
      activeName: "first",
    };
  },
  components: {
    Memory,
    VirtualCore,
  },
};
</script>