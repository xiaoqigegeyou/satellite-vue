<template>
  <div class="left-chart-1">
    <dv-border-box-7>
      <div class="lc1-header">平均处理时间排名</div>
      <div class="lc1-details">总均值<span>{{average}} s</span></div>
    </dv-border-box-7>
    <dv-decoration-2 style="height: 10px" />
    <dv-border-box-7>
      <dv-scroll-ranking-board
        :config="config"
        style="width: 326px; height: 238px"
      />
    </dv-border-box-7>
    <dv-decoration-2 style="height: 10px" />
  </div>
</template>

<script>
export default {
  name: "LeftChart1",
  data() {
    return {
    average: 0.0,
      config: {
        data: [],
        rowNum: 8,

        unit: "ms",
      },
    };
  },
  created() {
    this.getTaskTimeData();
  },
  mounted() {
  
    this.$nextTick(() => {
      setInterval(this.getTaskTimeData, 60000*2);
    });
  },
  methods: {
    async getTaskTimeData() {
  
 //this.config.data=[{"name":"gpu01","value":500965.62},{"name":"gpu01","value":500965.62}]
     const { data: result }= await this.$http.get("charts/main/time")
        console.log("左一刷新");
         var  res = result
        //  console.log(res.length);
         var avg=0;
        for(var i=0;i<res.length;i++){
         avg+= res[i].value;
        }
        avg=avg/res.length/1000
         this.average=parseFloat(avg).toFixed(2)
        // console.log(avg);
        this.config = {
          ...this.config,
          data: res
        }
     
      
    },
  },
};
</script>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
}
.left-chart-1 {
  width: 100%;
  height: 50%;
  display: flex;
  flex-grow: 0;
  flex-direction: column;

  .lc1-header {
    text-align: center;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    margin-bottom: 20px;
  }

  .lc1-details {
    height: 40px;
    font-size: 16px;
    display: flex;
    align-items: center;
    text-indent: 20px;

    span {
      color: #3de7c9;
      font-weight: bold;
      font-size: 35px;
      margin-left: 20px;
    }
  }

  .lc1-chart {
    flex: 1;
  }
}
</style>
