// pages/statistics/statistics.js
import * as echarts from '../../ec-canvas/echarts';
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
    isDisposed: false
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
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
    this.initPie();
  },
  onLoad: function (options) {
    this.getLanguageInfo();
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
        if (res.data.code == 200) {
          that.setData({
            language: res.data.data
          })
          console.log(that.data.language);
          var option = that.getPieOptions(that.data.language);
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
  getPieOptions: function(data){
    var labelNames = new Array();
    for(var i in data){
      labelNames.push(data[i].name);
    }

    console.log(labelNames)

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
        data: labelNames
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
  }
})