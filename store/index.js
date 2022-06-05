const state = () => ({})

const actions = {
  async nuxtServerInit(store, context) {
    await store.dispatch('app/list_languages', context)
  },
}

export default {
  state,
  actions,
}
