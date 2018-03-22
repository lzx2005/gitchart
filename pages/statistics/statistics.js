// pages/statistics/statistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    language: [],
    username: "lzx2005"
  },

  /**
   * 生命周期函数--监听页面加载
   */
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