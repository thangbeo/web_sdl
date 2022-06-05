import URL from './assets/configurations/BASE_URL'

import en from './assets/locale/en'
import vi from './assets/locale/vi'

export default {
  server: {
    port: 10006, // default: 3000
    host: '0.0.0.0', // default: localhost
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - ' + 'Quản trị sàn du lịch',
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/logo.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
      },
    ],
  },

  loading: {
    color: '#3F69B8',
    height: '3px',
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/main.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/APIs.js',
    '~/plugins/axios.js',
    '~/plugins/ult.js',
    '~/plugins/globalComponent.js',
    { src: '~/plugins/common.js', ssr: false },
    { src: '~/plugins/notification.js', ssr: false },
  ],

  // // Auto import components (https://go.nuxtjs.dev/config-components)
  // components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    // '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    // '@nuxt/content',
    // https://firebase.nuxtjs.org
    // '@nuxtjs/firebase',
    // Vue Wait (Loading management)
    'vue-wait/nuxt',
    // https://www.npmjs.com/package/nuxt-leaflet
    [
      'nuxt-leaflet',
      {
        /* module options */
      },
    ],
  ],

  // Firebase module configuration (https://firebase.nuxtjs.org/guide/getting-started/)
  // firebase: {
  //   config: {
  //     apiKey: 'AIzaSyBzmm6sp4VFkKaUTtP9ALEK3pCbat31UiI',
  //     authDomain: 'websdl.firebaseapp.com',
  //     projectId: 'websdl',
  //     storageBucket: 'websdl.appspot.com',
  //     messagingSenderId: '820308151770',
  //     appId: '1:820308151770:web:5a02592c25e9f1eac504e3',
  //     measurementId: 'G-ZJD9YYSDW1',
  //   },
  //   onFirebaseHosting: false,
  //   services: {
  //     auth: false,
  //     firestore: false,
  //     storage: false,
  //     realtimeDb: false,
  //     performance: false,
  //     analytics: true,
  //     remoteConfig: false,
  //     functions: {
  //       location: 'us-central1', // Default
  //       emulatorPort: 10006,
  //     },
  //     messaging: {
  //       createServiceWorker: true,
  //       fcmPublicVapidKey:
  //         'BDkwidfGGWaGd2Eme2ksAtM0oVmbWu6ps6OlOkvB4W_baqpyUhXyyOo9H5YpO3M82aak5_XqJQrx9EZAcafUCdY',
  //       // OPTIONAL : Sets vapid key for FCM after initialization
  //     },
  //   },
  // },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: URL.BASE,
  },

  // vue wait
  wait: { useVuex: true },

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  // content: {},

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    treeShake: true,
    lang: {
      locales: {
        vi,
        en,
      },
      current: 'vi',
    },
    customVariables: ['~/assets/variables.scss'],
    themes: {
      dark: {
        primary: '#47BBFF',
        accent: '#F5F7FE',
        secondary: '#3C4A65',
        info: '#3F69B8',
        warning: '#F5972D',
        error: '#FF0F59',
        success: '#17E555',
      },
      light: {
        primary: '#47BBFF',
        accent: '#F5F7FE',
        secondary: '#3C4A65',
        info: '#3F69B8',
        warning: '#F5972D',
        error: '#FF0F59',
        success: '#17E555',
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    parallel: true,
    cache: true,
    vendor: ['vue-pdf'],
    extend(config, ctx) {
      config.output.globalObject = 'this'
    },
    transpile: [/^vue2-google-maps($|\/)/],
  },
}
