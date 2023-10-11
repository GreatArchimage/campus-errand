// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  // const { _id, status } = event;
  // if(status != undefined){
  //   return await db.collection('order_list').doc(_id).update({
  //     data: {
  //       status
  //     }
  //   })
  // }
  const { _id, updateData } = event;
  const { status, orderTaker } = updateData;
  if(status == "进行中"){
    let orderTakingTime = db.serverDate() 
    return await db.collection('order_list').doc(_id).update({
      data: {
        status,
        orderTaker,
        orderTakingTime,
      }
    })
  }else{
    let orderFinishTime = db.serverDate() ;
    return await db.collection('order_list').doc(_id).update({
      data: {
        status,
        orderFinishTime
      }
    })
  }
  
}