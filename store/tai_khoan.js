import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'

export const state = () => {
  return {
    listThongTin: {
      url: 'cms/user/detail',
      method: 'GET',
    },
    listThongBao: {
      url: 'cms/admin/list/notify',
      method: 'GET',
    },
    updateThongBao: {
      url: 'cms/admin/notify/update',
      method: 'POST',
    },
  }
}
export const actions = {
  async listThongTin(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.listThongTin.url,
      method: vueContext.state.listThongTin.method,
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
  async listThongBao(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.listThongBao.url,
      method: vueContext.state.listThongBao.method,
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
  async updateThongBao(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.updateThongBao.url,
      method: vueContext.state.updateThongBao.method,
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
