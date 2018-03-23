// pages/statistics/statistics.js
import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function setOption(chart, option) {
  chart.setOption(option);
}


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
    isLoaded: false,
    isDisposed: false
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
      setOption(chart, option);

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



          var option = {
            backgroundColor: "#ffffff",
            color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
            series: [{

              label: {
                normal: {
                  formatter: '{b|{b}:}{c}',
                  rich: {
                    a: {
                      color: '#999',
                      lineHeight: 22,
                      align: 'center'
                    },
                    b: {
                      fontSize: 16,
                      lineHeight: 33
                    }
                  }
                }
              },
              type: 'pie',
              center: ['50%', '50%'],
              radius: [0, '60%'],
              data: that.data.language.sort(function (a, b) { return a.value - b.value; }),
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 2, 2, 0.3)'
                }
              }
            }]
          };
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
  }
})