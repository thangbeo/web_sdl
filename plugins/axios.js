import APIs from '~/assets/configurations/API_Config'

// Axios interceptor. Auto log out when token is expired or invalid
export default function (context) {
  context.$axios.onResponse((response) => {
    const code = response.data.error.code
    const OK = APIs.responses.OK.code
    if (
      code === APIs.responses.TOKEN_EXPIRE.code ||
      code === APIs.responses.TOKEN_INVALID.code
    ) {
      context.app.$logout(context.app.router)
    } else if (code === OK) {
      return {
        error: false,
        data: response.data,
      }
    } else {
      if (!context.req) {
        context.app.router.app.$log.warn('Có lỗi khi gọi API: ', {
          response,
        })
        context.app.$showWarnNotify(
          context.app.router.app,
          APIs.responses[code].message
        )

        // context.app.$notify({
        //   group: 'login',
        //   type: 'warn',
        //   text: APIs.responses[code].message,
        // })
      }

      return {
        error: true,
        data: response.data,
      }
    }
  })

  context.$axios.onError((error) => {
    if (!context.req) {
      context.app.router.app.$log.error('Có lỗi/exception: ', {
        error,
        response: error.response,
      })
      context.app.$showError(
        context.app.router.app,
        'Có lỗi xảy ra khi kết nối đến server'
      )
    }

    return {
      error: true,
    }
  })
}
