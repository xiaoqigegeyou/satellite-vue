<!-- 首页-->
<template>
		<section class="data_section" ref="data_section"> 
			<div>
        <el-row style="height:100%">
          <el-col :span="7" style="height:600px">
            <chart :options="left" :auto-resize="true" v-loading="loading1"></chart>
          </el-col>
          <el-col :span="10" style="height:600px" v-loading="loading2">
            <el-row  style="height:400px">
              <chart :options="cent" :auto-resize="true"></chart></el-row>
              <div align="center">
                  <br><br><br><br>
                  <!-- <el-button type="primary" size="midium" onclick="location='http://172.13.24.103:3000'">跳转数据大屏</el-button> -->
                    <el-button type="primary" size="midium" onclick="location='/#/screen/errorDispose'">跳转数据大屏</el-button>

              </div>
            <el-row>

            </el-row>
          </el-col>
          <el-col :span="7" style="height:600px">
            <chart :options="right" :auto-resize="true" v-loading="loading3"></chart>
          </el-col>
        </el-row>
      </div>
		</section>
</template>

<script>
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
    export default {
    	data(){
    		return {

                value1: '',
                left: {},
                cent: {},
                right: {},
                loading1: true,
                loading2: true,
                loading3: true,
    		}
    	},
    	components: {
		 
		},	
		created(){
		},
    	mounted(){
    	    this.getDate()
		},
    methods: {
        getDate(){
            this.LeftData();
            this.CenterData();
            this.RightData();
        },
        showMessage(type,message){
            this.$message({
                type: type,
                message: message
            });
        },
        async LeftData(){
            //加载中
            this.loading1 = true;
            const {data:result} = await this.$http.get('Index/LeftDate');
            console.log(result);
            var ProvinceList = [];
            var ProvinceNumberList = [];
            var ProvinceSuceedList = [];
            var ProvinceErrorList = [];
            for(let i=0;i<result.length;i++){
                var element = result[i];
                ProvinceList.push(element.province_name);
                ProvinceNumberList.push(element.num);
                ProvinceSuceedList.push(element.success);
                ProvinceErrorList.push(element.error);
            }
            this.left = {
                backgroundColor: '',
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    textStyle: {
                        color: 'black'
                    },
                    data: ['总数', '成功数', '错误数']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'value',
                        inverse: true,
                        boundaryGap: [0.01, 0],
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#000000'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false,
                            interval:0,
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        inverse: true,
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            show: false

                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            inside: false,
                            show: true,
                            textStyle: {
                                color: '000000',
                                fontWeight: 'bolder',
                                fontSize: '16'
                            },
                            interval: 0
                        },
                        data: ProvinceList
                    }
                ],
                series: [
                    {
                        name: '总数',
                        type: 'bar',
                        barMaxWidth: 30,
                        label: {
                            normal: {
                                show: false,
                                position: 'insideRight'
                            }
                        },
                        itemStyle: {
                            normal: {
                                show: true,
                                color: '#4569bd',
                                barBorderRadius: 50,
                                borderWidth: 0
                            }
                        },
                        zlevel: 2,
                        barWidth: '20%',
                        data: ProvinceNumberList
                    },
                    {
                        name: '成功数',
                        type: 'bar',
                        barMaxWidth: 30,
                        label: {
                            normal: {
                                show: false,
                                position: 'insideRight'
                            }
                        },
                        itemStyle: {
                            normal: {
                                show: true,
                                color: '#6d93f5',
                                barBorderRadius: 50,
                                borderWidth: 0
                            }
                        },
                        zlevel: 2,
                        barWidth: '20%',
                        data: ProvinceSuceedList
                    },
                    {
                        name: '失败数',
                        type: 'bar',
                        barMaxWidth: 30,
                        label: {
                            normal: {
                                show: false,
                                position: 'insideRight'
                            }
                        },
                        itemStyle: {
                            normal: {
                                show: true,
                                color: '#89d9a7',
                                barBorderRadius: 50,
                                borderWidth: 0
                            }
                        },
                        zlevel: 2,
                        barWidth: '20%',
                        data: ProvinceErrorList
                    }
                ],

            }
            //取消加载中
            this.loading1 = false;
        },
        async CenterData() {
            //加载中
            this.loading2 = true;
            const {data: result} = await this.$http.get('Index/CenterDate');
            const {data: result1} = await this.$http.get('Index/RunDate');
            var CenterList=[
                { value: result[0].error, name: '失败' },
                { value: result1[0].runing, name: '正在处理' },
                { value: result[0].success, name: '成功' }
            ]
            this.cent = {
                title: {
                    text: '数据处理',
                    left: 'center',
                    textStyle: {
                        color: '#000',
                        fontSize: 36
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [
                    {
                        name: '数据处理',
                        type: 'pie',
                        radius: '60%',
                        center: ['50%', '60%'],
                        data: CenterList,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    formatter: '{b} : {c} '
                                }
                            }
                        }
                    }
                ]
            }
            this.loading2 = false;
        },
        async RightData(){
            //加载中
            this.loading3 = true;
            const {data:result} = await this.$http.get('Index/RightDate');
            console.log(result);
            var MapList = [];
            var MapNumberList = [];
            var MapSuceedList = [];
            var MapErrorList = [];
            for(let i=0;i<result.length;i++){
                var element = result[i];
                MapList.push(element.name);
                MapNumberList.push(element.num);
                MapSuceedList.push(element.success);
                MapErrorList.push(element.error);
            }
            this.right = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    textStyle: {
                        color: '#000'
                    },
                    data: ['总数', '成功数','错误数']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },

                xAxis: {
                    type: 'value',
                    boundaryGap: [0.01, 0],
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        interval:0,
                    }
                },
                yAxis: {
                    type: 'category',
                    splitLine: {
                        show: false
                    },
                    axisLine: {
                        show: false

                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        inside: false,
                        show: true,
                        textStyle: {
                            color: '000000',
                            fontWeight: 'bolder',
                            fontSize: '16'
                        },
                        interval: 0
                    },
                    data: MapList
                },
                series: [
                    {
                        name: '总数',
                        type: 'bar',
                        barMaxWidth: 30,
                        itemStyle: {
                            normal: {
                                show: false,
                                color: '#f7734e',
                                barBorderRadius: 50,
                                borderWidth: 0
                            }
                        },
                        zlevel: 2,
                        barWidth: '20%',
                        label: {
                            normal: {
                                show: false,
                                position: 'insideRight'
                            }
                        },
                        data: MapNumberList
                    },
                    {
                        name: '成功数',
                        type: 'bar',
                        barWidth: '20%',
                        barMaxWidth: 30,
                        itemStyle: {
                            normal: {
                                show: false,
                                color: '#96d668',
                                barBorderRadius: 50,
                                borderWidth: 0
                            }
                        },
                        zlevel: 2,
                        label: {
                            normal: {
                                color: 'black',
                                show: false,
                                position: 'insideRight'
                            }
                        },
                        data: MapSuceedList
                    },
                    {
                        name: '错误数',
                        type: 'bar',
                        barWidth: '20%',
                        barMaxWidth: 30,
                        itemStyle: {
                            normal: {
                                show: false,
                                color: '#f66666',
                                barBorderRadius: 50,
                                borderWidth: 0
                            }
                        },
                        zlevel: 2,
                        label: {
                            normal: {
                                color: 'black',
                                show: false,
                                position: 'insideRight'
                            }
                        },
                        data: MapErrorList
                    }]
            }
            this.loading3 = false;
        }
    }
    }
</script>

<style lang="less" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
