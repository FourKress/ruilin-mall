const orderStatusTipsMap = {
  '-1': 'Transaction closed', // 取消订单
  0: 'Unpaid...', // 待支付
  1: 'Under Review...', // 待审核
  2: 'Pending Shipment', //待发货
  3: 'Shipping...', // 运输中
  4: 'Awaiting Receipt...', //待收货
  5: 'Transaction completed', // 订单完结
  6: 'Awaiting Refund', // 退款中
  7: 'Refunded', // 已退款
  8: 'Payment Confirm...', // 支付确认中
  9: 'Reversed' // 已撤销
}

export default orderStatusTipsMap
