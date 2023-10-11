import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../store/store' 

Component({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: {
      active: 'activeTabBarIndex'
    },
    actions: {
      updateActive: 'updateActiveTabBarIndex'
    }
  },
  data: {
    "list": [
      {
        "pagePath": "/pages/index/index",
        "iconPath": "/images/home.png",
        "selectedIconPath": "/images/home-active.png",
        "text": "首页"
      },
      {
        "pagePath": "/pages/orders/orders",
        "iconPath": "/images/order.png",
        "selectedIconPath": "/images/order-active.png",
        "text": "订单"
      },
      {
        "pagePath": "/pages/mine/mine",
        "iconPath": "/images/mine.png",
        "selectedIconPath": "/images/mine-active.png",
        "text": "我的"
      }
    ]
  },
  methods: {
    onChange(event) {
      // event.detail 的值为当前选中项的索引
      // this.setData({ active: event.detail });
      this.updateActive(event.detail)
      wx.switchTab({
        url: this.data.list[event.detail].pagePath,
      })
    },
  }
});
