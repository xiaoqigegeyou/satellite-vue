<!---  点击省份查询时显示的日期选择器 --->
<template>
   <el-row>
       圈号:
       <el-input v-model="orbit_no" style="width: 15%;" clearable></el-input>
       景号：
       <el-input v-model="scene_no" style="width: 15%;" clearable></el-input>
       产品号：
       <el-input v-model="product_no" style="width: 15%;" clearable></el-input>
       省份：
       <el-select v-model="province_no" multiple placeholder="请选择" style="width: 15%">
          <el-option
            v-for="item in provinceList"
            :key="item.id"
            :label="item.province_name"
            :value="item.code">
          </el-option>
        </el-select>
       &nbsp;&nbsp;&nbsp;
       <el-button type="primary" size="small" icon="el-icon-search" @click='reverseMessage' style="width: 15%;">查找</el-button>
    </el-row>
</template>

<script>
export default {
  data () {

    return {
        //条件查询值
        orbit_no:'',
        scene_no:'',
        product_no:'',
        province_no: [],
        // 省份
        provinceList:[]
    }
  },
  methods: {
    reverseMessage () {
      this.$emit('getData', this.orbit_no,this.scene_no,this.product_no,this.province_no)
    },
    async getProvinceList(){
      const {data:response} =  await this.$http.get('ProvinceConfig/AllProvinceInfo');
      console.log(response);
      this.provinceList = response;
    }
  },
  mounted(){
    this.getProvinceList()
  }
}
</script>
