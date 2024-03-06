import { defineStore } from 'pinia'

export const useRuleStore = defineStore('rule', {
  state: () => ({
    ruleList: ref<any[]>([])
  }),
  actions: {
    async getRuleList() {
      const { data: res } = await useHttpGet({
        url: `/rule/list/`
      })
      if (!res.value) return
      res.value.sort((a: any, b: any) => a['thresholdValue'] - b['thresholdValue'])
      this.ruleList = res.value
    },

    getMatched(amount: string) {
      if (amount && parseInt(amount) > 0) {
        return [...this.ruleList].reverse().find((d: any) => d.thresholdValue <= amount)
      }
    },

    getMinRule() {
      if (!this.ruleList.length) return
      return this.ruleList[0]
    }
  }
})
