import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '~/assets/configurations/API_Config.js'

const state = () => ({
  getlist: {
    url: 'cms/transaction/admin/list',
    method: 'GET',
  },
  detail: {
    url: 'cms/transaction/detail',
    method: 'GET',
  },
  add_hotel: {
    url: 'cms/booking/hotel',
    method: 'POST',
  },
  add_tour: {
    url: 'cms/booking/tour',
    method: 'POST',
  },
  add_restaurant: {
    url: 'cms/booking/restaurant',
    method: 'POST',
  },
  type: {
    url: 'cms/common/product_type',
    method: 'GET',
  },
  nation: {
    url: 'cms/common/nation',
    method: 'GET',
  },
  room_type: {
    url: 'cms/transaction/get_hotel_rest_room',
    method: 'GET',
  },
  name_hotel: {
    url: 'cms/product/dictionary/hotel',
    method: 'GET',
  },
  name_tour: {
    url: 'cms/product/dictionary/tour',
    method: 'GET',
  },
  name_restaurant: {
    url: 'cms/product/dictionary/restaurant',
    method: 'GET',
  },
  export_excel: {
    url: 'cms/export/transaction/list',
    method: 'POST',
  },
  tour_price: {
    url: 'cms/transaction/tour_price_calculate',
    method: 'GET',
  },
  hotel_price: {
    url: 'cms/transaction/hotel_price_calculate',
    method: 'GET',
  },
  change_status: {
    url: 'cms/transaction/update/order_status',
    method: 'POST',
  },
  list_shedule_tour: {
    url: 'cms/transaction/get_tour_depart_schedule',
    method: 'GET',
  },
  price_tour: {
    url: 'cms/transaction/get_tour_price',
    method: 'GET',
  },
  get_room_price: {
    url: 'cms/transaction/get_rest_room_price',
    method: 'GET',
  },
  currency: {
    url: 'cms/common/currency',
    method: 'GET',
  },
  check_rest_room: {
    url: 'cms/booking/check_rest_room_available',
    method: 'GET',
  },
  province_list: {
    url: 'cms/common/province/list',
    method: 'GET',
  },
  district_list: {
    url: 'cms/common/district/list',
    method: 'GET',
  },
  ward_list: {
    url: 'cms/common/ward/list',
    method: 'GET',
  },
  tourism_product: {
    url: 'cms/product/dictionary/products',
    method: 'GET',
  },
  price_tourism_product: {
    url: 'cms/transaction/products_price_calculate',
    method: 'GET',
  },
  add_tourism_product: {
    url: 'cms/booking/products',
    method: 'POST',
  },
})

const mutations = {}

const actions = {
  async export_excel(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.export_excel.url,
      method: vueContext.state.export_excel.method,
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

  async change_status(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.change_status.url,
      method: vueContext.state.change_status.method,
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

  async product_type(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.type.url,
      method: vueContext.state.type.method,
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
  async nation(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.nation.url,
      method: vueContext.state.nation.method,
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
  async room_type(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.room_type.url,
      method: vueContext.state.room_type.method,
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
  async name_hotel(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.name_hotel.url,
      method: vueContext.state.name_hotel.method,
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
  async name_tour(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.name_tour.url,
      method: vueContext.state.name_tour.method,
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
  async name_restaurant(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.name_restaurant.url,
      method: vueContext.state.name_restaurant.method,
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
  async add_hotel(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.add_hotel.url,
      method: vueContext.state.add_hotel.method,
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
  async add_tour(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.add_tour.url,
      method: vueContext.state.add_tour.method,
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
  async add_restaurant(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.add_restaurant.url,
      method: vueContext.state.add_restaurant.method,
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
  async tour_price(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.tour_price.url,
      method: vueContext.state.tour_price.method,
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
  async hotel_price(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.hotel_price.url,
      method: vueContext.state.hotel_price.method,
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
  async price_tour(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.price_tour.url,
      method: vueContext.state.price_tour.method,
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
  async list_shedule_tour(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.list_shedule_tour.url,
      method: vueContext.state.list_shedule_tour.method,
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
  async get_room_price(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.get_room_price.url,
      method: vueContext.state.get_room_price.method,
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
  async currency(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.currency.url,
      method: vueContext.state.currency.method,
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
  async check_rest_room(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.check_rest_room.url,
      method: vueContext.state.check_rest_room.method,
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
  async province_list(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.province_list.url,
      method: vueContext.state.province_list.method,
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
  async district_list(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.district_list.url,
      method: vueContext.state.district_list.method,
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
  async ward_list(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.ward_list.url,
      method: vueContext.state.ward_list.method,
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
  async tourism_product(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.tourism_product.url,
      method: vueContext.state.tourism_product.method,
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
  async price_tourism_product(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.price_tourism_product.url,
      method: vueContext.state.price_tourism_product.method,
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
  async add_tourism_product(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.add_tourism_product.url,
      method: vueContext.state.add_tourism_product.method,
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
