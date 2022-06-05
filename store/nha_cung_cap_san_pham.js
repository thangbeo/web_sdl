import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '~/assets/configurations/API_Config.js'

const state = () => ({
  open_copy: false,
  editorOption: {
    theme: 'snow',
    modules: {
      // toolbar: '#toolbar'
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'][({ header: 1 }, { header: 2 })],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['clean'],
        ['link', 'image', 'video'],
      ],
    },
    placeholder: 'Nội dung',
  },
  open_cancel: false,
  open_save: false,
  list: {
    url: 'cms/product/list',
    method: 'GET',
  },
  status: {
    url: 'cms/product/status/update',
    method: 'POST',
  },
  approval_status: {
    url: 'cms/product/approval_status/update',
    method: 'POST',
  },
  delete: {
    url: 'cms/product/delete',
    method: 'POST',
  },
  copy: {
    url: 'cms/product/clone',
    method: 'POST',
  },
  auto_browse: {
    url: 'cms/approval/config/info',
    method: 'GET',
  },
  auto_browse_change: {
    url: 'cms/approval/config/update/product/status',
    method: 'POST',
  },
  type: {
    url: 'cms/common/product_type',
    method: 'GET',
  },
  attribute: {
    url: 'cms/product_category/attribute/list',
    method: 'GET',
  },
  hotel: {
    add: {
      url: 'cms/hotel/add',
      method: 'POST',
    },
    edit: {
      url: 'cms/hotel/update',
      method: 'POST',
    },
    sku: {
      url: 'cms/hotel/generate_sku',
      method: 'GET',
    },
    type: {
      url: 'cms/common/hotel_types',
      method: 'GET',
    },
    convenient: {
      url: 'cms/common/convenient_services',
      method: 'GET',
    },
    category: {
      url: 'cms/common/product_category',
      method: 'GET',
    },
    enterprise: {
      url: 'cms/common/enterprise',
      method: 'GET',
    },
    rest_room_services: {
      url: 'cms/common/rest_room_services',
      method: 'GET',
    },
    room_type: {
      url: 'cms/common/room_type',
      method: 'GET',
    },
    bed_type: {
      url: 'cms/common/bed_type',
      method: 'GET',
    },
    detail: {
      url: 'cms/hotel/detail',
      method: 'GET',
    },
    review: {
      url: 'cms/preview/hotel',
      method: 'POST',
    },
  },
  restaurant: {
    sku: {
      url: 'cms/restaurant/generate_sku',
      method: 'GET',
    },
    dish: {
      url: 'cms/common/dish_type',
      method: 'GET',
    },
    type: {
      url: 'cms/common/restaurant_type',
      method: 'GET',
    },
    add: {
      url: 'cms/restaurant/add',
      method: 'POST',
    },
    detail: {
      url: 'cms/restaurant/detail',
      method: 'GET',
    },
    edit: {
      url: 'cms/restaurant/update',
      method: 'POST',
    },
    review: {
      url: 'cms/preview/restaurant',
      method: 'POST',
    },
  },
  tour: {
    sku: {
      url: 'cms/tour/generate_sku',
      method: 'GET',
    },
    type: {
      url: 'cms/common/tour_type',
      method: 'GET',
    },
    vehicle: {
      url: 'cms/common/vehicle_type',
      method: 'GET',
    },
    province: {
      url: 'cms/common/province',
      method: 'GET',
    },
    district: {
      url: 'cms/common/district',
      method: 'GET',
    },
    add: {
      url: 'cms/tour/add',
      method: 'POST',
    },
    edit: {
      url: 'cms/tour/update',
      method: 'POST',
    },
    detail: {
      url: 'cms/tour/detail',
      method: 'GET',
    },
    review: {
      url: 'cms/preview/tour',
      method: 'POST',
    },
  },
  enterprice: {
    url: 'cms/common/enterprise',
    method: 'GET',
  },
  room: {
    add: {
      url: 'cms/hotel/rest_room/add',
      method: 'POST',
    },
    edit: {
      url: 'cms/hotel/rest_room/update',
      method: 'POST',
    },
    delete: {
      url: 'cms/hotel/rest_room/delete',
      method: 'POST',
    },
    sort: {
      url: 'cms/hotel/sort',
      method: 'POST',
    },
  },
  export: {
    url: 'cms/export/product/list',
    method: 'GET',
    // method: 'POST',
  },
  list_suggestions: {
    in: {
      url: 'cms/product/suggestions',
      method: 'GET',
    },
    out: {
      url: 'cms/product/suggestions/others',
      method: 'GET',
    },
  },
})

const mutations = {
  change_copy(state) {
    state.open_copy = !state.open_copy
  },
  toggle_cancel(state) {
    state.open_cancel = !state.open_cancel
  },
  toggle_save(state) {
    state.open_save = !state.open_save
  },
}

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
  async change_status(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.status.url,
      method: vueContext.state.status.method,
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
  async change_approval_status(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.approval_status.url,
      method: vueContext.state.approval_status.method,
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
  async delete_product(vueContext, payload) {
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
        items: [...payload],
      },
    })
    return response
  },
  async copy_product(vueContext, payload) {
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
  async auto_browse_product(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.auto_browse.url,
      method: vueContext.state.auto_browse.method,
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
  async change_auto_browse_product(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.auto_browse_change.url,
      method: vueContext.state.auto_browse_change.method,
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
  async product_attribute(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.attribute.url,
      method: vueContext.state.attribute.method,
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
  async hotel_gen_sku(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.hotel.sku.url,
      method: vueContext.state.hotel.sku.method,
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
  async hotel_type(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.hotel.type.url,
      method: vueContext.state.hotel.type.method,
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
  async hotel_convenient_services(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.hotel.convenient.url,
      method: vueContext.state.hotel.convenient.method,
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
  async hotel_category(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.hotel.category.url,
      method: vueContext.state.hotel.category.method,
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
  async hotel_enterprise(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.hotel.enterprise.url,
      method: vueContext.state.hotel.enterprise.method,
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
  async hotel_rest_room_services(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.hotel.rest_room_services.url,
      method: vueContext.state.hotel.rest_room_services.method,
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
  async hotel_room_type(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.hotel.room_type.url,
      method: vueContext.state.hotel.room_type.method,
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
  async hotel_bed_type(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.hotel.bed_type.url,
      method: vueContext.state.hotel.bed_type.method,
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
  async add_hotel(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.hotel.add.url,
      method: vueContext.state.hotel.add.method,
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
  async edit_hotel(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.hotel.edit.url,
      method: vueContext.state.hotel.edit.method,
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
  async hotel_detail(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.hotel.detail.url,
      method: vueContext.state.hotel.detail.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        channel: APIs.channel,
        transid,
        hotel_id: payload,
      },
    })
    return response
  },
  async review_hotel(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.hotel.review.url,
      method: vueContext.state.hotel.review.method,
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
  async review_restaurant(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.restaurant.review.url,
      method: vueContext.state.restaurant.review.method,
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
  async review_tour(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.tour.review.url,
      method: vueContext.state.tour.review.method,
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
  async restaurant_detail(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.restaurant.detail.url,
      method: vueContext.state.restaurant.detail.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        channel: APIs.channel,
        transid,
        restaurant_id: payload,
      },
    })
    return response
  },
  async tour_detail(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.tour.detail.url,
      method: vueContext.state.tour.detail.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        channel: APIs.channel,
        transid,
        tour_id: payload,
      },
    })
    return response
  },
  async restaurant_gen_sku(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.restaurant.sku.url,
      method: vueContext.state.restaurant.sku.method,
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
  async restaurant_dish_type(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.restaurant.dish.url,
      method: vueContext.state.restaurant.dish.method,
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
  async restaurant_type(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.restaurant.type.url,
      method: vueContext.state.restaurant.type.method,
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
  async restaurant_add(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.restaurant.add.url,
      method: vueContext.state.restaurant.add.method,
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
  async restaurant_edit(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.restaurant.edit.url,
      method: vueContext.state.restaurant.edit.method,
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
  async tour_gen_sku(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.tour.sku.url,
      method: vueContext.state.tour.sku.method,
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
  async tour_vehicle(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.tour.vehicle.url,
      method: vueContext.state.tour.vehicle.method,
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
  async tour_type(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.tour.type.url,
      method: vueContext.state.tour.type.method,
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
  async tour_province(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.tour.province.url,
      method: vueContext.state.tour.province.method,
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
  async tour_district(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.tour.district.url,
      method: vueContext.state.tour.district.method,
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
  async tour_add(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.tour.add.url,
      method: vueContext.state.tour.add.method,
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
  async tour_edit(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.tour.edit.url,
      method: vueContext.state.tour.edit.method,
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
  async get_enterprice(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.enterprice.url,
      method: vueContext.state.enterprice.method,
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
  async room_add(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.room.add.url,
      method: vueContext.state.room.add.method,
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
  async room_edit(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.room.edit.url,
      method: vueContext.state.room.edit.method,
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
  async room_delete(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.room.delete.url,
      method: vueContext.state.room.delete.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      data: {
        channel: APIs.channel,
        transid,
        rest_room_ids: payload,
      },
    })
    return response
  },
  async room_sort(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.room.sort.url,
      method: vueContext.state.room.sort.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      data: {
        channel: APIs.channel,
        transid,
        ids: payload,
      },
    })
    return response
  },
  async export_file(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.export.url,
      method: vueContext.state.export.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      // data: {
      //   channel: APIs.channel,
      //   transid,
      //   ...payload,
      // },
      params: {
        channel: APIs.channel,
        transid,
        ...payload,
      },
    })
    return response
  },
  async get_list_suggestion_in(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.list_suggestions.in.url,
      method: vueContext.state.list_suggestions.in.method,
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
  async get_list_suggestion_out(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.list_suggestions.out.url,
      method: vueContext.state.list_suggestions.out.method,
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
}

export default {
  state,
  mutations,
  actions,
}
