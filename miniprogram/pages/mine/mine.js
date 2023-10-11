// pages/mine/mine.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

	nickName: '',

  data: {
    userInfo: {},
    hasUserInfo: false,
    showDialog: false
  },

  onShowDialog(){
    this.setData({ showDialog: true })
  },
  onClose() {
    this.setData({ showDialog: false });
  },

  onChooseAvatar(e) {
		
		const that = this

		wx.cloud.uploadFile({
				cloudPath: 'avatar/' + app.globalData.openid + '_' + new Date().getTime() + '_avatarImg.jpg',
				filePath: e.detail.avatarUrl
			})
			.then(res => {
				console.log(res.fileID,"path");
				// this.data.userInfo.avatarUrl = res.fileID;
				that.setData({
					'userInfo.avatarUrl': res.fileID,
				})
				// app.globalData.userInfo.avatarUrl = res.fileID;
			})
			.catch(
				error => {
					console.log(error)
				});
  },

  nicknameBlur(e) {
    if(e.detail.value!=undefined)
      this.nickName = e.detail.value
  },

  onConfirm(){
	const that = this;
	that.setData({
		'userInfo.nickName': that.nickName
	})
		db.collection('user_info').where({
			_openid: _.eq(app.globalData.openid)
		}).update({
			// data 传入需要局部更新的数据
			data: that.data.userInfo
		}).then(res => {
			console.log(res);
			app.globalData.userInfo = that.data.userInfo;
			wx.setStorageSync('userInfo', app.globalData.userInfo);
		})
  },

  onLoad(options){
    console.log(app.globalData.userInfo)
    const userInfo = app.globalData.userInfo;
    if(userInfo != undefined){
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    }else{
      app.globalData.userInfo = {};
    }
    //页面加载时从缓存读取userInfo信息
    wx.getStorage({
      key: 'userInfo',
      success: res => {
        console.log(res, "getUserInfo");
        this.setData({
          userInfo: res.data,
          hasUserInfo: true
        })
        console.log(this.data.userInfo);
        app.globalData.userInfo = res.data.userInfo;
        app.globalData.openid = wx.getStorageSync('openid');
      },
      fail: err => { //读取失败，则自定义数据存入
        console.log("fail:",err);
        this.addUserInfo();
      }
    })
  },

	addUserInfo() {

		if (!app.globalData.openid) {
			wx.cloud.callFunction({
					name: 'login',
					data: {}
				})
				.then(res => { //login获取openid云函数调用成功
					console.log(res.result);
					wx.setStorageSync('openid', res.result.openid);
          app.globalData.openid = res.result.openid;
					return db.collection('user_info').where({
						_openid: _.eq(res.result.openid)
					}).get();
				}).catch(err => { //login获取openid云函数调用失败
					wx.showToast({
						icon: 'none',
						title: '请检查登陆状态',
					})
					console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
				})
				.then(res => { //获取用户信息成功
					console.log('获取用户信息成功', res);
					if (res.data.length > 0) //用户已存在，则记取数据
					{
            const {nickName, avatarUrl} = res.data[0]
						this.setData({
							userInfo: {nickName, avatarUrl},
							hasUserInfo: true
						})
						app.globalData.userInfo = {nickName, avatarUrl};
						wx.setStorageSync("userInfo", {nickName, avatarUrl});
					
					} else //用户不存在，则add添加数据
					{
						var userInfo = {
							avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
							nickName: "微信用户"
						};
						app.globalData.userInfo = userInfo;
						wx.setStorageSync("userInfo", userInfo);
						this.setData({
							userInfo: app.globalData.userInfo,
							hasUserInfo: true
						})
						return db.collection('user_info').add({
							data: userInfo
						});
					}

				}).catch(err => { //数据库查询失败
					console.log('查询用户信息失败', err)
				})
				.then(res => { //添加用户信息成功
					console.log('添加用户信息成功', res);

				}).catch(err => { //添加用户信息失败
					console.log('添加用户信息失败', err)
				})
		}
	},

})