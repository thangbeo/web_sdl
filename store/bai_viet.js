import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'

export const state = () => {
  return {
    // danh sách danh mục
    category_post: {
      url: 'cms/common/category_post',
      method: 'GET',
    },
    // xem trước
    preview_post: {
      url: 'cms/preview/post',
      method: 'POST',
    },
    // upload ảnh
    upload_folder: 'upload-posts',
    // cập nhật trạng thái bài viết
    update_status_post: {
      url: 'cms/admin/post/update/status',
      method: 'POST',
    },
    // list  bài viết
    list: {
      url: 'cms/admin/post/list',
      method: 'GET',
    },
    // chi tiết danh mục bài viết
    detail: {
      url: 'cms/admin/post/detail',
      method: 'GET',
    },
    // thêm mới  bài viết khuyến mại
    insert_promotions: {
      url: 'cms/admin/post/insert',
      method: 'POST',
    },
    // thêm mới mặc định
    insert_Default: {
      url: 'cms/admin/post/insert',
      method: 'POST',
    },
    // nhân bản danh mục bài viết
    // replication_post: {
    //   url: 'cms/admin/category/post/replication',
    //   method: 'POST',
    // },
    // sửa danh mục bài viết
    update: {
      url: 'cms/admin/post/update',
      method: 'POST',
    },
    // xóa  bài viết
    delete: {
      url: 'cms/admin/post/delete',
      method: 'POST',
    },
    // xem trước
    view: {
      url: 'cms/admin/post/view',
      method: 'GET',
    },
    // Lưu nháp
    save: {
      url: 'cms/admin/post/save',
      method: 'POST',
    },
  }
}
// export const mutations = {
//   toggle_reaload_treeview(state) {
//     state.reload_treeview = !state.reload_treeview
//   },
// }
export const actions = {
  // danh sách danh mục
  async category_post(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.category_post.url,
      method: vueContext.state.category_post.method,
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
  async update_status_post(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.update_status_post.url,
      method: vueContext.state.update_status_post.method,
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
  async list(vueContext, data) {
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
        ...data,
      },
    })
    return response
  },
  // thêm mới khuyến mại
  async insert_promotions(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.insert_promotions.url,
      method: vueContext.state.insert_promotions.method,
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
  // thêm mới mặc định
  async insert_Default(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.insert_Default.url,
      method: vueContext.state.insert_Default.method,
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
  async replication_post(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.replication_post.url,
      method: vueContext.state.replication_post.method,
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
      data: {
        channel: APIs.channel,
        transid,
        post_id: data,
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
  async preview_post(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.preview_post.url,
      method: vueContext.state.preview_post.method,
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
