import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'

export const state = () => {
  return {
    // danh sách trang
    page_list: {
      url: 'cms/manage/page/list',
      method: 'GET',
    },
    // thêm mới trang
    page_insert: {
      url: 'cms/manage/page/insert',
      method: 'POST',
    },
    // chi tiết trang
    page_detail: {
      url: 'cms/manage/page/detail',
      method: 'GET',
    },
    // cập nhật trang
    page_update: {
      url: 'cms/manage/page/update',
      method: 'POST',
    },
    page_delete: {
      url: 'cms/manage/page/delete',
      method: 'POST',
    },
    // cập nhật trạng thái
    page_update_status: {
      url: 'cms/manage/page/update/status',
      method: 'POST',
    },
    // nhân bản trang
    page_clone: {
      url: 'cms/manage/page/clone',
      method: 'POST',
    },
    // xem trước trang cơ bản
    preview_page_basic: {
      url: 'cms/preview/page_basic',
      method: 'POST',
    },
    preview_page_home: {
      url: 'cms/preview/page_home',
      method: 'POST',
    },
  }
}
export const actions = {
  async page_list(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.page_list.url,
      method: vueContext.state.page_list.method,
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
      url: vueContext.state.page_detail.url,
      method: vueContext.state.page_detail.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        channel: APIs.channel,
        transid,
        page_id: data,
      },
    })
    return response
  },
  async page_delete(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.page_delete.url,
      method: vueContext.state.page_delete.method,
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
  async page_update_status(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.page_update_status.url,
      method: vueContext.state.page_update_status.method,
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
  async page_clone(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.page_clone.url,
      method: vueContext.state.page_clone.method,
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
  async page_update(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.page_update.url,
      method: vueContext.state.page_update.method,
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
  async preview_page_basic(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.preview_page_basic.url,
      method: vueContext.state.preview_page_basic.method,
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
  async preview_page_home(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.preview_page_home.url,
      method: vueContext.state.preview_page_home.method,
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
