// pages/orderDetail/orderDetail.js
const db = wx.cloud.database()
Page({

  id: undefined,

  /**
   * 页面的初始数据
   */
  data: {
    order: {
      title: '',
      pickUpAddress: '',
      arrivalAddress: '',
      arrivalTime: '',
      itemSize: '',
      tel: '',
      message: '',
      reward: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this
    const id = options.id;
    this.id = id;
    wx.cloud.callFunction({
      name: 'getOneOrder',
      data: {
        _id: id
      },
      success: res => {
        console.log("获取订单成功", res)
        that.setData({
          order: res.result.list[0]
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  handleFinishOrder(){
    const _id = this.id
    const updateData = {
      status: '已完成',
    }
    wx.cloud.callFunction({
        name: 'updateOrder',
        data: {
          _id,
          updateData
        },
        success: res => {
            console.log("更新订单状态成功", res)
            wx.navigateBack()
          },
          fail: err => {
            console.log(err)
          }
    })
  },

})