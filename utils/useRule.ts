interface IRule {
  ruleList: Ref<Record<string, any>[]>
  matchedRule: Ref<Record<string, any>>
}
const useRule = async (orderAmount?: number): Promise<IRule> => {
  const ruleList = ref<Record<string, any>[]>([])
  const matchedRule = ref<Record<string, any>>({})
  const tokenCookie = useCookie('token')

  if (!tokenCookie.value) return { ruleList, matchedRule }

  const { data } = await useHttpGet({
    url: `/rule/list/`
  })

  if (data.value) {
    ruleList.value = data.value
    if (orderAmount) {
      matchedRule.value = data.value
        .sort((a: any, b: any) => b['thresholdValue'] - a['thresholdValue'])
        .find((d: any) => d.thresholdValue <= orderAmount)
    }
  }

  return { ruleList, matchedRule }
}

export default useRule
