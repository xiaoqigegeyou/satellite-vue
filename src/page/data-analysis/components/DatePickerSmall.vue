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
      节点：
      <el-select v-model="node" multiple placeholder="请选择">
        <el-option
          v-for="item in nodeList"
          :key="item.id"
          :label="item.name"
          :value="item.domain"
        >
        </el-option>
      </el-select>
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
      dateValues: '',
      nodeList:[],
       node: [],
    }
  },
   mounted(){
    // 获取节点列表的数据
    this.getNodesListData()
  },
  methods: {
    reverseMessage () {
      this.$emit('getDate', this.dateValues,this.node)
    },
    // 点击查看分析报告按钮
    handleSeeReport(){
      this.$emit('handleSeeReport')
    },
      async getNodesListData(){
      const {data:response} =  await this.$http.get('NodeJob/allNode');
      console.log(response);
      this.nodeList = response;
      // 默认选中步骤的第一项
      this.node[0] = this.nodeList[0].domain;
      // 调用父组件的方法
      this.$emit('firstQuery',this.nodeList[0].domain)
    }
  }
}
</script>
