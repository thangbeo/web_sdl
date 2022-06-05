import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '~/assets/configurations/API_Config.js'

const state = () => ({
  folder_upload: 'category-product',
  list: {
    url: 'cms/product_category/list/v2',
    method: 'GET',
  },
  delete: {
    url: 'cms/product_category/delete',
    method: 'POST',
  },
  add: {
    url: 'cms/product_category/add',
    method: 'POST',
  },
  detail: {
    url: 'cms/product_category/detail',
    method: 'GET',
  },
  edit: {
    url: 'cms/product_category/update',
    method: 'POST',
  },
  copy: {
    url: 'cms/product_category/clone',
    method: 'POST',
  },
  sort: {
    url: 'cms/product_category/number_index/update',
    method: 'POST',
  },
  product: {
    list: {
      url: 'cms/product/list',
      method: 'GET',
    },
    in_category: {
      url: 'cms/product_category/product/list',
      method: 'GET',
    },
    out_category: {
      url: 'cms/product_category/product/others/list',
      method: 'GET',
    },
  },
  utility: {
    convenient: {
      url: 'cms/common/convenient_services',
      method: 'GET',
    },
    location: {
      url: 'cms/common/around_location',
      method: 'GET',
    },
  },
  review: {
    url: 'cms/preview/product_category',
    method: 'POST',
  },
})

const mutations = {}

const actions = {
  async get_list(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.list.url,
      method: vueContext.state.list.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        channel: APIs.channel,
        transid,
        ...payload,
      },
    })
    return response
  },
  async delete_category(vueContext, payload) {
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
        product_category_id: payload,
      },
    })
    return response
  },
  async add_category(vueContext, payload) {
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
        ...payload,
      },
    })
    return response
  },
  async detail_category(vueContext, payload) {
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
        product_category_id: payload,
      },
    })
    return response
  },
  async edit_category(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.edit.url,
      method: vueContext.state.edit.method,
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
  async copy_category(vueContext, payload) {
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
        ...payload,
      },
    })
    return response
  },
  async sort_category(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.sort.url,
      method: vueContext.state.sort.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      data: {
        channel: APIs.channel,
        transid,
        ids: [...payload],
      },
    })
    return response
  },
  async list_product(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.product.list.url,
      method: vueContext.state.product.list.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        channel: APIs.channel,
        transid,
        ...payload,
      },
    })
    return response
  },
  async list_convenient_services(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.utility.convenient.url,
      method: vueContext.state.utility.convenient.method,
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
  async list_around_location(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.utility.location.url,
      method: vueContext.state.utility.location.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        channel: APIs.channel,
        transid,
        lang_id: 1,
      },
    })
    return response
  },
  async list_product_in_category(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.product.in_category.url,
      method: vueContext.state.product.in_category.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        channel: APIs.channel,
        transid,
        ...payload,
      },
    })
    return response
  },
  async list_product_out_category(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.product.out_category.url,
      method: vueContext.state.product.out_category.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        channel: APIs.channel,
        transid,
        ...payload,
      },
    })
    return response
  },
  async get_review(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.review.url,
      method: vueContext.state.review.method,
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
}

export default {
  state,
  mutations,
  actions,
}
