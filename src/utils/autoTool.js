
export function autoHover(myChart, option, num, time) {
    var defaultData = { // 设置默认值
      time: 3000,
      num: 14
    };
    if (!time) {
      time = defaultData.time;
    }
    if (!num) {
      num = defaultData.num;
    }
  
    var count = 0;
    var timeTicket = 0;
  
  
    // 清除定时器
    function clearLoop() {
      if (timeTicket) {
        clearInterval(timeTicket);
        timeTicket = 0;
      }
  
      myChart.off('mousemove', stopAutoShow);
      myChart.getZr().off('mousemove', zRenderMouseMove);
      // myChart.getZr().off('globalout', zRenderGlobalOut);
    }
  
    // 关闭轮播
    function stopAutoShow() {
      if (timeTicket) {
        clearInterval(timeTicket);
        timeTicket = 0;
      }
    }
  
    function zRenderMouseMove(param) {
      if (param.event) {
        // 阻止canvas上的鼠标移动事件冒泡
        // param.event.cancelBubble = true;
      }
  
      stopAutoShow();
    }
  
  
    timeTicket && clearInterval(timeTicket);
    timeTicket = setInterval(function() {
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0 // serieIndex的索引值   可以触发多个
      });
      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: count
      });
      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: count
      });
      count++;
      if (count >= num) {
        count = 0;
      }
    }, time);
    myChart.on('mouseover', function(params) {
      clearInterval(timeTicket);
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0
      });
      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: params.dataIndex
      });
      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: params.dataIndex
      });
    });
  
    myChart.on('mouseout', function() {
      timeTicket && clearInterval(timeTicket);
      timeTicket = setInterval(function() {
        myChart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0 // serieIndex的索引值   可以触发多个
        });
        myChart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: count
        });
        myChart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: count
        });
        count++;
        if (count >= 14) {
          count = 0;
        }
      }, 3000);
    });
    return {
      clearLoop: clearLoop
    };
  }