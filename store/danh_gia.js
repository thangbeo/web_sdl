import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'

export const state = () => {
  return {
    getlist: {
      url: 'cms/comment/list',
      method: 'GET',
    },
    delete: {
      url: 'cms/comment/delete',
      method: 'POST',
    },
    update: {
      url: 'cms/comment/update',
      method: 'POST',
    },
    detail: {
      url: 'cms/comment/detail',
      method: 'GET',
    },
    change_status: {
      url: 'cms/comment/update/status',
      method: 'POST',
    },
    auto_browse_change: {
      url: 'cms/approval/config/update/comment/status',
      method: 'POST',
    },
    auto_browse: {
      url: 'cms/approval/config/info',
      method: 'GET',
    },
  }
}

export const actions = {
  async getlist(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.getlist.url,
      method: vueContext.state.getlist.method,
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

  async change_status(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.change_status.url,
      method: vueContext.state.change_status.method,
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

  async delete(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.delete.url,
      method: vueContext.state.delete.method,
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

  async detail(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.detail.url,
      method: vueContext.state.detail.method,
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

  async change_auto_browse_product(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.auto_browse_change.url,
      method: vueContext.state.auto_browse_change.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      data: {
        channel: APIs.channel,
        transid,
        ...payload,
      },
    })
    return response
  },
  async auto_browse_product(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.auto_browse.url,
      method: vueContext.state.auto_browse.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        channel: APIs.channel,
        transid,
      },
    })
    return response
  },
}
