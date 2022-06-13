import axios from 'axios'
import { forEach } from 'core-js/fn/array';

var data = new Array(4);
//右一 任务统计
var taskStaData = [];
var taskStaX = [];

//任务量统计
let taskSta = {
  title: {
    text: "景数统计（每日）",
    left: "center",
    bottom: 0
  },
  color: ["#3398DB"],
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
    },
  },
  grid: {
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      data: taskStaX, //TODO   日期
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        show: true,
        interval: 0,
        rotate: 40,
        textStyle: {
          color: "#000",
        },
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      axisLabel: {
        show: true,
        textStyle: {
          color: "#000",
        },
      },
    },
  ],
  series: [
    {
      name: "景数",
      type: "bar",
      barWidth: "60%",
      label: {
        normal: {
          show: true,
          position: "top",
        },
      },
      data: taskStaData, //TODO
    },
  ],
}; 

var taskNodeDisData = [
  { value: 3, name: "gpu09" },
  { value: 1, name: "gpu04" },
  { value: 2, name: "gpu21" },
  { value: 5, name: "gpu30" },
  { value: 8, name: "gpu27" },
];

//处理步骤数据
var taskPhaseStaData = [];
//卫星分类数据
var satelliteDisStaData = [
  
];

function getData(startTime,endTime) {
  //getTaskStaData(startTime,endTime);
}

//任务节点分布
var taskNodeDis = {
  title: {
    text: "任务节点分布",
    left: "center",
    bottom: 0
  },
  tooltip: {
    trigger: "item",
    formatter: "任务量：{b} : {c} ({d}%)",
  },
  series: [
    {
      name: "节点分布",
      type: "pie",
      center: ["45%", "50%"],
      radius: '60%',
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(255, 255, 255, 0.5)",
        },
      },
      label: {
        emphasis: {
          show: true,
          textStyle: {
            fontSize: "16",
          },
        },
      },
      data: taskNodeDisData, //TODO
    },
  ],
};



//任务阶段统计
let taskPhaseSta = {
  title: {
    text: "任务步骤统计",
    left: "center",
    bottom: 0
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },

  grid: {
    left: "3%",
    right: "8%",
    bottom: "10%",
    top: "10%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
    boundaryGap: [0, 0.01],
    axisLabel: {
      show: true,
      textStyle: {
        color: "#000",
      },
    },
  },
  yAxis: {
    type: "category",
    data: [
      
    ],
    axisLabel: {
      show: true,
      textStyle: {
        color: "#000",
      },
    },
  },
  series: [
    {
      name: "数量",
      type: "bar",
      label: {
        normal: {
          show: true,
          position: "right",
        },
      },
      data: taskPhaseStaData,
    },
  ],
};

//卫星分布统计
let satelliteDisSta = {
  title: {
    text: "景数卫星分布统计",
    left: "center",
    bottom: 0
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)",
  },
  series: [
    {
      name: "景数",
      type: "pie",
      radius: ["50%", "70%"],
      center: ["50%", "42%"],
      avoidLabelOverlap: false,
      label: {
        emphasis: {
          show: true,
          textStyle: {
            fontSize: "30",
            fontWeight: "bold",
          },
        },
      },

      data: satelliteDisStaData,
    },
  ],
};




function sayMsg(msg) {

  console.log(msg);
  //获取数据
  var startTime = msg[0];
  var endTime = msg[1];
  //获取数据
  getData(startTime,endTime);

  /* for (var i = 0; i < 7; i++) {
    taskStaData[i] = parseInt(Math.random() * 20);
  } */
  //将数据封装到数组
  data[0] = taskNodeDis;
  data[1] = taskSta;
  data[2] = taskPhaseSta;
  data[3] = satelliteDisSta;

  return data;
}
export { sayMsg,data };
