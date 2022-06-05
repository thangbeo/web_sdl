import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'

export const state = () => {
  return {
    getlist: {
      url: 'cms/admin/list',
      method: 'GET',
    },
    detail: {
      url: 'cms/admin/detail',
      method: 'GET',
    },
    add: {
      url: 'cms/admin/register',
      method: 'POST',
    },
    updateInfomation: {
      url: 'cms/admin/update',
      method: 'POST',
    },
    updateNotication: {
      url: 'cms/admin/update/notify',
      method: 'POST',
    },
    updatePermission: {
      url: 'cms/admin/update/page',
      method: 'POST',
    },
    delete: {
      url: 'cms/admin/delete',
      method: 'POST',
    },
    getlistPermissions: {
      url: 'cms/admin/utility/page',
      method: 'GET',
    },
    getListNotify: {
      url: 'cms/admin/utility/notify',
      method: 'GET',
    },
    notificationList: {
      url: 'cms/admin/list/notify',
      method: 'GET',
    },
    data_add_QTVien: {
      avatar: null,
      name: null,
      email: null,
      phone: null,
      positionJob: null,
      status: 1,
      note: null,
    },
    is_owner: '',
    list_notify: '',
    listPhanQuyen: '',
    transaction: true,
    product: true,
    user: true,
    post: true,
    comment: true,
    chat: true,
  }
}

export const mutations = {
  data_add_QTV(state, payload) {
    state.data_add_QTVien = payload
  },
  add_Thongbao(state, payload) {
    state.list_notify = payload
  },
  add_PhanQuyen(state, payload) {
    state.listPhanQuyen = payload
  },
  is_owner(state, payload) {
    state.is_owner = payload
  },
  set_data(state, payload) {
    state.test = payload
  },
  change_value(state, payload) {
    state[payload.name] = payload.value
    // console.log(payload.name, payload.value)
  },
}
export const actions = {
  // notificationList
  async notificationList(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.notificationList.url,
      method: vueContext.state.notificationList.method,
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
  async getlistPermissions(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.getlistPermissions.url,
      method: vueContext.state.getlistPermissions.method,
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
  async getListNotify(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.getListNotify.url,
      method: vueContext.state.getListNotify.method,
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

  async updateInfomation(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.updateInfomation.url,
      method: vueContext.state.updateInfomation.method,
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

  async updateNotication(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.updateNotication.url,
      method: vueContext.state.updateNotication.method,
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

  async updatePermission(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.updatePermission.url,
      method: vueContext.state.updatePermission.method,
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
}
