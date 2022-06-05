<template>
  <v-app style="background-color: #f5f7fe">
    <div class="app-layout-css">
      <client-only>
        <notifications
          group="main"
          :duration="7000"
          position="top right"
          :max="5"
        />

        <!--        <alert />-->

        <v-navigation-drawer
          v-model="drawer"
          :clipped="clipped"
          color="#3F69B8"
          fixed
          width="250px"
          app
          dark
          style="padding-bottom: 37px"
          class="denser-nav"
        >
          <v-list nav dense expand class="disabled-active pt-0">
            <div class="logo mt-4">
              <v-img :src="logo" width="225" height="60" />
              <!--              <img src="~/assets/icon/logo.svg" width="225" height="60" />-->
            </div>
            <template v-for="(item, index) in topmenu">
              <v-list-group
                v-if="getMenuByParent(item.id).length > 0"
                :key="`${index}-${item.id}`"
                active-class="white--text"
                no-action
              >
                <template v-slot:activator>
                  <!-- <div class="px-2" v-html="item.page_icon"></div> -->
                  <icon-svg class="px-2" :name="item.page_icon" />
                  <v-list-item-content>
                    <v-list-item-title>{{ item.page_name }}</v-list-item-title>
                  </v-list-item-content>
                </template>

                <template v-for="(child1, i) in getMenuByParent(item.id)">
                  <div
                    v-if="getMenuByParent(child1.id).length > 0"
                    :key="`${i}+${child1.id}`"
                  >
                    <v-list-group active-class="white--text" no-action>
                      <template v-slot:activator>
                        <v-list-item-content>
                          <v-list-item-title class="ml-9">
                            {{ child1.page_name }}
                          </v-list-item-title>
                        </v-list-item-content>
                      </template>

                      <v-list-item
                        v-for="(child2, idx) in getMenuByParent(child1.id)"
                        :key="`${idx}_${child2.id}`"
                        router
                        style="background-color: #3f69b8 !important"
                        class="cp"
                        @change="set_default_back(child2.page_url)"
                      >
                        <!--                        :to="child2.page_url"-->
                        <v-list-item-title
                          :class="
                            (url_default === child2.page_url &&
                              'light-blue--text darken-2') + ' pt-1'
                          "
                          v-text="child2.page_name"
                        />
                      </v-list-item>
                    </v-list-group>
                  </div>

                  <div v-else :key="`${i}+${child1.id}`">
                    <v-list-item
                      router
                      class="cp"
                      :style="
                        url_default === child1.page_url &&
                        'background-color: #47bbff'
                      "
                      @change="set_default_back(child1.page_url)"
                    >
                      <!--                      active-class="white&#45;&#45;text"-->
                      <!--                      :to="child1.page_url"-->
                      <v-list-item-title
                        class="pt-1 ml-6"
                        v-text="child1.page_name"
                      />
                    </v-list-item>
                  </div>
                </template>
              </v-list-group>
              <v-list-item
                v-else
                :key="`${index}-${item.id}`"
                router
                class="cp"
                :style="
                  url_default === item.page_url && 'background-color: #47bbff'
                "
                active-class="white--text"
                @change="set_default_back(item.page_url)"
              >
                <!--                :to="item.page_url"-->
                <!-- <div class="px-2" v-html="item.page_icon"></div> -->
                <icon-svg class="px-2" :name="item.page_icon" />
                <v-list-item-title v-text="item.page_name" />
              </v-list-item>
            </template>
          </v-list>
        </v-navigation-drawer>
      </client-only>

      <v-app-bar
        flat
        :clipped-left="clipped"
        fixed
        app
        light
        height="75"
        color="#F5F7FE"
      >
        <div
          class="headline fs-24 d-flex align-center font-weight-bold primary--text"
        >
          <v-icon
            v-if="$store.state.app.check_back"
            class="cp mr-1"
            color="#3F69B8"
            size="28"
            @click="changeBack"
          >
            mdi-chevron-left
          </v-icon>
          {{ $store.state.app.pageTitle }}
        </div>

        <v-spacer />

        <v-menu
          v-model="menu_noti"
          transition="scroll-x-reverse-transition"
          left
          nudge-top="10"
          nudge-left="8"
          :offset-y="true"
          min-width="350"
          max-width="350"
          :disabled="menu_disable"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              x-small
              icon
              dark
              class="mr-3"
              v-bind="attrs"
              v-on="on"
              @click="set_notification(1)"
            >
              <icon-bell />
              <v-icon
                v-if="hide_icon"
                style="position: absolute; bottom: 0; left: 6px"
                size="6"
                color="error"
              >
                mdi-checkbox-blank-circle
              </v-icon>
            </v-btn>
          </template>

          <v-card v-if="menu_noti" class="w-100">
            <v-list dense>
              <v-list-item-title class="ml-4 mb-2 font-weight-bold d-flex">
                Thông báo
                <div class="opacity-0-6 fs-13 ml-2" style="margin-top: 2px">
                  ({{ noti_unread }})
                </div>
              </v-list-item-title>
              <v-divider />
              <v-container
                id="notifications-scroll-target"
                style="max-height: 480px"
                class="overflow-y-auto py-0"
              >
                <v-row v-scroll:#notifications-scroll-target="onScroll">
                  <template v-for="(item, i) in list_notification">
                    <v-card
                      :key="`${item.id}-${i}`"
                      :class="`${
                        item.is_readed === 0 ? ' ' : 'opacity-0-6 '
                      }mx-4 w-100`"
                      flat
                      @click="detail_notification(item.id)"
                    >
                      <div class="fs-13 mt-4 mb-2 font-weight-bold">
                        {{ item.title }}
                      </div>
                      <div
                        class="fs-13 font-weight-medium"
                        style="
                          display: -webkit-box;
                          -webkit-line-clamp: 3;
                          -webkit-box-orient: vertical;
                          overflow: hidden;
                          text-overflow: ellipsis;
                        "
                      >
                        "{{ item.content }}"
                      </div>
                      <div
                        class="d-flex align-center font-weight-medium fs-13 my-2"
                      >
                        <v-icon size="16" class="mr-1">
                          mdi-clock-time-three-outline
                        </v-icon>
                        {{ item.create_time }}
                      </div>
                      <v-divider v-if="list_notification.length !== i + 1" />
                    </v-card>
                  </template>
                </v-row>
                <div v-if="loading" class="d-flex justify-center">
                  <div id="notifications-loading">
                    <span class="sk-cube sk-cube1" />
                    <span class="sk-cube sk-cube2" />
                    <span class="sk-cube sk-cube3" />
                    <span class="sk-cube sk-cube4" />
                    <span class="sk-cube sk-cube5" />
                    <span class="sk-cube sk-cube6" />
                    <span class="sk-cube sk-cube7" />
                    <span class="sk-cube sk-cube8" />
                    <span class="sk-cube sk-cube9" />
                  </div>
                </div>
              </v-container>
            </v-list>
          </v-card>
        </v-menu>

        <v-divider
          style="max-height: 16px; margin-top: 28px !important"
          class="mx-4"
          inset
          vertical
        />

        <v-menu
          v-model="menu"
          max-width="150"
          transition="scroll-y-transition"
          offset-x
          offset-y
        >
          <template v-slot:activator="{ on }">
            <div class="cp d-flex align-center" v-on="on">
              <div class="ml-4 fs-17 font-weight-bold">
                {{ username }}
              </div>
              <v-avatar
                :tile="false"
                class="ml-3 mr-8"
                color="primary"
                size="32"
              >
                <v-icon
                  v-if="(avatar || '').length === 0"
                  color="white"
                  size="31"
                >
                  mdi-account-circle
                </v-icon>
                <v-img v-else :src="avatar" @error="set_avatar" />
              </v-avatar>
            </div>
          </template>
          <v-list dense class="py-0">
            <v-list-item-group v-model="action">
              <nuxt-link class="nuxt-link text-decoration-none" to="/tai-khoan">
                <v-list-item class="pl-2">
                  <v-list-item-icon class="mr-0 pt-1">
                    <icon-account />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title style="color: #3f69b8">
                      Tài khoản của tôi
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </nuxt-link>
              <v-divider />
              <v-list-item class="pl-2" @click="open_logout = true">
                <v-list-item-icon class="mr-0">
                  <v-icon color="#FF296B" size="18">mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="nuxt-link" style="color: #ff296b">
                    Đăng xuất
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-app-bar>

      <v-main>
        <v-container class="pt-0" fluid>
          <nuxt />
        </v-container>
      </v-main>

      <yes-no-alert
        :open="open_confirm"
        alert-msg="Bạn chắc chắn muốn rời trang không?"
        @toggle="open_confirm = !open_confirm"
        @OK="confirm_actions"
      />

      <yes-no-alert
        :open="open_logout"
        alert-msg="Bạn chắc chắn muốn đăng xuất không?"
        @toggle="open_logout = !open_logout"
        @OK="log_out"
      />
    </div>
  </v-app>
</template>

<script>
import Vue from 'vue'

import Cookies from 'js-cookie'
import moment from 'moment'
import logo from '~/assets/logo/logo.png'

import IconBell from '~/components/icon/Bell'
import IconSvg from '~/components/icon/navigation/IconSvg'
import IconAccount from '~/components/icon/account'

Vue.prototype.moment = moment

export default {
  middleware: 'auth',
  components: {
    IconBell,
    IconSvg,
    IconAccount,
  },
  data: () => ({
    logo,
    clipped: false,
    drawer: true,
    menu: false,
    username: '',
    action: null,
    parent_id: -1,
    title: '',
    avatar: '',
    count: 0,
    open_confirm: false,
    url: '',
    url_default: '',
    hide_icon: false,
    list_notification: [],
    noti_unread: 0,
    menu_disable: true,
    page: 1,
    total_page: 0,
    loading: false,
    menu_noti: false,
    open_logout: false,
  }),
  computed: {
    topmenu() {
      return this.getMenuByParent(0)
    },
  },
  watch: {
    menu(value) {
      if (!value) {
        this.action = null
      }
    },
    '$route.fullPath'(value) {
      if (value === '') {
        value = '/'
      }
      this.url_default = value
      this.$store.dispatch('app/set_last_url_access', value)
    },
    '$store.state.app.messaging'(value) {
      // this.$log.debug('messaging: ', value)
      this.$showSuccess(
        this,
        `${value.notification.title}: ${value.notification.body}`
      )
      this.hide_icon = true
    },
  },
  created() {
    // this.$vuetify.theme.dark = false
    this.url_default = this.$route.fullPath

    if (this.$route.fullPath === '/') {
      this.title = 'Dashboad'
      this.$store.commit('app/setTitle', 'Dashboad')
    }

    this.$store.dispatch('app/firebase_messaging')

    this.set_notification('init')
  },
  mounted() {
    this.$store.dispatch('app/GetRole').then((res) => {
      if (!res.error) {
        this.$store.commit('app/setRole', res.data.data)
        if ((res.data.data || []).length === 0) {
          this.$router.push('/tai-khoan')
        } else {
          this.username = Cookies.get('username')
          this.avatar = Cookies.get('avatar')
          this.$store.dispatch('app/list_languages')
          this.$store.dispatch('app/list_currencies')
          this.$store.dispatch('app/get_domain')
          this.$store.dispatch('app/get_config_map').then((res) => {
            if (!res.error) {
              let status = false

              if (res.data.data[0].enable === 1) {
                status = true
              }
              this.$store.commit('app/setConfigMap', status)
            }
          })
        }
      }
    })
  },
  methods: {
    getMenuByParent(id) {
      if (!this.$isServer) {
        const lstAccessMenu = []
        const pages = this.$store.state.app.roles
        Array.from(pages).forEach((m) => {
          if (m.parent_id === id) lstAccessMenu.push(m)
        })
        return lstAccessMenu
      }
    },
    log_out() {
      this.$store.dispatch('app/push_token_firebase', '')
      if (
        Cookies.get('token_hint') === 'null' ||
        Cookies.get('token_hint') === 'undefined'
      ) {
        this.remote_cookie()
        this.$router.push('/login')
      } else {
        // this.$store.dispatch('login/logout_sso_sdl')

        this.$store.dispatch('login/logoutSso').then((res) => {
          if (!res.error) {
            // this.$logout(this.$router)
            this.remote_cookie()
            window.location.href = `https://login.yenbai.gov.vn/oidc/logout?id_token_hint=${Cookies.get(
              'token_hint'
            )}`
          }
        })
      }
    },
    remote_cookie() {
      Object.keys(Cookies.get()).forEach(function (cookieName) {
        const neededAttributes = {
          // Here you pass the same attributes that were used when the cookie was created
          // and are required when removing the cookie
        }
        Cookies.remove(cookieName, neededAttributes)
      })
    },
    set_avatar(event) {
      this.avatar = ''
    },
    changeBack() {
      this.$store.commit('app/changeBack')
    },
    set_default_back(url) {
      this.url = url
      if (this.$store.state.app.check_back) {
        if (this.url_default !== url) {
          this.open_confirm = true
        }
      } else {
        this.url_default = this.url
        this.$router.push(url)
      }
    },
    confirm_actions() {
      this.url_default = this.url
      this.$router.push(this.url)
    },
    set_notification(check) {
      this.page = 1
      this.get_notification(check)
    },
    get_notification(check) {
      const DATA = {
        page_index: this.page,
        page_size: 20,
      }
      this.$store.dispatch('app/list_notification', DATA).then((res) => {
        if (!res.error) {
          this.total_page = res.data.data.pageable.total_page

          const arr = []

          if ((res.data.data.items || []).length !== 0) {
            for (let i = 0; i < res.data.data.items.length; i++) {
              arr.push({
                ...res.data.data.items[i],
                create_time: moment(
                  res.data.data.items[i].create_time,
                  'DD/MM/YYYY HH:mm:ss'
                ).format('HH:mm:ss - DD/MM/YYYY'),
              })
            }
          }

          this.list_notification = [...arr]

          let count = 0
          for (let i = 0; i < this.list_notification.length; i++) {
            if (this.list_notification[i].is_readed === 0) {
              count += 1
            }
          }
          this.noti_unread = count

          if (check === 'init') {
            if ((this.list_notification || []).length !== 0) {
              this.menu_disable = false

              let isNew = 0
              for (let i = 0; i < this.list_notification.length; i++) {
                if (this.list_notification[i].is_new === 1) {
                  isNew += 1
                }
              }
              if (isNew > 0) {
                this.hide_icon = true
              }
            }
          }
          if (check === 1) {
            this.hide_icon = false
          }
        }
      })
    },
    detail_notification(id) {
      if (!this.$isNullOrEmpty(id)) {
        this.$store.dispatch('app/detail_notification', id).then((res) => {
          if (!res.error) {
            this.$log.debug(res)
            switch (res.data.data.type) {
              case 1:
                return this.$router.push(
                  `/danh-sach-giao-dich/${res.data.data.resource_type}/${res.data.data.resource_id}`
                )
              case 2:
                return this.$router.push(
                  `/danh-sach-giao-dich/${res.data.data.resource_type}/${res.data.data.resource_id}`
                )
              case 3:
                return this.$router.push(
                  `/danh-sach-giao-dich/${res.data.data.resource_type}/${res.data.data.resource_id}`
                )
              case 4:
                return this.$router.push(
                  `/khach-hang/${res.data.data.resource_id}`
                )
              case 5:
                return this.$router.push(
                  `/bai-viet/${res.data.data.resource_id}`
                )
              case 6:
                return this.$router.push(
                  `/san-pham/${res.data.data.resource_type}/${res.data.data.resource_id}`
                )
              case 7:
                return this.$router.push(
                  `/danh-gia/${res.data.data.resource_type}/${res.data.data.resource_id}`
                )
            }
          }
        })
      }
    },
    onScroll(e) {
      // this.$log.debug(
      //   'scrollHeight: ',
      //   e.target.scrollHeight,
      //   'clientHeight: ',
      //   e.target.clientHeight,
      //   'scrollTop: ',
      //   e.target.scrollTop
      // )
      if (this.page < this.total_page && !this.loading) {
        if (
          e.target.scrollTop + e.target.clientHeight >=
          e.target.scrollHeight - 1
        ) {
          this.page += 1
          this.loading = true
          const DATA = {
            page_index: this.page,
            page_size: 20,
          }
          this.$store
            .dispatch('app/list_notification', DATA)
            .then((res) => {
              if (!res.error) {
                this.total_page = res.data.data.pageable.total_page

                const arr = [...this.list_notification]

                if ((res.data.data.items || []).length !== 0) {
                  for (let i = 0; i < res.data.data.items.length; i++) {
                    arr.push({
                      ...res.data.data.items[i],
                      create_time: moment(
                        res.data.data.items[i].create_time,
                        'DD/MM/YYYY HH:mm:ss'
                      ).format('HH:mm:ss - DD/MM/YYYY'),
                    })
                  }
                }

                this.list_notification = [...arr]

                let count = 0
                for (let i = 0; i < this.list_notification.length; i++) {
                  if (this.list_notification[i].is_readed === 0) {
                    count += 1
                  }
                }
                this.noti_unread = count
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      }
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>

<style lang="scss">
.app-layout-css {
  .logo {
    height: 80px !important;
  }

  .nuxt-link {
    text-decoration: none;
    color: #ff296b !important;
  }

  .v-list-item {
    background-color: #4873c2;
    margin-top: 4px !important;
    min-width: 12px !important;
  }

  .v-list-item__icon {
    margin: 0 !important;
    min-width: 12px !important;
  }

  .v-application--is-ltr
    .v-list--dense.v-list--nav
    .custom-group.v-list-group--no-action
    > .v-list-group__items
    > div
    > .v-list-item {
    padding-left: 40px !important;
  }

  .v-application--is-ltr
    .v-list--dense
    .v-list-group--sub-group
    .v-list-group__header {
    padding-left: 6px;
  }

  .theme--dark.v-list-item--active::before,
  .theme--dark.v-list-item--active:hover::before {
    opacity: 0 !important;
    color: #47bbff;
  }

  .v-list-item--active {
    color: #fff;
    background-color: #47bbff !important;
  }

  .disabled-active {
    .v-list-group--active {
      .v-list-item--active {
        background-color: #47bbff !important;
      }
    }
  }
}

#notifications-loading {
  width: 20px;
  height: 20px;
}

#notifications-loading .sk-cube {
  width: 33%;
  height: 33%;
  background-color: #333;
  float: left;
  -webkit-animation: sk-cubegridscaledelay 1.3s infinite ease-in-out;
  animation: sk-cubegridscaledelay 1.3s infinite ease-in-out;
}

#notifications-loading .sk-cube1 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

#notifications-loading .sk-cube2 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

#notifications-loading .sk-cube3 {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

#notifications-loading .sk-cube4 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

#notifications-loading .sk-cube5 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

#notifications-loading .sk-cube6 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

#notifications-loading .sk-cube7 {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}

#notifications-loading .sk-cube8 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

#notifications-loading .sk-cube9 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

@-webkit-keyframes sk-cubegridscaledelay {
  0%,
  70%,
  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
  35% {
    -webkit-transform: scale3d(0, 0, 1);
    transform: scale3d(0, 0, 1);
  }
}

@keyframes sk-cubegridscaledelay {
  0%,
  70%,
  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
  35% {
    -webkit-transform: scale3d(0, 0, 1);
    transform: scale3d(0, 0, 1);
  }
}
</style>
