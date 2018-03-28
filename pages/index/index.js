//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Github',
    githubUserInfo:{},
    grids: [],
    username: "lzx2005",
    loading: true
  },
  onLoad: function () {
    this.getGithubInfo()
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getGithubInfo(){
    var that = this
    var data = {
      username: this.data.username
    }
    wx.request({
      url: 'https://lzx2005.com/api/github/user',
      data,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        var array = new Array();
        if (res.data.code == 200) {
          var d = res.data.data.data
          array.push({
            title: "public_repos",
            value: d.public_repos
          })
          array.push({
            title: "following",
            value: d.following
          })
          array.push({
            title: "followers",
            value: d.followers
          })

          that.setData({
            githubUserInfo: d,
            grids: array,
            loading : false
          })
          console.log(array);

        }else{
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
