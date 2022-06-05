import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'

export const state = () => {
  return {
    getlist: {
      url: 'cms/config/system/language/list',
      method: 'GET',
    },
    add: {
      url: 'cms/config/system/language/insert',
      method: 'POST',
    },
    update: {
      url: 'cms/config/system/language/update',
      method: 'POST',
    },
    delete: {
      url: 'cms/config/system/language/delete',
      method: 'POST',
    },
    detail: {
      url: 'cms/config/system/language/detail',
      method: 'GET',
    },
    updateStatus: {
      url: 'cms/config/system/language/update/status',
      method: 'POST',
    },
    updateDefault: {
      url: 'cms/config/system/language/update/default',
      method: 'POST',
    },
    commonLanguage: {
      url: 'cms/common/language',
      method: 'GET',
    },
    commonCurrency: {
      url: 'cms/common/currency',
      method: 'GET',
    },
    listMenu: {
      url: 'cms/common/menu/list',
      method: 'GET',
    },
    listCodeLanguage: {
      url: 'cms/common/language_config',
      method: 'GET',
    },
  }
}

export const actions = {
  async listCodeLanguage(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.listCodeLanguage.url,
      method: vueContext.state.listCodeLanguage.method,
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

  async listMenu(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.listMenu.url,
      method: vueContext.state.listMenu.method,
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

  async change_status(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.updateStatus.url,
      method: vueContext.state.updateStatus.method,
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

  async changes_default(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.updateDefault.url,
      method: vueContext.state.updateDefault.method,
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

  async commonLanguage(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.commonLanguage.url,
      method: vueContext.state.commonLanguage.method,
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

  async commonCurrency(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.commonCurrency.url,
      method: vueContext.state.commonCurrency.method,
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
