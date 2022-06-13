<template>

  <div id="data-view-plus">

    <dv-full-screen-container>
      <div class="main-header">
        <div class="mh-left"><a></a></div>
        <div class="mh-middle">Hadoop集群状态监控</div>
        
        <div class="mh-right">
          <div style="cursor:pointer;" onclick=" window.location.href = 'javascript:history.go(-1)';">
            <dv-border-box-2
              style="width: 120px; height: 50px; line-height: 50px; text-align:center;margin-left:200px;">
              返回系统
            </dv-border-box-2>
          </div>

        </div>
      </div>

      <dv-border-box-1 class="main-container-plus">
        <dv-border-box-3 class="left-chart-container">

          <Left-Chart-1/>
       
           <Left-Chart-3/>  
 <!--    <Left-Chart-2/> -->
        </dv-border-box-3>

        <div class="right-main-container">
          <div class="rmc-top-container">
            <dv-border-box-3 class="rmctc-left-container">
<!-- <dv-border-box-8 :reverse="true"> -->
              <!--中央图块-->
              <center-cmp :centerCmpData="centerCmpData"/>
<!-- </dv-border-box-8> -->
            </dv-border-box-3>

            <div class="rmctc-right-container">
              <dv-border-box-3 class="rmctc-chart-1">

                <right-chart1/>

              </dv-border-box-3>
              <dv-border-box-4 class="rmctc-chart-2" :reverse="true">

                <Right-Chart-2/>

              </dv-border-box-4>
            </div>
          </div>

          <dv-border-box-4 class="rmc-bottom-container">
            <!--中下图块-->
            <bottom-charts :bottomChartsData="bottomChartsData"/>

          </dv-border-box-4>
        </div>
      </dv-border-box-1>

    </dv-full-screen-container>
  </div>
</template>

<script>
import LeftChart1 from './LeftChart1'
import LeftChart2 from './LeftChart2'
import LeftChart3 from './LeftChart3'

import CenterCmp from './CenterCmp' //中央图块
import BottomCharts from './BottomCharts' //中下图块

import RightChart1 from './RightChart1'
import RightChart2 from './RightChart2'
// import {countStatements, getSysScreen} from "@/api/system/screen";

export default {
  name: 'DataView',
  components: {
    LeftChart1,
    LeftChart2,
    LeftChart3,
    CenterCmp,
    RightChart1,
    RightChart2,
    BottomCharts
  },
  data() {
    return {
      //中央图块数据
      centerCmpData: {
       failTaskCount: 0,
     successTaskCount: 0,
      taskCount: 0 ,
      },
      //中下图块数据
      bottomChartsData: {
        //中下第一个图块数据
        config1: {
          data: [
            {
              name: '货币资金',
              value: 1
            },
            {
              name: '应收账款',
              value: 1
            },
            {
              name: '预付账款',
              value: 1
            },
            {
              name: '存货',
              value: 1
            }
          ],
          color: ['#00baff', '#3de7c9', '#fff', '#ffc530', '#469f4b'],
          radius: '65%',
          activeRadius: '70%'
        },
        //中下第二个图块数据
        config2: {
          data: [
            {
              name: '长期应收款',
              value: 1
            },
            {
              name: '固定资产',
              value: 1
            },
            {
              name: '在建工程',
              value: 1
            },
            {
              name: '无形资产',
              value: 1
            }
          ],
          color: ['#00baff', '#3de7c9', '#fff', '#ffc530', '#469f4b'],
          radius: '65%',
          activeRadius: '70%'
        },
        //中下第三个图块数据
        config3: {
          data: [
            {
              name: '短期借款',
              value: 1
            },
            {
              name: '应付账款',
              value: 1
            },
            {
              name: '预收款项',
              value: 1
            },
            {
              name: '应交税费',
              value: 1
            }
          ],
          color: ['#00baff', '#3de7c9', '#fff', '#ffc530', '#469f4b'],
          radius: '65%',
          activeRadius: '70%'
        },
        //中下第四个图块数据
        config4: {
          data: [
            {
              name: '长期借款',
              value: 1
            },
            {
              name: '长期应付款',
              value: 1
            },
            {
              name: '预计负债',
              value: 1
            },
            {
              name: '递延收益',
              value: 1
            }
          ],
          color: ['#00baff', '#3de7c9', '#fff', '#ffc530', '#469f4b'],
          radius: '65%',
          activeRadius: '70%'
        },
        //中下第一个图块底部标签
        labelConfig1: {
          data: ['货币资金', '应收账款', '预付款项', '存货']
        },
        //中下第二个图块底部标签
        labelConfig2: {
          data: ['长期应收款', '固定资产', '在建工程', '无形资产']
        },
        //中下第三个图块底部标签
        labelConfig3: {
          data: ['短期借款', '应付账款', '预收款项', '应交税费']
        },
        //中下第四个图块底部标签
        labelConfig4: {
          data: ['长期借款', '长期应付款', '预计负债', '递延收益']
        }
      }

    }
  },
  created() {
    // this.getTotalNumber()
    // this.getSysScreen()
    // this.getMainData()
  },
  mounted() {
  },
  methods: {
// 获取中间图
  
    /** 查询财务报表总数 */
    getTotalNumber() {
      countStatements().then(
        response => {
          this.centerCmpData.totalNumber.onesPlace = parseInt(response % 10)
          this.centerCmpData.totalNumber.tensPlace = parseInt((response % 100) / 10)
          this.centerCmpData.totalNumber.hundredsPlace = parseInt((response % 1000) / 100)
          this.centerCmpData.totalNumber.thousandsPlace = parseInt(response / 1000)

        }
      );
    },
    /** 查询资产负债表数据 */
    getSysScreen() {
      getSysScreen().then(
        response => {
          //中央图块数据赋值
          this.centerCmpData.assetLiability.currentAssetsTotal = response.data.currentAssetsTotal //流动资产合计
          this.centerCmpData.assetLiability.totalNonCurrentAssets = response.data.totalNonCurrentAssets //非流动资产合计
          this.centerCmpData.assetLiability.totalAssets = response.data.totalAssets  //资产统计
          this.centerCmpData.assetLiability.totalCurrentLiabilities = response.data.totalCurrentLiabilities  //流动负债合计
          this.centerCmpData.assetLiability.totalNonCurrentLiabilities = response.data.totalNonCurrentLiabilities //非流动负债合计
          this.centerCmpData.config = {
            data: [
              {
                name: '流动资产',
                value: parseFloat(response.data.totalNonCurrentAssets)

              },
              {
                name: '非流动资产',
                value: parseFloat(response.data.totalNonCurrentAssets)
              },
              {
                name: '流动负债',
                value: parseFloat(response.data.totalCurrentLiabilities)
              },
              {
                name: '非流动负债',
                value: parseFloat(response.data.totalNonCurrentLiabilities)
              }
            ],
            color: ['#00baff', '#3de7c9', '#fff', '#ffc530', '#469f4b'],
            lineWidth: 30,
            radius: '55%',
            activeRadius: '60%'
          }

          //中下图块数据赋值
          this.bottomChartsData = {
            //中下第一个图块数据
            config1: {
              data: [
                {
                  name: '货币资金',
                  value: response.data.cash //货币资金
                },
                {
                  name: '应收账款',
                  value: response.data.accountsReceivable, //应收账款
                },
                {
                  name: '预付账款',
                  value: response.data.accountsPrepaid,  //预付账款
                },
                {
                  name: '存货',
                  value: response.data.inventories,  //存货
                }
              ],
              color: ['#00baff', '#3de7c9', '#fff', '#ffc530', '#469f4b'],
              radius: '65%',
              activeRadius: '70%'
            },
            //中下第二个图块数据
            config2: {
              data: [
                {
                  name: '长期应收款',
                  value: response.data.longTermReceivables,  //长期应收款
                },
                {
                  name: '固定资产',
                  value: response.data.fixedAssetsAsset, //固定资产
                },
                {
                  name: '在建工程',
                  value: response.data.constructionInProgress, //在建工程
                },
                {
                  name: '无形资产',
                  value: response.data.intangibleAssets, //无形资产
                }
              ],
              color: ['#00baff', '#3de7c9', '#fff', '#ffc530', '#469f4b'],
              radius: '65%',
              activeRadius: '70%'
            },
            //中下第三个图块数据
            config3: {
              data: [
                {
                  name: '短期借款',
                  value: response.data.shortTermLoan,  //短期借款
                },
                {
                  name: '应付账款',
                  value: response.data.accountsPayable,  //应付账款
                },
                {
                  name: '预收款项',
                  value: response.data.itemReceivedInAdvance,  //预收款项
                },
                {
                  name: '应交税费',
                  value: response.data.taxesPayable, //应交税费
                }
              ],
              color: ['#00baff', '#3de7c9', '#fff', '#ffc530', '#469f4b'],
              radius: '65%',
              activeRadius: '70%'
            },
            //中下第四个图块数据
            config4: {
              data: [
                {
                  name: '长期借款',
                  value: response.data.longTermLoan, //长期借款
                },
                {
                  name: '长期应付款',
                  value: response.data.longTermPayables, //长期应付款
                },
                {
                  name: '预计负债',
                  value: response.data.predictedLiability, //预计负债
                },
                {
                  name: '递延收益',
                  value: response.data.deferredIncome, //递延收益
                }
              ],
              color: ['#00baff', '#3de7c9', '#fff', '#ffc530', '#469f4b'],
              radius: '65%',
              activeRadius: '70%'
            },
            //中下第一个图块底部标签
            labelConfig1: {
              data: ['货币资金', '应收账款', '预付款项', '存货']
            },
            //中下第二个图块底部标签
            labelConfig2: {
              data: ['长期应收款', '固定资产', '在建工程', '无形资产']
            },
            //中下第三个图块底部标签
            labelConfig3: {
              data: ['短期借款', '应付账款', '预收款项', '应交税费']
            },
            //中下第四个图块底部标签
            labelConfig4: {
              data: ['长期借款', '长期应付款', '预计负债', '递延收益']
            }
          }

          // this.centerCmpData.sysScreen.statementsName = response.data.statementsName,//报表名称
          // this.centerCmpData.sysScreen.statementsType = response.data.statementsType,//报表类型
          // this.centerCmpData.sysScreen.statementsDate = response.data.statementsDate,//报表日期
          // this.centerCmpData.sysScreen.totalOwnershipInterest = response.data.totalOwnershipInterest, //所有者权益合计


        }
      );
    }


  }
}
</script>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
}

#data-view-plus {
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
  background-color: #030409;
  color: #fff;

  #dv-full-screen-container {
    background-image: url('./img/bg.png');
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
  }

  .main-header {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .mh-left {
      font-size: 20px;
      color: rgb(1, 134, 187);

      a:visited {
        color: rgb(1, 134, 187);
      }
    }

    .mh-middle {
      font-size: 45px;
    }

    .mh-left, .mh-right {
      width: 450px;
    }
  }

  .main-container-plus {
    height: calc(~"100% - 80px");

    .border-box-content {
      padding: 20px;
      box-sizing: border-box;
      display: flex;
    }
  }

  .left-chart-container {
    width: 22%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    .border-box-content {
      flex-direction: column;
    }
  }

  .right-main-container {
    width: 78%;
    padding-left: 5px;
    box-sizing: border-box;
  }

  .rmc-top-container {
    height: 65%;
    display: flex;
  }

  .rmctc-left-container {
    width: 65%;
  }

  .rmctc-right-container {
    width: 35%;
  }

  .rmc-bottom-container {
    height: 35%;
  }

  .rmctc-chart-1, .rmctc-chart-2 {
    height: 50%;
  }
}
</style>
