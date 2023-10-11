// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  let { openid, orderTaker, status } = event;

  let match = {};
  //如果有openid，则代表查询用户自己发布的订单
  //如果有orderTaker，则代表查询自己接受的订单
  if(openid){
    match._openid = _.eq(event.openid)
  }else if(orderTaker)
    match.orderTaker = _.eq(event.orderTaker)
  
  if(status)
    match.status = _.eq(event.status)
  
  return await db.collection('order_list').aggregate().match(
    match
  )
  .lookup({
    from: 'user_info',
    localField: '_openid',
    foreignField: '_openid',
    as: 'userInfos',
  })
  .sort({
    addtime: -1
  })
  .end()
}