// index.js
const app = getApp();
Page({
    data: {
        bannerList: [
            '/images/banner1.jpg',
            '/images/banner2.jpg'
        ],
        categories: [
            {
                iconPath: '/images/express.png',
                text: '快递代取'
            },
            {
                iconPath: '/images/catering.png',
                text: '外卖代拿'
            },
            {
                iconPath: '/images/goods.png',
                text: '商品代买'
            },
            {
                iconPath: '/images/item.png',
                text: '物品代送'
            }
        ],
        orderList: []
    },

    onLoad(options){
        wx.cloud.callFunction({
            name: 'getOrderList',
            data: {
                status: '待接单'
            },
            success: res => {
              console.log("获取成功", res)
              const list = res.result.list;
              list.map(item => {
                console.log(item)
                if(item._openid == app.globalData.openid){
                  item.isOwn = true;
                }
              })
              this.setData({
                orderList: list
              })
            },
            fail: err => {
              console.log(err)
            }
        })
    },

    handleAcceptOrder(e){
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
        const id = e.currentTarget.dataset.orderId;
        let updateData = {
            status: '进行中', 
            orderTaker: app.globalData.openid,  //接单人
        }
        wx.cloud.callFunction({
            name: 'updateOrder',
            data: {
                _id: id,
                updateData
            },
            success: res => {
                console.log("更新订单状态成功", res)
                wx.navigateTo({
                  url: "/pages/orderDetail/orderDetail?id="+id,
                })
              },
              fail: err => {
                console.log(err)
              }
        })
    }

})
