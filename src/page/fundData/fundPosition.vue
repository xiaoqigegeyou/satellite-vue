<template>
    <div class="fillcontain">
        <div class="fillcontainer" ref="fillcontainer">
          <el-row>
            <el-col :span="16">
              <div id="fundPosition" class="echartsPosition"></div> 
            </el-col>
            <el-col :span="8">
              <chart  ref="pushDate" :options="pushDate" :auto-resize="true"></chart>
            </el-col>
          </el-row>
           
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import '../../../node_modules/echarts/map/js/china.js';
    import '../../../node_modules/echarts/theme/roma.js';

    export default {
        data(){
          return {
            chart:null,
            pushDate:{
              title: {
                  text: '数据传输',
                  left: 'center'
              },
              tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'shadow'
                  }
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
              },
              xAxis: {
                  type: 'value',
                  boundaryGap: [0, 0.01]
              },
              yAxis: {
                  type: 'category',
                  data: ['山东', '新疆', '内蒙古', '甘肃', '青海', '西藏']
              },
              series: [
                  {
                      type: 'bar',
                      data: [19, 23, 31, 12, 13,18],
                      itemStyle: {
                      normal: {
          　　　　　　　　//这里是重点
                          color: function(params) {
                            //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                              var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83', '#ca8622'];
                              return colorList[params.dataIndex]
                          }
                      }
                   }
                  }
              ]
            }
          }
        },
       methods: {
          randomData() {
             return Math.round(Math.random()*200);
          },
          drawMap (id) {
            // echarts.init(),初始化数据      
            if ( this.chart &&  this.chart.dispose) { 
               this.chart.dispose(); 
            }   
            this.chart = echarts.init(document.getElementById(id),'roma');
            this.chart.setOption({
                title: {
                    text: '省份数据传输情况',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data:['总传输数']
                },
                visualMap: {
                    min: 0,
                    max: 200,
                    left: 'left',
                    top: 'bottom',
                    text: ['高','低'],           // 文本，默认为数值文本
                    calculable: true
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        dataView: {readOnly: false},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                series: [
                    {
                        name: '传输数量',
                        type: 'map',
                        mapType: 'china',
                        roam: false,
                        label: {
                            normal: {
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        data:[
                            {name: '北京',value: this.randomData() },
                            {name: '天津',value: this.randomData() },
                            {name: '上海',value: this.randomData() },
                            {name: '重庆',value: this.randomData() },
                            {name: '河北',value: this.randomData() },
                            {name: '河南',value: this.randomData() },
                            {name: '云南',value: this.randomData() },
                            {name: '辽宁',value: this.randomData() },
                            {name: '黑龙江',value: this.randomData() },
                            {name: '湖南',value: this.randomData() },
                            {name: '安徽',value: this.randomData() },
                            {name: '山东',value: this.randomData() },
                            {name: '新疆',value: this.randomData() },
                            {name: '江苏',value: this.randomData() },
                            {name: '浙江',value: this.randomData() },
                            {name: '江西',value: this.randomData() },
                            {name: '湖北',value: this.randomData() },
                            {name: '广西',value: this.randomData() },
                            {name: '甘肃',value: this.randomData() },
                            {name: '山西',value: this.randomData() },
                            {name: '内蒙古',value: this.randomData() },
                            {name: '陕西',value: this.randomData() },
                            {name: '吉林',value: this.randomData() },
                            {name: '福建',value: this.randomData() },
                            {name: '贵州',value: this.randomData() },
                            {name: '广东',value: this.randomData() },
                            {name: '青海',value: this.randomData() },
                            {name: '西藏',value: this.randomData() },
                            {name: '四川',value: this.randomData() },
                            {name: '宁夏',value: this.randomData() },
                            {name: '海南',value: this.randomData() },
                            {name: '台湾',value: this.randomData() },
                            {name: '香港',value: this.randomData() },
                            {name: '澳门',value: this.randomData() }
                        ]
                    }
                ]
            });
          }
        },
        mounted(){
              this.$nextTick(function() {
                this.$refs.fillcontainer.style.height = (document.body.clientHeight - 160)+'px'
                this.drawMap('fundPosition');
                var that = this;
                var resizeTimer = null;
                // 保证页面在放大或缩小时，也能够动态的显示数据
                window.onresize = function() {
                  if (resizeTimer) clearTimeout(resizeTimer);
                  resizeTimer = setTimeout(function() {
                    that.$refs.fillcontainer.style.height = (document.body.clientHeight - 160)+'px'
                    that.drawMap('fundPosition');
                  }, 100);
                }
            })
        }

    }
</script>

<style lang="less" scoped>
.echartsPosition{
  height: 500px;
  width: 100%;
}
.echarts{
  height: 500px;
  width: 100%;
}
</style>


