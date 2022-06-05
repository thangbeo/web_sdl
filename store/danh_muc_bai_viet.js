import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'

export const state = () => {
  return {
    // upload ảnh
    folder_upload: 'category-posts',
    // cập nhật trạng thái bài viết
    update_status_post: {
      url: 'cms/admin/category/post/update/status',
      method: 'POST',
    },
    preview_post_category: {
      url: 'cms/preview/post_category',
      method: 'POST',
    },
    update_number_index_post: {
      url: 'cms/admin/category/post/update/number_index',
      method: 'POST',
    },
    // list danh mục bài viết
    list_post: {
      url: 'cms/admin/category/post/list',
      method: 'GET',
    },
    // chi tiết danh mục bài viết
    detail_post: {
      url: 'cms/admin/category/post/detail',
      method: 'GET',
    },
    // thêm mới danh mục bài viết
    insert_post: {
      url: 'cms/admin/category/post/insert',
      method: 'POST',
    },
    // nhân bản danh mục bài viết
    replication_post: {
      url: 'cms/admin/category/post/replication',
      method: 'POST',
    },
    // sửa danh mục bài viết
    update_post: {
      url: 'cms/admin/category/post/update',
      method: 'POST',
    },
    // danh sách bài viết không có trong danh mục
    out_post: {
      url: 'cms/admin/category/post/list/v1',
      method: 'GET',
    },
    // danh sách bài viết có trong danh mục
    in_post: {
      url: 'cms/admin/category/post/list/v2',
      method: 'GET',
    },
    // xóa danh mục bài viết
    delete_post: {
      url: 'cms/admin/category/post/delete',
      method: 'POST',
    },
    choose_post_type: null,
  }
}
export const mutations = {
  choose_is_post_type(state) {
    state.choose_post_type = !state.choose_post_type
  },
}
export const actions = {
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
  async list_post(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.list_post.url,
      method: vueContext.state.list_post.method,
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
  async insert_post(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.insert_post.url,
      method: vueContext.state.insert_post.method,
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
  async update_post(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.update_post.url,
      method: vueContext.state.update_post.method,
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
  async delete_post(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.delete_post.url,
      method: vueContext.state.delete_post.method,
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
  async detail_post(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.detail_post.url,
      method: vueContext.state.detail_post.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        channel: APIs.channel,
        transid,
        cat_post_id: data,
      },
    })
    return response
  },
  async out_post(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.out_post.url,
      method: vueContext.state.out_post.method,
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
  async in_post(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.in_post.url,
      method: vueContext.state.in_post.method,
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
  async update_number_index_post(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.update_number_index_post.url,
      method: vueContext.state.update_number_index_post.method,
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
  async preview_post_category(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.preview_post_category.url,
      method: vueContext.state.preview_post_category.method,
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
