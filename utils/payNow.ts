const handlePayNow = async (order: any) => {
  const { data } = await useHttpGet({
    url: `/order/payPalOrderDetails/${order['paymentOrderId']}`,
    isLoading: true
  })
  if (!data.value) return
  console.log(data.value)
  const { links } = data.value
  const pathConfig = links.find((d: any) => d.rel === 'payer-action')
  window.open(pathConfig.href, '_self')
}

export default handlePayNow
