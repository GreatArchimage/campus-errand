// pages/orders/orders.js
const db = wx.cloud.database()
const _ = db.command
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    publishedOrders: [],
    acceptedOrders: [],
  },

  getOrderList(){
    // 获取发布的订单
    wx.cloud.callFunction({
      name: 'getOrderList',
      data: {
        openid: app.globalData.openid
      },
      success: res => {
        console.log("获取成功", res)
        this.setData({
          publishedOrders: res.result.list
        })
      },
      fail: err => {
        console.log(err)
      }
    });
    // 获取已接受的订单
    wx.cloud.callFunction({
      name: 'getOrderList',
      data: { orderTaker: app.globalData.openid },
      success: res => {
        console.log("获取成功", res)

        this.setData({
          acceptedOrders: res.result.list
        })
      },
      fail: err => {
        console.log(err)
      }
  })
  },

  handleCancelOrder(e){
    let that = this
    wx.showLoading({
      title: '正在删除数据......',
      mask:"true"
    })
    const index = e.currentTarget.dataset.index
    const _id = e.currentTarget.dataset.orderId;
    db.collection('order_list').doc(_id).remove({
      success: function(res) {
        wx.hideLoading()
        let newOrders = that.data.publishedOrders
        newOrders.splice(index, 1)
        that.setData({
          publishedOrders: newOrders
        })

      }
    })
  },

  toOrderDetail(e){
    const id = e.currentTarget.dataset.orderId
      wx.navigateTo({
        url: "/pages/orderDetail/orderDetail?id="+id,
      })
  },

  handleFinishOrder(e){
    const that = this;
    const id = e.currentTarget.dataset.orderId;
    const index = e.currentTarget.dataset.index;
      const updateData = {
        status: '已完成',
      }
      wx.cloud.callFunction({
          name: 'updateOrder',
          data: {
            _id: id,
            updateData
          },
          success: res => {
              console.log("更新订单状态成功", res)
              // that.data.acceptedOrders[index].status = '已完成'
              const updatedOrder = 'acceptedOrders[' + index + '].status';
              that.setData({
                [updatedOrder]: '已完成'
              })
            },
            fail: err => {
              console.log(err)
            }
      })
  },

  toComment(e){
    const id = e.currentTarget.dataset.orderId;
    wx.navigateTo({
      url: '/pages/orders/comment/comment?id=' + id,
    })
  },

  toEditOrder(e){
    const id = e.currentTarget.dataset.orderId;
    const index = e.currentTarget.dataset.index;
    //如果当前订单状态为待接单，则跳转到修改订单，否则跳转到订单详情
    if(this.data.publishedOrders[index].status == '待接单'){
      wx.navigateTo({
        url: '/pages/publish/publish?id=' + id,
      })
    }else{
      wx.navigateTo({
        url: "/pages/orderDetail/orderDetail?id="+id,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getOrderList();
  },

})