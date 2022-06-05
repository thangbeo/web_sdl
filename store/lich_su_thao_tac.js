import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'

export const state = () => {
  return {
    // danh sách trang
    log_action_list: {
      url: 'cms/common/log_action/list',
      method: 'GET',
    },
  }
}

export const actions = {
  async log_action_list(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.log_action_list.url,
      method: vueContext.state.log_action_list.method,
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
  async page_insert(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.page_insert.url,
      method: vueContext.state.page_insert.method,
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
  async page_detail(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.page_insert.url,
      method: vueContext.state.page_insert.method,
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
}
