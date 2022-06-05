import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'

const state = () => {
  return {
    getlist: {
      url: 'cms/manage/menu/list',
      method: 'GET',
    },
    getCategory: {
      url: 'cms/manage/menu/category/list',
      method: 'GET',
    },
    detail: {
      url: 'cms/manage/menu/detail',
      method: 'GET',
    },
    deleteDetail: {
      url: 'cms/manage/menu/detail/delete',
      method: 'POST',
    },
    delete: {
      url: 'cms/manage/menu/delete',
      method: 'POST',
    },
    insert: {
      url: 'cms/manage/menu/insert',
      method: 'POST',
    },
    getSites: {
      url: 'cms/common/language',
      method: 'GET',
    },
    updateDetail: {
      url: 'cms/manage/menu/detail/update',
      method: 'POST',
    },
    update: {
      url: 'cms/manage/menu/update',
      method: 'POST',
    },
    copy: {
      url: 'cms/manage/menu/clone',
      method: 'POST',
    },
    checkSites: {
      url: 'cms/manage/menu/check_sites',
      method: 'GET',
    },
    menu_id: null,
  }
}

const mutations = {
  setMenuID(state, payload) {
    state.menu_id = payload
  },
}

const actions = {
  async checkSites(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.checkSites.url,
      method: vueContext.state.checkSites.method,
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

  async getSites(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.getSites.url,
      method: vueContext.state.getSites.method,
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

  async getCategory(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.getCategory.url,
      method: vueContext.state.getCategory.method,
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

  async deleteDetail(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.deleteDetail.url,
      method: vueContext.state.deleteDetail.method,
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

  async insert(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.insert.url,
      method: vueContext.state.insert.method,
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

  async updateDetail(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.updateDetail.url,
      method: vueContext.state.updateDetail.method,
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

  async copy(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.copy.url,
      method: vueContext.state.copy.method,
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

export default {
  state,
  mutations,
  actions,
}
