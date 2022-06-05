import Cookies from 'js-cookie'
const state = () => ({
  APIs: {
    getProductAttrSetList: {
      url: 'cms/attribute_set/list',
      method: 'GET',
    },
    getProviderProductAttrSetList: {
      url: 'cms/attribute_set/list/ncc',
      method: 'GET',
    },
    saveProductAttrSet: {
      url: 'cms/attribute_set/add',
      method: 'POST',
    },
    updateProductAttrSet: {
      url: 'cms/attribute_set/update',
      method: 'POST',
    },
    deleteProdAttrSet: {
      url: 'cms/attribute_set/delete',
      method: 'POST',
    },
    getProdAttrSetInfo: {
      url: 'cms/attribute_set/detail',
      method: 'GET',
    },
    cloneProdAttrSet: {
      url: 'cms/attribute_set/clone',
      method: 'POST',
    },
  },
})

const mutations = {}

const actions = {
  // Hàm gọi API lấy danh sách bộ thuộc tính sản phẩm
  async getProductAttrSetList(vueContext, payload) {
    const response = await this.$axios({
      ...vueContext.state.APIs.getProductAttrSetList,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        ...payload,
      },
    })

    return response
  },

  // Hàm gọi API lấy danh sách bộ thuộc tính sản phẩm do NCC tạo
  async getProviderProductAttrSetList(vueContext, payload) {
    const response = await this.$axios({
      ...vueContext.state.APIs.getProviderProductAttrSetList,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        ...payload,
      },
    })

    return response
  },

  // Hàm gọi API lưu mới bộ thuộc tính sản phẩm
  async saveProductAttrSet(vueContext, payload) {
    const response = await this.$axios({
      ...vueContext.state.APIs.saveProductAttrSet,
      headers: {
        Authorization: Cookies.get('token'),
      },
      data: {
        ...payload,
      },
    })

    return response
  },

  // Hàm gọi API xóa bộ thuộc tính sản phẩm
  async deleteProdAttrSet(vueContext, payload) {
    const response = await this.$axios({
      ...vueContext.state.APIs.deleteProdAttrSet,
      headers: {
        Authorization: Cookies.get('token'),
      },
      data: {
        ...payload,
      },
    })

    return response
  },

  // Hàm gọi API lấy thông tin chi tiết bộ thuộc tính sản phẩm
  async getProdAttrSetInfo(vueContext, payload) {
    const response = await this.$axios({
      ...vueContext.state.APIs.getProdAttrSetInfo,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        ...payload,
      },
    })

    return response
  },

  // Hàm gọi API cập nhật thông tin bộ thuộc tính sản phẩm
  async updateProductAttrSet(vueContext, payload) {
    const response = await this.$axios({
      ...vueContext.state.APIs.updateProductAttrSet,
      headers: {
        Authorization: Cookies.get('token'),
      },
      data: {
        ...payload,
      },
    })

    return response
  },

  // Hàm gọi API nhân bản bộ thuộc tính
  async cloneProdAttrSet(vueContext, payload) {
    const response = await this.$axios({
      ...vueContext.state.APIs.cloneProdAttrSet,
      headers: {
        Authorization: Cookies.get('token'),
      },
      data: {
        ...payload,
      },
    })

    return response
  },
}

const getters = {}

export default {
  state,
  mutations,
  actions,
  getters,
}
