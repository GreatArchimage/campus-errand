// pages/orders/comment/comment.js
const db = wx.cloud.database()
Page({

  id: '', //订单id

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.id = options.id;
    
  },

  onSubmit(e){
    console.log(e)
    wx.showLoading({
      title: '正在提交',
      mask:"true"
    })
    const { rate, comment } = e.detail.value
    db.collection('order_list').doc(this.id).update({
      data: {
        rate,
        comment
      },
      success: res => {
        wx.hideLoading();
        wx.navigateBack()
      }
    })
  },
})