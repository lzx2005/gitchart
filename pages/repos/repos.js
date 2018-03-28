// pages/repos/repos.js
import util from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    repos: [],
    loading: false,
    username: "lzx2005"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRepos(1);
  },

  getRepos: function(page){
    this.setData({
      repos: [],
      loading: true
    })
    var that = this
    var data = {
      username: this.data.username,
      page: page
    }
    wx.request({
      url: 'https://lzx2005.com/api/github/repos',
      data,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var array = res.data.data;
        var mapArray = array.map(e => {
          e.updated_at = util.formatTime(new Date(e.updated_at));
          e.created_at = util.formatTime(new Date(e.created_at));
          return e;
        })
        console.log(mapArray)
        that.setData({
          repos: mapArray
        });
      },
      fail: function (e) {
        console.log(e)
      },
      complete: function () {
        that.setData({
          loading: false
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})