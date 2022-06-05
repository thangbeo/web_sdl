import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'

export const state = () => {
  return {
    getlistCategory: {
      url: 'cms/config/system/list',
      method: 'GET',
    },
    detailCategory: {
      url: 'cms/config/system/detail',
      method: 'GET',
    },
    addDetailCategory: {
      url: 'cms/config/system/insert',
      method: 'POST',
    },
    updateDetailCategory: {
      url: 'cms/config/system/update',
      method: 'POST',
    },
    deleteDetailCategory: {
      url: 'cms/config/system/delete',
      method: 'POST',
    },
  }
}

export const actions = {
  async getlistCategory(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.getlistCategory.url,
      method: vueContext.state.getlistCategory.method,
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

  async detailCategory(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.detailCategory.url,
      method: vueContext.state.detailCategory.method,
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

  async addDetailCategory(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.addDetailCategory.url,
      method: vueContext.state.addDetailCategory.method,
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

  async updateDetailCategory(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.updateDetailCategory.url,
      method: vueContext.state.updateDetailCategory.method,
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

  async deleteDetailCategory(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.deleteDetailCategory.url,
      method: vueContext.state.deleteDetailCategory.method,
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
