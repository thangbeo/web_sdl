import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'

export const state = () => {
  return {
    getDashboard: {
      url: 'dashboard/general_report',
      method: 'GET',
    },
    // danh sách khách hàng
    getListCustomer: {
      url: 'dashboard/customer_report',
      method: 'GET',
    },
    // danh sách nhà cung cấp
    getListEnterprise: {
      url: 'dashboard/enterprise_report',
      method: 'GET',
    },
    // Chart
    getListChart: {
      url: 'dashboard/transaction_report',
      method: 'GET',
    },
  }
}

export const actions = {
  async getDashboard(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.getDashboard.url,
      method: vueContext.state.getDashboard.method,
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
  // danh sách khách hàng
  async getListCustomer(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.getListCustomer.url,
      method: vueContext.state.getListCustomer.method,
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
  // danh sách nhà cung cấp
  async getListEnterprise(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.getListEnterprise.url,
      method: vueContext.state.getListEnterprise.method,
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
  // Chart
  async getListChart(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      url: vueContext.state.getListChart.url,
      method: vueContext.state.getListChart.method,
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
}
