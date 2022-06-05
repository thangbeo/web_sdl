import Vue from 'vue'
import Notifications from 'vue-notification'
import vueXlsxTable from 'vue-xlsx-table'
import VueLogger from 'vuejs-logger'
import VueApexCharts from 'vue-apexcharts'
import draggable from 'vuedraggable'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueQuillEditor from 'vue-quill-editor'
import Vue2Editor from 'vue2-editor'

import Quill from 'quill'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'

import moment from 'moment'
import GOOGLE from '~/assets/configurations/GOOGLE_MAP_API_KEY'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'

moment.updateLocale('vi', {
  months: 'Tháng 1_Tháng 2_Tháng 3_Tháng 4_Tháng 5_Tháng 6_Tháng 7_Tháng 8_Tháng 9_Tháng 10_Tháng 11_Tháng 12'.split(
    '_'
  ),
  monthsShort: 'Tháng 1_Tháng 2_Tháng 3_Tháng 4_Tháng 5_Tháng 6_Tháng 7_Tháng 8_Tháng 9_Tháng 10_Tháng 11_Tháng 12'.split(
    '_'
  ),
  monthsParseExact: true,
  weekdays: 'Chủ nhật_Thứ Hai_Thứ Ba_Thứ Tư_Thứ Năm_Thứ Sáu_Thứ Bảy'.split('_'),
  weekdaysShort: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
  weekdaysMin: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm',
  },
  calendar: {
    lastDay: '[Hôm qua vào] LT',
    sameDay: '[Hôm nay vào] LT',
    nextDay: '[Ngày mai vào] LT',
    lastWeek: 'dddd [tuần trước] [vào] LT',
    nextWeek: 'dddd [vào] LT',
    sameElse: 'L',
  },
  relativeTime: {
    future: 'in %s',
    past: '%s trước',
    s: 'vài giây trước',
    ss: '%d giây',
    m: '1 phút',
    mm: '%d phút',
    h: '1 giờ',
    hh: '%d giờ',
    d: '1 ngày',
    dd: '%d ngày',
    w: '1 tuần',
    ww: '%d tuần',
    M: '1 tháng',
    MM: '%d tháng',
    y: '1 năm',
    yy: '%d năm',
  },
  meridiem: (hours, minutes, isLower) => {
    return hours < 12 ? 'AM' : 'PM'
  },
})

const isProduction = process.env.NODE_ENV === 'production'

const options = {
  isEnabled: true,
  logLevel: isProduction ? 'error' : 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true,
}
Vue.use(Vue2Editor)
Vue.use(VueLogger, options)
Vue.use(Notifications)
Vue.use(vueXlsxTable, { rABS: false })
Vue.component('apexchart', VueApexCharts)
Vue.component(draggable)
Vue.use(VueGoogleMaps, {
  load: {
    key: GOOGLE.API_KEY_MAP,
    libraries: 'places',
    region: 'VI',
    language: 'vi',
  },
})
Vue.use(VueQuillEditor)
const sizeStyle = Quill.import('attributors/style/size')
sizeStyle.whitelist = [
  '6px',
  '8px',
  '10px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '30px',
  '32px',
  '36px',
]
Quill.register(sizeStyle, true)
Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker)
