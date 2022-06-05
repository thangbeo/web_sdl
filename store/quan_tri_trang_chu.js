import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'
import baseURL from '~/assets/configurations/BASE_URL'
export const state = () => {
  return {
    upload_file: {
      method: 'POST',
    },
    page_is_id: '',
    // thêm slider
    insert_slider: {
      url: 'cms/config/slider/insert',
      method: 'POST',
    },
    config_replication: {
      url: 'cms/config/replication',
      method: 'POST',
    },
    // chi tiết trang
    config_detail: {
      url: 'cms/config/list',
      method: 'GET',
    },
    // thêm mới video
    insert_video: {
      url: 'cms/config/video/insert',
      method: 'POST',
    },
    // thêm mới trang
    config_insert: {
      url: 'cms/config/insert',
      method: 'POST',
    },
    // thêm mới combo du lịch
    insert_combo: {
      url: 'cms/config/combo/insert',
      method: 'POST',
    },
    // thêm mới đối tác
    insert_partner: {
      url: 'cms/config/partner/insert',
      method: 'POST',
    },
    // xóa combo du lịch
    delete_combo: {
      url: 'cms/config/combo/delete',
      method: 'POST',
    },
    // reload_treeview: false,
    // cập nhật combo du lịch
    update_combo: {
      url: 'cms/config/combo/update',
      method: 'POST',
    },
    // cập nhật đối tác đồng hành
    update_partner: {
      url: 'cms/config/partner/update',
      method: 'POST',
    },
    // data_add_QTTT: []
  }
}
export const mutations = {
  page_id(state, payload) {
    state.page_is_id = payload
  },
}
export const actions = {
  async upload_file(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      baseURL: baseURL.BASE_UPLOAD,
      method: vueContext.state.upload_file.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        transid,
        channel: APIs.channel,
        folder_dir: data.folder,
        image_type: data.imageType,
        decode_image: data.decodeImage,
      },
      data: data.formData,
    })
    return response
  },
  async insert_slider(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.insert_slider.url,
      method: vueContext.state.insert_slider.method,
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
  async config_insert(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.config_insert.url,
      method: vueContext.state.config_insert.method,
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
  async insert_combo(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.insert_combo.url,
      method: vueContext.state.insert_combo.method,
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
  async insert_partner(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.insert_partner.url,
      method: vueContext.state.insert_partner.method,
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
  async delete_combo(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.delete_combo.url,
      method: vueContext.state.delete_combo.method,
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
  async update_combo(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.update_combo.url,
      method: vueContext.state.update_combo.method,
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
  async update_partner(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.update_partner.url,
      method: vueContext.state.update_partner.method,
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
  async insert_video(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.insert_video.url,
      method: vueContext.state.insert_video.method,
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
  async config_detail(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.config_detail.url,
      method: vueContext.state.config_detail.method,
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
  async config_replication(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.config_replication.url,
      method: vueContext.state.config_replication.method,
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
