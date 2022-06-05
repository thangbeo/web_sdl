import axios from 'axios'
import uniqid from 'uniqid'
import Cookies from 'js-cookie'

import firebase from 'firebase/app'
import 'firebase/messaging'

import APIs from '../assets/configurations/API_Config.js'
import GOOGLE from '~/assets/configurations/GOOGLE_MAP_API_KEY'

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBzmm6sp4VFkKaUTtP9ALEK3pCbat31UiI',
  authDomain: 'websdl.firebaseapp.com',
  databaseURL: 'https://websdl-default-rtdb.firebaseio.com',
  projectId: 'websdl',
  storageBucket: 'websdl.appspot.com',
  messagingSenderId: '820308151770',
  appId: '1:820308151770:web:5a02592c25e9f1eac504e3',
  measurementId: 'G-ZJD9YYSDW1',
}

export const state = () => ({
  use_ggmap: true,
  ip: '',
  roles: [],
  pageSizes: [10, 20, 50, 100, 150, 200, 300],
  getRoles: false,
  pageTitle: '',
  languages: [],
  currencies: [],
  language: {
    url: 'cms/common/language',
    method: 'GET',
  },
  role: {
    url: 'cms/admin/user_get_role',
    method: 'GET',
  },
  currency: {
    url: 'cms/common/currency',
    method: 'GET',
  },
  check_back: false,
  change_back: false,
  last_path: {
    url: 'cms/user/update/last_url_access',
    method: 'POST',
  },
  domain: {
    url: 'cms/config/system/domain_info',
    method: 'GET',
  },
  token_firebase: {
    url: 'cms/admin/update_token_key',
    method: 'POST',
  },
  notifications: {
    list: {
      url: 'cms/notification/list',
      method: 'GET',
    },
    detail: {
      url: 'cms/notification/detail',
      method: 'GET',
    },
  },
  domain_name: '',
  messaging: '',
  product_type: {
    hotel: 1,
    restaurant: 2,
    tour: 3,
    products: 4,
    product_in_post: 5,
  },
  type: {
    admin: 1,
    ncc: 2,
  },
  alert_display_time: 6000,
  config_map: {
    url: 'cms/config/system/map_config',
    method: 'GET',
  },
})

export const mutations = {
  ClientPrivateIP(state, ip) {
    state.ip = ip
  },
  setRole(state, payload) {
    state.roles = payload
    state.getRoles = true
  },
  setTitle(state, payload) {
    state.pageTitle = payload
  },
  setLanguages(state, payload) {
    state.languages = payload
  },
  setCurrencies(state, payload) {
    state.currencies = payload
  },
  checkBack(state, payload) {
    state.check_back = payload
  },
  changeBack(state) {
    state.change_back = !state.change_back
  },
  setDomain(state, payload) {
    state.domain_name = payload
  },
  setMessage(state, payload) {
    state.messaging = payload
  },
  setConfigMap(state, payload) {
    state.use_ggmap = payload
  },
}

export const actions = {
  async firebase_messaging(vueContext) {
    // firebase start
    !firebase.apps.length
      ? await firebase.initializeApp(FIREBASE_CONFIG)
      : await firebase.app()

    const messaging = await firebase.messaging()

    messaging
      .requestPermission()
      .then(() => {
        // console.log('Have permission !')
        return messaging.getToken()
      })
      .then((str) => {
        // console.log('Token: ', str)
        vueContext.dispatch('push_token_firebase', str)
      })
      .catch((error) => {
        // console.log('Error Occured: ', error)
        vueContext.app.router.app.$log.warn('Có lỗi khi gọi API: ', {
          error,
        })
      })

    messaging.onMessage((payload) => {
      vueContext.commit('setMessage', payload)
    })

    // firebase.app().delete()
    // firebase end
  },
  async GetRole(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.role.url,
      method: vueContext.state.role.method,
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
  async list_languages(vueContext, payload) {
    let token
    if (payload?.req) {
      try {
        token = payload.req.headers.cookie
          .split(';')
          .find((c) => c.trim().startsWith('token='))
          .split('=')[1]
      } catch (e) {
        token = ''
      }
    } else {
      token =
        (Cookies.get('token') || '').length !== 0 ? Cookies.get('token') : ''
    }
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.language.url,
      method: vueContext.state.language.method,
      headers: {
        Authorization: token,
      },
      params: {
        channel: APIs.channel,
        transid,
      },
    })
    if (!response.error) {
      vueContext.commit('setLanguages', response.data.data)
    }
    return response
  },
  async list_currencies(vueContext) {
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
      },
    })
    vueContext.commit('setCurrencies', response.data.data)
    return response
  },
  async get_address_to_ggmap(vueContext, payload) {
    const response = await axios({
      baseURL: 'https://maps.googleapis.com/maps/api/geocode/json',
      method: 'GET',
      params: {
        region: 'VN',
        key: GOOGLE.API_KEY_MAP,
        ...payload,
      },
    })
    let address = { district: '', province: '', location: '' }

    if (response.status === 200) {
      const addressDetail = response.data.results[0].address_components
      address = {
        district: addressDetail[addressDetail.length - 3].long_name,
        province: addressDetail[addressDetail.length - 2].long_name,
        location: { ...response.data.results[0].geometry.location },
      }
    }
    return address
  },
  async get_latlng_to_map(vueContext, payload) {
    const response = await axios({
      baseURL: 'https://nominatim.openstreetmap.org/search.php',
      method: 'GET',
      params: {
        ...payload,
      },
    })

    return response
  },
  async get_address_to_map(vueContext, payload) {
    const response = await axios({
      baseURL: 'https://nominatim.openstreetmap.org/reverse.php/',
      method: 'GET',
      params: {
        ...payload,
      },
    })

    return response
  },
  async set_last_url_access(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.last_path.url,
      method: vueContext.state.last_path.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      data: {
        channel: APIs.channel,
        transid,
        last_url_access: (payload || '').length !== 0 ? payload : '/',
      },
    })
    return response
  },
  async get_domain(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.domain.url,
      method: vueContext.state.domain.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        channel: APIs.channel,
        transid,
      },
    })
    vueContext.commit('setDomain', response.data.data.domain_name)
    return response
  },
  async push_token_firebase(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.token_firebase.url,
      method: vueContext.state.token_firebase.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      data: {
        channel: APIs.channel,
        transid,
        token_key: payload,
      },
    })
    return response
  },
  async list_notification(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.notifications.list.url,
      method: vueContext.state.notifications.list.method,
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
  async detail_notification(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.notifications.detail.url,
      method: vueContext.state.notifications.detail.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        channel: APIs.channel,
        transid,
        notification_id: payload,
      },
    })
    return response
  },
  async get_config_map(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      ...vueContext.state.config_map,
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
}

export const getters = {}
