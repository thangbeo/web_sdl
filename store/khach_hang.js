import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'

export const state = () => {
  return {
    customer_list: {
      url: 'cms/customer/list',
      method: 'GET',
    },
    newsletter_list: {
      url: 'cms/customer/registed_new_letter',
      method: 'GET',
    },
    // xuất
    export_customer_list: {
      url: 'cms/export/customer/list',
      method: 'POST',
    },
    export_newsletter_list: {
      url: 'cms/export/registed_new_letter',
      method: 'POST',
    },
    title: '',
    customerId: null,
    back: null,
    // chi tiết
    customer_detail: {
      url: 'cms/customer/detail',
      method: 'GET',
    },
    // thêm mới
    customer_add: {
      url: 'cms/customer/add',
      method: 'POST',
    },
    customer_update: {
      url: 'cms/customer/update',
      method: 'POST',
    },
    customer_delete: {
      url: 'cms/customer/delete',
      method: 'POST',
    },
    list_comment_customer: {
      url: 'cms/comment/list/customer',
      method: 'GET',
    },
    // đã lưu
    list_favorite_customer: {
      url: 'cms/customer/get_list_favorite',
      method: 'GET',
    },
    // lịch sửa giao dịch
    list_transaction_customer: {
      url: 'cms/transaction/customer/list',
      method: 'GET',
    },
  }
}
export const mutations = {
  customer_id(state, payload) {
    state.customerId = payload
  },
  back_customer(state, payload) {
    state.back = payload
  },
  back_title(state, payload) {
    state.title = payload
  },
}
export const actions = {
  // danh sách danh mục
  async customer_list(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.customer_list.url,
      method: vueContext.state.customer_list.method,
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
  async list_comment_customer(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.list_comment_customer.url,
      method: vueContext.state.list_comment_customer.method,
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
  // thêm mới mặc định
  async customer_add(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.customer_add.url,
      method: vueContext.state.customer_add.method,
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
  async customer_update(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.customer_update.url,
      method: vueContext.state.customer_update.method,
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
  async customer_delete(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.customer_delete.url,
      method: vueContext.state.customer_delete.method,
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
  async customer_detail(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.customer_detail.url,
      method: vueContext.state.customer_detail.method,
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
  async list_favorite_customer(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.list_favorite_customer.url,
      method: vueContext.state.list_favorite_customer.method,
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

  async list_transaction_customer(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.list_transaction_customer.url,
      method: vueContext.state.list_transaction_customer.method,
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
  async export_customer_list(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.export_customer_list.url,
      method: vueContext.state.export_customer_list.method,
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
  async newsletter_list(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.newsletter_list.url,
      method: vueContext.state.newsletter_list.method,
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
  async export_newsletter_list(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.export_newsletter_list.url,
      method: vueContext.state.export_newsletter_list.method,
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
