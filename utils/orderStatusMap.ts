const orderStatusTipsMap = {
  '-1': 'Transaction closed', // 取消订单
  0: 'Unpaid...', // 待支付
  2: '  Shipment', //待发货
  3: 'Shipping...', // 运输中
  4: 'Awaiting Receipt...', //待收货
  5: 'Transaction completed', // 订单完结
  6: 'Awaiting Refund', // 退款中
  8: 'After-sales Support...' // 退款审核
}

export default orderStatusTipsMap
