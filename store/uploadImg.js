import uniqid from 'uniqid'
import Cookies from 'js-cookie'
import APIs from '../assets/configurations/API_Config.js'
import baseURL from '~/assets/configurations/BASE_URL'

export const state = () => {
  return {
    uploadFile: {
      method: 'POST',
    },
  }
}
export const actions = {
  async uploadFile(vueContext, data) {
    const transid = uniqid()
    const response = await this.$axios({
      baseURL: baseURL.BASE_UPLOAD,
      method: vueContext.state.uploadFile.method,
      headers: {
        Authorization: Cookies.get('token'),
      },
      params: {
        transid,
        channel: APIs.channel,
        folder_dir: data.folder,
      },
      data: data.formData,
    })
    return response
  },
}
