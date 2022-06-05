import Cookies from 'js-cookie'
const state = () => ({
  APIs: {
    getProductAttrList: {
      url: 'cms/attribute/list',
      method: 'GET',
    },
    getProductAttrTypes: {
      url: 'cms/attribute/dictionary',
      method: 'GET',
    },
    saveProductAttr: {
      url: 'cms/attribute/add',
      method: 'POST',
    },
    updateProductAttr: {
      url: 'cms/attribute/update',
      method: 'POST',
    },
    deleteProdAttr: {
      url: 'cms/attribute/delete',
      method: 'POST',
    },
    getProdAttrInfo: {
      url: 'cms/attribute/detail',
      method: 'GET',
    },
    getDefaultProdAttr: {
      url: 'cms/attribute_set/attribute_default_in_set',
      type: 'GET',
    },
  },
  attrTypes: {
    textField: 1,
    textArea: 2,
    date: 3,
    dateTime: 4,
    switch: 5,
    select: 6,
    multiSelect: 7,
    radio: 8,
    checkbox: 9,
    price: 10,
    number: 11,
    image: 12,
    video: 13,
  },
  fieldTypes: {
    normal: 1,
    selections: 2,
  },
})

const mutations = {}

const actions = {
  // Hàm gọi API lấy danh sách thuộc tính sản phẩm
  async getProductAttrList(vueContext, payload) {
    const response = await this.$axios({
      ...vueContext.state.APIs.getProductAttrList,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        ...payload,
      },
    })

    return response
  },

  // Hàm gọi API lấy danh sách thuộc tính sản phẩm mặc định
  async getDefaultProdAttr(vueContext, payload) {
    const response = await this.$axios({
      ...vueContext.state.APIs.getDefaultProdAttr,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        ...payload,
      },
    })

    return response
  },

  // Hàm gọi API lấy danh sách loại thuộc tính sản phẩm
  async getProductAttrTypes(vueContext, payload) {
    const response = await this.$axios({
      ...vueContext.state.APIs.getProductAttrTypes,
      headers: {
        Authorization: Cookies.get('token'),
      },
    })

    return response
  },

  // Hàm gọi API lưu mới thuộc tính sản phẩm
  async saveProductAttr(vueContext, payload) {
    const response = await this.$axios({
      ...vueContext.state.APIs.saveProductAttr,
      headers: {
        Authorization: Cookies.get('token'),
      },
      data: {
        ...payload,
      },
    })

    return response
  },

  // Hàm gọi API xóa thuộc tính sản phẩm
  async deleteProdAttr(vueContext, payload) {
    const response = await this.$axios({
      ...vueContext.state.APIs.deleteProdAttr,
      headers: {
        Authorization: Cookies.get('token'),
      },
      data: {
        ...payload,
      },
    })

    return response
  },

  // Hàm gọi API lấy thông tin chi tiết thuộc tính sản phẩm
  async getProdAttrInfo(vueContext, payload) {
    const response = await this.$axios({
      ...vueContext.state.APIs.getProdAttrInfo,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        ...payload,
      },
    })

    return response
  },

  // Hàm gọi API cập nhật thông tin thuộc tính sản phẩm
  async updateProductAttr(vueContext, payload) {
    const response = await this.$axios({
      ...vueContext.state.APIs.updateProductAttr,
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
