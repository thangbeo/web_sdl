// import ULT from '~/plugins/ult'
import URL_TO_LOGIN_SSO from '../assets/configurations/URL_SSO.js'

export default function (context) {
  // if (context.req !== undefined) {
  //   context.store.commit(
  //     'app/ClientPrivateIP',
  //     context.req.socket._peername.address
  //   )
  // }
  if (context.route.path === '/admin') {
    context.store.dispatch('login/isAuthenticated', context.req).then((res) => {
      if (res.length === 0 || res.length === undefined) {
        context.redirect('/login')
      }
    })
  } else if (context.route.path === '/login') {
    context.store.dispatch('login/isAuthenticated', context.req).then((res) => {
      if (res.length !== 0) {
        context.redirect('/dashboard')
      }
    })
  } else if ((context.route.query.code || '').length !== 0) {
    return true
  } else {
    context.store
      .dispatch('login/isAuthenticated', context.req)
      .then((res) => {
        if (res.length === 0 || res.length === undefined) {
          context.redirect(URL_TO_LOGIN_SSO)
        }
      })
      .catch((e) => {
        context.redirect(URL_TO_LOGIN_SSO)
      })
  }
}
