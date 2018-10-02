//index.js
//获取应用实例
const db = wx.cloud.database()
var common = require('../../dist/common.js');

var app = getApp();

var that;
Page({
  data: {

    textList: {},

    classes: ['全部', '教学', '后勤', '课余', '其他'],
    index: 0,
    current: '全部',
    current_scroll: '全部',
    color: ["#72afd3, #37ecba"],
    deg: 135,
    showLeft1: false,
    username: '',
    avatarUrl: ''
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    getLike(this);
    this.onShow();
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
    getLike(this);
    this.onShow();
  },
  change: function() {
    wx.navigateTo({
      url: '/pages/home/login/login',
    })
  },

  home: function() {
    wx.navigateTo({
      url: '/pages/first/first',
    })
  },

  pl: function() {
    wx.navigateTo({
      url: '/pages/home/mycomment/mycomment',
    })
  },

  aboutus: function() {
    wx.navigateTo({
      url: '/pages/aboutus/aboutus',
    })
  },

  toggleLeft1() {
    this.setData({
      username: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl
    })
    this.setData({
      showLeft1: !this.data.showLeft1
    });
  },
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },

  fabu: function() {
    wx.navigateTo({
      url: '/pages/home/mysug/mysug',
    })
  },

  handleChangeScroll({
    detail
  }) {
    this.setData({
      current_scroll: detail.key
    });


    //点击顶部分类栏，显示各分类下的帖子
    const texts_collection = app.globalData.db.collection('qyzx_texts')

    if (detail.key == "全部") {
      texts_collection.orderBy('ding', 'desc')
        .get().then(res => {
          this.setData({
            textList: res.data
          })
        })
    } else {
      texts_collection.where({
          classes: detail.key
        }).orderBy('ding', 'desc')
        .get().then(res => {
          this.setData({
            textList: res.data
          })
        })
    }
  },

  onReady: function(e) {

    console.log(app.globalData.userInfo)

    app.globalData.db.collection('qyzx_texts').orderBy('ding', 'desc')
      .get().then(res => {
        console.log('按赞排序后：', res.data)
        this.setData({
          'textList': res.data
        })
        console.log('textList:', this.data.textList)
      })

    if (app.globalData.userInfo != null) {
      this.setData({
        username: app.globalData.userInfo.nickName
      })
    }

  },

  onShareAppMessage: function() {},


  onLoad: function() {},

  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },



  inputTyping: function(e) {
    //搜索数据
    getLike(this, e.detail.value);
    this.setData({
      inputVal: e.detail.value
    });
  },

  //按时间排序
  shijian: function() {

    const texts_collection = app.globalData.db.collection('qyzx_texts')
    if (this.data.current_scroll == "全部") {
      texts_collection.orderBy('due', 'desc')
        .get().then(res => {
          this.setData({
            textList: res.data
          })
        })
    } else {
      texts_collection.where({
          classes: this.data.current_scroll
        }).orderBy('due', 'desc')
        .get().then(res => {
          this.setData({
            textList: res.data
          })
        })
    }
  },

  //按赞排序
  zanpai: function() {

    this.onShow();

  },

  onShow: function() {

    const texts_collection = app.globalData.db.collection('qyzx_texts')

    if (this.data.current_scroll == "全部") {
      texts_collection.orderBy('ding', 'desc')
        .get().then(res => {
          this.setData({
            textList: res.data
          })
        })
    } else {
      texts_collection.where({
          classes: this.data.current_scroll
        }).orderBy('ding', 'desc')
        .get().then(res => {
          this.setData({
            textList: res.data
          })
        })
    }

  }
})

function getLike(t, k) {
  that = t;
  db.collection('qyzx_texts').where({
      deleted: false
    })
    .get({
      success: function(res) {
        console.log("获取成功，数据为： ", res.data)
        var i;
        var test = [];
        for (i = 0; i < res.data.length; i++) {
          if (res.data[i].content.indexOf(k) >= 0) {
            console.log("成功");
            test[test.length] = res.data[i]
            that.setData({
              textList: null,
              textList: test,
            })
          };
        }
      }
    })
  console.log("TextList", t.data.textList)
}