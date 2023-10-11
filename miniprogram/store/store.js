import { action, observable } from 'mobx-miniprogram'

export const store = observable({
    // 自定义tabBar状态存储
    activeTabBarIndex: 0,

    updateActiveTabBarIndex: action(function(index){
        this.activeTabBarIndex = index
    })
})