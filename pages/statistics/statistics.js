// pages/statistics/statistics.js
import * as echarts from '../../ec-canvas/echarts';
import util from '../../utils/util.js'
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    language: [],
    username: "lzx2005",
    ec: {
      lazyLoad: true,
    },
    calendar: {
      lazyLoad: true,
    },
    isLoaded: false,
    isDisposed: false,
    updated: 0,
    calenderUpdated: 0,
    first : null,
    last : null
  },

  dispose: function () {
    if (this.chart) {
      this.chart.dispose();
    }

    this.setData({
      isDisposed: true
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onReady: function () {
  },
  onLoad: function (options) {
    this.ecComponent = this.selectComponent('#mychart-dom-pie');
    this.ecComponentBar = this.selectComponent('#mychart-dom-bar');
    if (this.ecComponent && this.ecComponentBar) {
      this.getLanguageInfo();
      this.getCalenderInfo();
    }
  },
  getLanguageInfo() {
    var that = this
    var data = {
      username: this.data.username
    }
    wx.request({
      url: 'https://lzx2005.com/api/github/language',
      data,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        var d = res.data.data
        if (res.data.code == 200) {
          that.setData({
            language: d.data,
            updated: util.formatTime(new Date(d.updated))
          })
          console.log(d);
          var option = that.getPieOptions(d.data);
          that.initPie(option);
        } else {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
            }
          });
        }
      }
    })
  },

  getCalenderInfo() {
    var that = this
    var data = {
      username: this.data.username
    }
    wx.request({
      url: 'https://lzx2005.com/api/github/calender',
      data,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          calenderUpdated: util.formatTime((new Date(res.data.data.data.updated)))
        })
        var opt = that.getBarOptions(res.data, that);
        that.initBar(opt);
      }
    })
  },
  setOption: function(chart, option) {
    chart.setOption(option);
  },
  // 点击按钮后初始化图表
  initPie: function (option) {
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption(chart, option);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  // 点击按钮后初始化图表
  initBar: function (option) {
    this.ecComponentBar.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption(chart, option);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  getPieOptions: function(data){
    return {
      title: {
        text: '编程语言比例',
        subtext: '数据来源：Github',
        x: 'center'
      },
      legend: {
        //orient: 'vertical',
        bottom: 10,
        left: 'center',
        data: data
      },
      series: [{
        label: {
          normal: {
            show: true,
            position: 'center'
          },
          emphasis: {
            show: true,
            formatter: '{b|{b}}:{c}行',
            rich: {
              a: {
                color: '#999',
                align: 'center',
                fontSize: 16,
              },
              b: {
                fontSize: 16
              }
            },
            textStyle: {
              fontSize: '16'
            },
            position:"center"
          }
        },
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: true,
        data: data,
      }]
    };
  },
  getBarOptions: function(data, that){
    var d = data.data.data;
    var array = new Array();
    for(var i=0;i<7;i++){
      array[i] = 0;
    }
    var isFirst = true;
    var first = null;
    var last = null;
    for (var k in d) {
      if(isFirst){
        first = d[k].week * 1000
        isFirst = false
      }
      last = d[k].week * 1000
      var i = 0;
      d[k].days.forEach(count => {
        array[i]+=count;
        i++;
      })

    }
    console.log(util.formatDate((new Date(first))))
    console.log(util.formatDate((new Date(last))))
    that.setData({
      first: util.formatDate((new Date(first))),
      last: util.formatDate((new Date(last)))
    })
    
    console.log(array)
    return {
      color: ['#37a2da', '#32c5e9', '#67e0e3'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['代码提交次数']
      },
      grid: {
        left: 20,
        right: 20,
        bottom: 15,
        top: 40,
        containLabel: true
      },
      xAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      series: [
        {
          name: '代码提交次数',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: array,
          itemStyle: {
            // emphasis: {
            //   color: '#37a2da'
            // }
          }
        }
      ]
    };
  }
})