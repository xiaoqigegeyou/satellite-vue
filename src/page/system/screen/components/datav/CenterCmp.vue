<template>
  <div class="center-cmp">
    <div class="cc-header">
      <dv-decoration-1 style="width: 200px; height: 50px" />
      <div>Hadoop任务数监控</div>
      <dv-decoration-1 style="width: 200px; height: 50px" />
    </div>

    <div class="cc-details">
      <div>当日任务处理总数</div>
      <div class="card" v-for="(item, i) in list" :key="i">{{ item }}</div>
    </div>

    <div class="cc-main-container">
      <div class="ccmc-left">
        <!-- <div class="station-info">
          流动资产
          <span style="font-size:24px">{{ centerCmpData.assetLiability.currentAssetsTotal }}元</span>
        </div> -->

        <div class="station-info">
          成功任务数
          <span style="font-size: 24px">{{ successTaskCount }}个</span>
        </div>
      </div>

      <!-- <dv-active-ring-chart class="ccmc-middle" :config="config" /> -->
      <dv-decoration-9 style="width: 340px; height: 340px" :dur="dur">
        <div style="weight: 70px; text-align: center">
          <div
            class="dv"
            style="color: #19f2d7; font-weight: bold; font-size: 35px"
          >
            {{ getPercentage }}
          </div>

          <div style="font-size: 25px">成功率</div>
        </div>
      </dv-decoration-9>

      <div class="ccmc-right">
        <div class="station-info">
          <span style="font-size: 24px">{{ failTaskCount }}个</span>
          失败任务数
        </div>
        <!-- <div class="station-info">
          <span style="font-size:20px">{{ centerCmpData.assetLiability.totalNonCurrentLiabilities }}元</span>
          失败任务数
        </div> -->
      </div>

      <!-- <LabelTag :config="labelConfig"/> -->
    </div>
  </div>
</template>

<script>
import LabelTag from "./LabelTag";

export default {
  name: "CenterCmp",
  props: {
    centerCmpData: Object,
  },
  components: {
    LabelTag,
  },
  data() {
    return {
      dur: 4,
      failTaskCount: 0,
      successTaskCount: 0,
      taskCount: 0,
      list: [],
      config: {
        data: [
          {
            name: "成功比例",
            value: 15494,
          },

          {
            name: "失败比例",
            value: 38,
          },
        ],
        color: ["#3de7c9", "#ffc530"],

        // showOriginValue: true,
        lineWidth: 20,
        digitalFlopToFixed: 2,
        radius: "65%",
        activeRadius: "60%",
      },
    };
  },
  created() {
    this.strToArray();
    this.getMainData();
  },
  mounted() {
    this.$nextTick(() => {
      setInterval(this.getMainData, 30000);
    });
  },
  computed: {
    getPercentage() {
      return (
        parseFloat((this.successTaskCount / this.taskCount) * 100).toFixed(2) +
        "%"
      );
    },
  },
  methods: {
    async getMainData() {
      const { data: result } = await this.$http.get("charts/count");

      console.log("主图刷新");

      (this.failTaskCount = result.failTaskCount),
        (this.successTaskCount = result.successTaskCount),
        (this.taskCount = result.taskCount),
        this.strToArray();
    },
    strToArray() {
      //{failTaskCount: 38, successTaskCount: 15494, taskCount: 15532}\

      let n = this.taskCount + "";
      this.list = n.split("");
      // console.log(this.list);
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

.center-cmp {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  display: flex;
  flex-direction: column;

  .cc-header {
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 30px;
  }

  .cc-details {
    height: 120px;
    display: flex;
    justify-content: center;
    font-size: 32px;
    align-items: center;

    .card {
      background-color: rgba(4, 49, 128, 0.6);
      color: #08e5ff;
      height: 70px;
      width: 70px;
      font-size: 45px;
      font-weight: bold;
      line-height: 70px;
      text-align: center;
      margin: 10px;
    }
  }

  .cc-main-container {
    position: relative;
    flex: 1;
    display: flex;

    .ccmc-middle {
      width: 70%;
      height: 20%;

      .active-ring-name {
        font-size: 20px !important;
      }
    }

    .ccmc-left,
    .ccmc-right {
      width: 40%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 24px;

      span {
        font-size: 40px;
        font-weight: bold;
      }

      .station-info {
        height: 100px;
        display: flex;
        align-items: center;
        left: 10%;
      }
    }

    .ccmc-left {
      align-items: center;

      span {
        margin-left: 20px;
      }
    }

    .ccmc-right {
      align-items: center;

      span {
        margin-right: 20px;
      }
    }
  }

  .label-tag {
    position: absolute;
    width: 500px;
    height: 30px;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
