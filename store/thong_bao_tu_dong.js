import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'

export const state = () => {
  return {
    info: {
      url: 'auto-notification/info',
      method: 'GET',
    },
    update: {
      url: 'auto-notification/update',
      method: 'POST',
    },
    autoPattern: {
      url: 'auto-notification/pattern',
      method: 'GET',
    },
  }
}
export const actions = {
  async info(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.info.url,
      method: vueContext.state.info.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        channel: APIs.channel,
        transid,
        ...data,
      },
    })
    return response
  },

  async update(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.update.url,
      method: vueContext.state.update.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      data: {
        channel: APIs.channel,
        transid,
        ...data,
      },
    })
    return response
  },

  async autoPattern(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.autoPattern.url,
      method: vueContext.state.autoPattern.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        channel: APIs.channel,
        transid,
        ...data,
      },
    })
    return response
  },
}
