import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '~/assets/configurations/API_Config'

export const state = () => ({
  logging: false,
  login: {
    url: 'cms/admin/login',
    method: 'POST',
  },
  login_sso: {
    url: 'cms/admin/sso',
    method: 'GET',
  },
  logout_sso: {
    url: 'cms/admin/logout',
    method: 'GET',
  },
})

export const mutations = {
  setLogging(state, payload) {
    state.logging = payload
  },
}

export const actions = {
  isAuthenticated(vueContext, req) {
    if (req) {
      let token
      try {
        token = req.headers.cookie
          .split(';')
          .find((c) => c.trim().startsWith('token='))
          .split('=')[1]
      } catch (e) {
        token = ''
      }
      return token
    } else {
      const token =
        (Cookies.get('token') || '').length !== 0 ? Cookies.get('token') : ''
      return token
    }
  },
  async Submit(vueContext, payload) {
    // Start calling API
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.login.url,
      method: vueContext.state.login.method,
      // headers: {
      //   ip: payload.ip,
      // },
      data: {
        channel: APIs.channel,
        transid,
        ...payload,
      },
    })
    return response
  },
  async loginSso(vueContext, payload) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.login_sso.url,
      method: vueContext.state.login_sso.method,
      params: {
        channel: APIs.channel,
        transid,
        code: payload,
      },
    })
    return response
  },
  async logoutSso(vueContext) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.logout_sso.url,
      method: vueContext.state.logout_sso.method,
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
  async logout_sso_sdl() {
    const response = await this.$axios({
      baseURL: 'https://login.yenbai.gov.vn/oidc/logout',
      method: 'GET',
      params: {
        id_token_hint: Cookies.get('token_hint'),
      },
    })
    return response
  },
}
