// pages/publish/publish.js
const chooseLocation = requirePlugin('chooseLocation');
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  category: '',
  pickUpLocation: undefined,
  arrivalLocation: undefined,

  /**
   * 页面的初始数据
   */
  data: {
    // location: {},
    id: '', // 订单id 根据id有无判断是更新订单还是发起订单
    title: '',
    message: '',
    tel: '',
    chooseLocationBtnIndex: 1,
    pickUpAddress: '', //取件地址
    arrivalAddress: '', //送达地址
    showArrivalTimePopup: false, //送达时间弹出层是否展示
    arrivalTime: '', //送达时间
    showSizesPopup: false,
    itemSize: '小件',
    sizes: ['特小件', '小件', '中件', '大件', '特大件'],
    reward: 1,
    filter(type, options) { //时间间隔为20分
      if (type === 'minute') {
        return options.filter((option) => option % 20 === 0);
      }
      return options;
    },
  },

  onClickArrivalTime() {
    this.setData({ showArrivalTimePopup: true });
  },

  onCloseArrivalTimePopup() {
    this.setData({ showArrivalTimePopup: false });
  },

  onConfirmArrivalTime(event) {
    this.setData({
      arrivalTime: event.detail,
      showArrivalTimePopup: false
    });
  },

  onClickItemSize(){
    this.setData({ showSizesPopup: true });
  },

  onCloseSizesPopup(){
    this.setData({ showSizesPopup: false });
  },

  onConfirmItemSize(event) {
    this.setData({
      itemSize: event.detail.value,
      showSizesPopup: false
    })
  },

  onChangeReward(event){
    this.setData({
      reward: event.detail
    })
  },

  formSubmit(e){
    console.log(e)
    if (!app.globalData.openid) {
      wx.showToast({
        icon: 'none',
        title: '请先登陆',
        complete: res => {
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          }, 2000);
        }
      })
      return
    }
    wx.showLoading({
      title: '正在发布',
    });
    const {arrivalTime, itemSize, reward} = this.data;
    const {pickUpAddress, arrivalAddress, title, message, tel} = e.detail.value;
    if(pickUpAddress && arrivalAddress && arrivalTime && itemSize && title && tel && reward){
      if(this.data.id){
        db.collection('order_list').doc(this.data.id).update({
          data: {
            category: this.category,
            reward: Number(reward),
            tel: tel,
            message: message,
            title: title,
            pickUpAddress: pickUpAddress,
            arrivalAddress: arrivalAddress,
            arrivalTime: arrivalTime,
            pickUpLocation: db.Geo.Point(this.pickUpLocation.longitude, this.pickUpLocation.latitude),
            arrivalLocation: db.Geo.Point(this.arrivalLocation.longitude, this.arrivalLocation.latitude),
            addtime: db.serverDate(),
            itemSize: itemSize,
            status: '待接单', 
          },
          success: res => {
            console.log('更新成功', res)
            wx.hideLoading();
            wx.showToast({
              icon: 'success',
              title: '更新成功',
              complete: res => {
                console.log(res)
                wx.redirectTo({
                  url: '/pages/orders/orders',
                })
              }
            })
          },
          fail: err => {
            wx.hideLoading();
            wx.showToast({
              icon: 'none',
              title: '更新失败'
            })
            console.log(err)
          }
        })
      }else{
        db.collection('order_list').add({
          data: {
            category: this.category,
            reward: Number(reward),
            tel: tel,
            message: message,
            title: title,
            pickUpAddress: pickUpAddress,
            arrivalAddress: arrivalAddress,
            arrivalTime: arrivalTime,
            pickUpLocation: db.Geo.Point(this.pickUpLocation.longitude, this.pickUpLocation.latitude),
            arrivalLocation: db.Geo.Point(this.arrivalLocation.longitude, this.arrivalLocation.latitude),
            addtime: db.serverDate(),
            itemSize: itemSize,
            status: '待接单', 
          },
          success: res => {
            console.log('发布成功', res)
            wx.hideLoading();
            wx.showToast({
              icon: 'success',
              title: '发布成功',
              complete: res => {
                console.log(res)
                wx.redirectTo({
                  url: '/pages/orders/orders',
                })
              }
            })
          },
          fail: err => {
            wx.hideLoading();
            wx.showToast({
              icon: 'none',
              title: '发布失败'
            })
            console.log(err)
          }
        })
      }
    }else {
      wx.showToast({
        icon: 'none',
        title: '请填写完整信息'
      })
    }
  },


  onChooseLocation(e) {
    this.data.chooseLocationBtnIndex =  e.currentTarget.dataset.btnIndex; 
    const key = 'ROBBZ-DULCB-P52UL-J3P2N-FJZDE-CQBSS'; //使用在腾讯位置服务申请的key
    const referer = '微信小程序'; //调用插件的app的名称
    
    // const location = JSON.stringify({
    //   latitude: 39.89631551,
    //   longitude: 116.323459711
    // });
    // const category = '生活服务,娱乐休闲';

    // 无location参数默认当前地址
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer
    });
  },

  onLoad(options){
    if(options.id){
      db.collection('order_list').doc(options.id).get().then(res => {
        console.log(res);
        const data = res.data
        
        this.category = data.category;
        this.pickUpLocation = data.pickUpLocation
        this.arrivalLocation = data.arrivalLocation
        console.log(res.data)
        this.setData({
          id: data._id,
          title: data.title,
          message: data.message,
          tel: data.tel,
          pickUpAddress: data.pickUpAddress, //取件地址
          arrivalAddress: data.arrivalAddress, //送达地址
          arrivalTime: data.arrivalTime,
          itemSize: data.itemSize,
          reward: data.reward,
        })
        wx.setNavigationBarTitle({
          　title: "修改订单"
        })
      })
    }else if(options.category){
      this.category = options.category;
      //更换页面标题
      wx.setNavigationBarTitle({
        　title: options.category  
      })
    }
    

  },

  // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
  onShow () {
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    console.log(location, 'location')
    if(location != null){
      if(this.data.chooseLocationBtnIndex == 1){
        this.pickUpLocation = location,
        this.setData({
          pickUpAddress: location.name
        })
      }else {
        this.arrivalLocation = location,
        this.setData({
          arrivalAddress: location.name
        })
      }
    }
  },

  onUnload() {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null);
  },

})