<!-- 节点状态 -->
<template>
  <div>
    <el-row>
       <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>节点状态可视化</el-breadcrumb-item>
    </el-breadcrumb>
      <el-col :span="4">
        <el-aside width="96%"  style="background-color: #fff;height:530px; overflow-x: hidden;">
          <el-menu :default-openeds="['1']">
            <el-submenu index="1" >
            <template slot="title"><i class="el-icon-message"></i>集群节点</template>
              <el-menu-item index="1-1">节点1</el-menu-item>
              <el-menu-item index="1-2">节点2</el-menu-item>
          </el-submenu>
          </el-menu>
        </el-aside>
      </el-col>
      <el-col :span="18">
          <DatePicker @getDateExtent="hahahah"></DatePicker>
          <el-row class="top" style="background-color: #fff;height:100%;min-height:445px;">
哈哈哈
          </el-row>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import 'echarts/lib/chart/line'
export default {
  data () {
    return {
      dateValue: ''

    }
  },
  methods: {
    hahahah (dateValue) {
      this.dateValue = dateValue
      console.log(this.dateValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.top{
  margin-top: 10px;
}
.el-scrollbar__wrap{
  overflow-x: hidden;
}
</style>
