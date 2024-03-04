interface IRule {
  ruleList: Ref<Record<string, any>[]>
  matchedRule: Ref<Record<string, any>>
}
const useRule = async (orderAmount?: number): Promise<IRule> => {
  const ruleList = ref<Record<string, any>[]>([])
  const matchedRule = ref<Record<string, any>>({})

  const { data: ruleRes } = await useHttpGet({
    url: `/rule/list/`
  })

  if (ruleRes.value) {
    ruleList.value = ruleRes.value
    if (orderAmount) {
      matchedRule.value = ruleRes.value
        .sort((a: any, b: any) => b['thresholdValue'] - a['thresholdValue'])
        .find((d: any) => d.thresholdValue <= orderAmount)
    }
  }

  return { ruleList, matchedRule }
}

export default useRule
