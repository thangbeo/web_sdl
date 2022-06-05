/* eslint-disable eqeqeq */
import Cookies from 'js-cookie'
import 'vue2-animate/dist/vue2-animate.min.css'
import moment from 'moment'
import numeral from 'numeral'

import URL_TO_LOGIN_SSO from '../assets/configurations/URL_SSO.js'
// import { app } from '../../store/app'
export default (context, inject) => {
  inject('showErrorNotify', (app, errors, text) => {
    context.app.$showLogError(errors, text)
    context.app.$showNotify(app, 'error', text)
  })

  // Hiển thị thông báo lỗi
  inject('showError', (app, text) => {
    context.app.$showNotify(app, 'error', text)
  })

  // Hiển thị thông báo thành công
  inject('showSuccess', (app, text) => {
    context.app.$showNotify(app, 'success', text)
  })

  // Show log lỗi. (Đã cũ. Không dùng)
  inject('showLogError', (errors, text) => {
    const response = errors.response
    const request = errors.request
    // eslint-disable-next-line no-console
    console.log(text, {
      response,
      request,
      errors,
    })
  })

  // Log dữ liệu. (Đã cũ. Không nên dùng)
  inject('showLog', (text, res = null) => {
    // eslint-disable-next-line no-console
    console.log(text, res)
  })

  // Hiển thị thông báo
  inject('showNotify', (app, type, text) => {
    app.$notify({
      group: 'main',
      type,
      text,
      // duration:5000,
      // position:'top right'
    })
  })

  // Hiển thị cảnh báo
  inject('showWarnNotify', (app, text) => {
    context.app.$showNotify(app, 'warn', text)
  })

  // Check số
  inject('isNumber', (str) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const number = parseInt(str)
      return true
    } catch {
      return false
    }
  })

  inject('isNumberTransition', (number) => {
    const str = number + ''
    const strNumber = '0123456789'
    let count = 0
    for (let i = 0; i < str.length; i++) {
      if (!strNumber.includes(str[i])) {
        count += 1
      }
    }
    if (count > 0) {
      return false
    } else {
      return true
    }
  })

  // Giới hạn ký tự
  inject('limitString', (str, number, display) => {
    if (context.app.$isNullOrEmpty(str)) return 'Không được để trống.'
    if (str.length < number)
      return display.length > 0
        ? display + ' không được ít hơn ' + number + ' ký tự.'
        : 'Không được ít hơn ' + number + ' ký tự.'
  })

  // Check ký tự đặc biệt
  inject('isHasSpecial', (str) => {
    const sp = "~;+@#$%^&*(){} |=-'"
    const strLower = str.toLowerCase()
    let isOK = false
    for (let i = 0; i < strLower.length; i++) {
      if (sp.includes(strLower[i])) {
        isOK = true
        break
      }
    }
    return isOK
  })

  // Check tiếng việt
  inject('isHasVietnamese', (str) => {
    const vn =
      'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ'
    const strLower = str.toLowerCase()

    let isOK = false
    for (let i = 0; i < strLower.length; i++) {
      if (vn.includes(strLower[i])) {
        isOK = true
        break
      }
    }
    // console.log(isOK)
    return isOK
  })

  // Check rỗng
  inject('isNullOrEmpty', (str) => {
    return str === null || str === undefined || str === '' || str.length === 0
  })
  inject('isObject', (obj) => {
    // eslint-disable-next-line eqeqeq
    return obj == null || obj == undefined
  })
  inject('isRegex', (str) => {
    const regex = /^[a-zA-Z]+\D*$/
    return regex.test(str)
  })
  // regex check sdt mobifone
  inject('isMobilePhone', (str) => {
    const phoneNot84 = /[0]{1}[35789]{1}[0-9]{8}$/
    const phone84 = /^[84]{2}[35789]{1}[0-9]{8}$/
    const phone024 = /^[024]{2}[23456789]{1}[0-9]{8}$/
    return phoneNot84.test(str) || phone84.test(str) || phone024.test(str)
  })

  // Validate email
  inject('isEmail', (str) => {
    // eslint-disable-next-line no-useless-escape
    const email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return email.test(str)
  })

  // Validate IP Address
  inject('isIPAddress', (str) => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return ipRegex.test(str)
  })

  inject('getDateVN', (strDate) => {
    if (!strDate) return ''
    if (strDate.indexOf(' ')) strDate = strDate.split(' ')[0]
    return strDate
  })

  inject('formatDateVNToISO', (strDate) => {
    if (!strDate) return ''
    if (strDate.indexOf(' ')) strDate = strDate.split(' ')[0]
    const [day, month, year] = strDate.split('/')
    return `${year}-${month}-${day}`
  })

  // strDate=yyy-mm-dd   to dd-mm-yyyy_HH:mm:ss
  inject('formatDateISOToDbFormat', (strDate, strMin = '') => {
    if (!strDate) return ''
    const [year, month, day] = strDate.split('-')

    strDate = `${day}-${month}-${year}`
    if (strMin == undefined || strMin == '') return strDate + `_00:00:00`
    else {
      if (strMin.length == 5) return strDate + '_' + strMin + ':00'
      return strDate + '_' + strMin
    }
    // return `${day}/${month}/${year}_00:00:00`
  })

  // format ngày YYYY-MM-DD to DD-MM-YYYY
  inject('ymdToDmy', (str) => {
    str = str.split('-')
    const parsed = str[2] + '-' + str[1] + '-' + str[0]
    return parsed
  })
  inject('ymdToD', (str) => {
    str = str.split('-')
    const parsed = str[2] + '/' + str[1] + '/' + str[0]
    return parsed
  })

  // -------PERMISSION ---------------------

  // truy cap duoc url nay ko
  inject('isAccessUrl', (roles, url) => {
    // let lst_page = roles
    const result =
      Array.from(roles).find((p) => p.page_url === url) !== undefined
    return result
  })

  // Check quyền
  inject('isAccessAction', (roles, pageId, actionId) => {
    // const page = Array.from(roles).find((p) => p.id === pageId)
    // if (page == undefined) return false

    let isExit = false
    if ((roles || []).length !== 0) {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].id === pageId) {
          isExit = true
        }
      }
    } else {
      isExit = false
    }
    return isExit
    // const roleId = page.role_list
    // if (!isNaN(roleId)) {
    //   return roleId == actionId
    // }
    //
    // const lstRole = roleId.split(',')
    // // console.log(lstRole, 'ROLEs')
    // let isExit = false
    // lstRole.forEach((r) => {
    //   if (!isExit && parseInt(r) == actionId) {
    //     isExit = true
    //   }
    // })

    // return isExit
  })

  // bỏ dấu tiếng Việt
  inject('removeAccents', (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ|A/g, 'a')
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ|E/g, 'e')
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ|I/g, 'i')
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ|O/g, 'o')
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ|U/g, 'u')
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ|Y/g, 'y')
    str = str.replace(/Đ|D/g, 'd')
    str = str.toLowerCase()
    return str
  })

  // Check role
  inject('checkRole', (actionId, pageId) => {
    const isAllowed = context.app.$isAccessAction(
      context.store.state.app.roles,
      pageId,
      actionId
    )
    return isAllowed
  })

  // Logout
  inject('logout', (router) => {
    Object.keys(Cookies.get()).forEach(function (cookieName) {
      const neededAttributes = {
        // Here you pass the same attributes that were used when the cookie was created
        // and are required when removing the cookie
      }
      Cookies.remove(cookieName, neededAttributes)
    })

    // router.redirect(URL_TO_LOGIN_SSO)
    window.location.href = URL_TO_LOGIN_SSO
  })

  // Token invalid
  inject('TokenInvalid', (UID, request, response) => {
    // eslint-disable-next-line no-console
    console.log('[ ' + UID + ' ] Token hết hạn hoặc không hợp lệ: ', {
      request,
      response,
    })
    context.app.$logout()
    return {
      error: true,
    }
  })

  // Format currency
  inject('formatMoney', (payload) => {
    try {
      let decimalCount = 0
      const thousands = ','
      const decimal = '.'

      if (payload.amount != parseInt(payload.amount)) {
        const str = (payload.amount + '').split('.')[1]
        decimalCount = str.length
      }

      const negativeSign = payload.amount < 0 ? '-' : ''

      const i = parseInt(
        (payload.amount = Math.abs(Number(payload.amount) || 0).toFixed(
          decimalCount
        ))
      ).toString()
      const j = i.length > 3 ? i.length % 3 : 0

      return (
        negativeSign +
        (j ? i.substr(0, j) + thousands : '') +
        i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
        (decimalCount
          ? decimal +
            Math.abs(payload.amount - i)
              .toFixed(decimalCount)
              .slice(2)
          : '')
      )
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  })

  // Buffer to string 64
  inject('bufferTo64', (array) => {
    const uint8 = new Uint8Array(array)
    const string = uint8.reduce((data, byte) => {
      return data + String.fromCharCode(byte)
    }, '') // String.fromCharCode(...unit8)
    const base64string = btoa(string)
    return base64string
  })

  // Vẽ captcha
  inject('createCaptcha', () => {
    // clear the contents of captcha div first
    window.document.getElementById('captchaInput').innerHTML = ''
    const charsArray =
      'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lengthOtp = 6
    const captcha = []
    for (let i = 0; i < lengthOtp; i++) {
      // below code will not allow Repetition of Characters
      const index = Math.floor(Math.random() * charsArray.length + 1) // get the next character from the array
      if (!captcha.includes(charsArray[index])) captcha.push(charsArray[index])
      else i--
    }
    const canv = window.document.createElement('canvas')
    canv.id = 'captchaCanvas'
    canv.width = 100 // window.document.getElementById('captchaInput').clientWidth
    canv.height = 50
    const ctx = canv.getContext('2d')
    ctx.font = '30px Georgia'
    const textWidth = ctx.measureText(captcha.join('')).width
    canv.width = textWidth + 5
    ctx.font = '30px Georgia'
    ctx.strokeText(captcha.join(''), 0, 30)
    // storing captcha so that can validate you can save it somewhere else according to your specific requirements
    this.captchaString = captcha.join('')
    window.document.getElementById('captchaInput').appendChild(canv) // adds the canvas to the body element
  })

  inject('AoAToJSON', (array) => {
    const objArray = []
    for (let i = 1; i < array.length; i++) {
      objArray[i - 1] = {}
      for (let k = 0; k < array[0].length && k < array[i].length; k++) {
        const key = array[0][k]
        objArray[i - 1][key] = array[i][k]
      }
    }

    return objArray
  })

  inject(
    'formatDate',
    (
      date,
      inputFormat = 'YYYY-MM-DD',
      outputFormat = 'YYYY-MM-DD',
      strict = false,
      lang = 'vi'
    ) => {
      try {
        moment.locale(lang)
        const formatted = moment(date, inputFormat, strict).format(outputFormat)
        return formatted === 'Invalid date' ? '' : formatted
      } catch (e) {
        return ''
      }
    }
  )

  inject('formatNumber', (num, format = '0,0', locale = 'en') => {
    try {
      numeral.locale(locale)
      return numeral(num).format(format)
    } catch (error) {
      return 0
    }
  })
}
