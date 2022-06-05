import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'

const state = () => ({
  list: {
    url: '',
    method: 'GET',
  },
})

const mutations = {}

const actions = {
  async get_list(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.list.url,
      method: vueContext.state.list.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        channel: APIs.channel,
        transid,
        ...payload,
      },
    })
    return response
  },
}

export default {
  state,
  mutations,
  actions,
}
