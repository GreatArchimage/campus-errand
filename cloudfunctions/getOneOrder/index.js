// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  let { _id } = event;

  return await db.collection('order_list').aggregate().match({
    _id: _.eq(_id)
  })
  .lookup({
    from: 'user_info',
    localField: '_openid',
    foreignField: '_openid',
    as: 'userInfos',
  })
  .lookup({
    from: 'user_info',
    localField: 'orderTaker',
    foreignField: '_openid',
    as: 'orderTakers',
  })
  .end()
}