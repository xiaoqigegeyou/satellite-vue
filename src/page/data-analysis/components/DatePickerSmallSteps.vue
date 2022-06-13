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
        end-placeholder="结束日期"
      >
      </el-date-picker>
      &emsp;&emsp; &emsp;&emsp;
      步驟：
      <el-select v-model="step" placeholder="请选择">
        <el-option value="-1" label="全部步骤"></el-option>
        <el-option
          v-for="item in stepList"
          :key="item.id"
          :label="item.step_name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      &emsp;&emsp;
      节点：
      <el-select v-model="node" multiple placeholder="请选择"  :disabled="nodeSelectDisabled" >
        <el-option
          v-for="item in nodeList"
          :key="item.id"
          :label="item.name"
          :value="item.domain"
        >
        </el-option>
      </el-select>
        &emsp;&emsp; 
      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="reverseMessage"
        >查找</el-button
      >
      &emsp;&emsp; 
      <el-button type="success" size="small" icon="el-icon-tickets" @click='handleSeeReport'>查看分析报告</el-button>
    </el-card>
  </el-row>
</template>

<script>
export default {
          props:{
            nodeSelectDisabled:false
        },
  data () {
    return {
      stepList:[],
      // 选择的时间
      dateValues:  [1612108800000, 1612713600000],
      step: '',
      nodeList:[],
       node: [],
    }
  },
  mounted(){
    // 获取步骤列表的数据
    this.getStepsListData(),
     this.getNodesListData()
  },
  methods: {
    // 点击查看分析报告按钮
    handleSeeReport(){
      this.$emit('handleSeeReport')
    },
    reverseMessage () {
      this.$emit('getDate', this.dateValues,this.step,this.node)
    },
    async getStepsListData(){
      const {data:response} =  await this.$http.get('StepConfig/AllStep');
      console.log(response);
      this.stepList = response;
      // 默认选中步骤的第一项
      this.step = '-1';
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
  },
  watch:{
    // 监听步骤变化 当步骤时pp系统时 触发父组件函数
    step(newValue,oldValue){
      this.$emit('handlePPStep',newValue);
    }
  }
}
</script>
