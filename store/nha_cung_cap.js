import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'

export const state = () => {
  return {
    getlist: {
      url: 'cms/enterprise/list',
      method: 'GET',
    },
    add: {
      url: 'cms/enterprise/add',
      method: 'POST',
    },
    update: {
      url: 'cms/enterprise/update',
      method: 'POST',
    },
    delete: {
      url: 'cms/enterprise/delete',
      method: 'POST',
    },
    detail: {
      url: 'cms/enterprise/detail',
      method: 'GET',
    },
    productType: {
      url: 'cms/common/product_type',
      method: 'GET',
    },
    auto_browse_change: {
      url: 'cms/approval/config/update/enterprise/status',
      method: 'POST',
    },
    auto_browse: {
      url: 'cms/approval/config/info',
      method: 'GET',
    },
    status: {
      url: 'cms/enterprise/update/status',
      method: 'POST',
    },
    export_excel: {
      url: 'cms/export/enterprise/list',
      method: 'POST',
    },
    getlistHistory: {
      url: 'cms/transaction/ncc/list',
      method: 'GET',
    },
    enterprise: null,
  }
}

const mutations = {
  change_enterprise(state, payload) {
    state.enterprise = payload
  },
}

export const actions = {
  async getlistHistory(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.getlistHistory.url,
      method: vueContext.state.getlistHistory.method,
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

  async export_excel(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.export_excel.url,
      method: vueContext.state.export_excel.method,
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

  async change_status(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.status.url,
      method: vueContext.state.status.method,
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

  async productType(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.productType.url,
      method: vueContext.state.productType.method,
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

  async add(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.add.url,
      method: vueContext.state.add.method,
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

  async delete(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.delete.url,
      method: vueContext.state.delete.method,
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
}

export default {
  state,
  mutations,
  actions,
}
