<template>
  <v-row class="login-style">
    <v-col class="pa-0" cols="7">
      <v-img class="w-100 h-100" :src="background" />
    </v-col>
    <v-col class="pa-0" style="background: #3f69b8" cols="5">
      <div class="container">
        <div class="logo">
          <v-img :src="logo" width="225" height="60"></v-img>
          <!--          <img src="~/assets/icon/logo.svg" width="225" height="60" />-->
        </div>
        <div class="title">Sàn du lịch tỉnh Yên Bái</div>
        <!--        <div class="title">Sàn du lịch thành phố Móng Cái</div>-->
        <!-- <div class="sub-title">Portal nhà cung cấp</div> -->
        <div class="fs-24 mt-8">Đăng nhập</div>
        <div class="mr-16">
          <form @submit.prevent="submit">
            <div class="fs-17 title-label-input">
              Địa chỉ email <span style="color: #ff0057">*</span>
            </div>
            <div class="d-flex">
              <v-btn
                class="rounded-r-0"
                height="60"
                width="60"
                color="#2F5EB5"
                dark
                depressed
              >
                <v-icon>mdi-email-outline</v-icon>
              </v-btn>
              <v-text-field
                v-model="username"
                :error-messages="username_msg"
                placeholder="Nhập địa chỉ email của bạn"
                solo
                flat
                background-color="#4873C2"
                height="60"
                dark
                class="w-100 rounded-l-0"
                @input="validateEmail"
              ></v-text-field>
            </div>
            <div class="fs-17 mb-2">
              Mật khẩu <span style="color: #ff0057">*</span>
            </div>
            <div class="d-flex">
              <v-btn
                class="rounded-r-0"
                height="60"
                width="60"
                color="#2F5EB5"
                dark
                depressed
              >
                <v-icon>mdi-lock-outline</v-icon>
              </v-btn>
              <v-text-field
                v-model="password"
                :error-messages="password_msg"
                type="password"
                placeholder="Nhập mật khẩu"
                solo
                flat
                background-color="#4873C2"
                height="60"
                dark
                class="w-100 rounded-l-0"
                @input="validatePassWord"
              ></v-text-field>
            </div>
            <div class="d-flex mb-8">
              <v-checkbox
                v-model="keep_login"
                label="Duy trì đăng nhập"
                color="#47BBFF"
                dark
                hide-details
                :true-value="1"
                :false-value="0"
                :ripple="false"
              ></v-checkbox>
              <div class="flex-grow-1"></div>
              <span class="fs-14 mt-5" style="color: #47bbff">
                Quên mật khẩu?
              </span>
            </div>
            <div class="d-flex justify-center">
              <v-btn
                color="#47BBFF"
                class="text-none white--text"
                type="submit"
                height="60px"
                block
                depressed
                :loading="$store.state.login.logging"
              >
                Đăng nhập
              </v-btn>
            </div>
          </form>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import Cookies from 'js-cookie'

import background from '~/assets/login/background.png'
import logo from '~/assets/logo/logo.png'

export default {
  layout: 'login',
  data: () => ({
    background,
    logo,
    username: '',
    username_msg: [],
    password: '',
    password_msg: [],
    logging: false,
    keep_login: 1,
  }),
  methods: {
    submit() {
      let hasErrors = false

      if ((this.username || '').trim().length === 0) {
        hasErrors = true
        this.username_msg = 'Không được để trống'
      } else if (!this.$isEmail(this.username.trim())) {
        hasErrors = true
        this.username_msg = 'Email không hợp lệ'
      }

      if ((this.password || '').trim().length === 0) {
        hasErrors = true
        this.password_msg = 'Không được để trống'
      } else if ((this.password || '').length > 100) {
        hasErrors = true
        this.password_msg = 'Mật khẩu không được quá dài'
      }

      if (!hasErrors) {
        const DATA = {
          email: this.username.trim(),
          password: this.password,
          remember: this.keep_login,
          // ip: this.$store.state.app.ip,
        }
        this.$store.commit('login/setLogging', true)
        setTimeout(() => {
          this.$store
            .dispatch('login/Submit', DATA)
            .then((res) => {
              if (!res.error) {
                Cookies.set('token', res.data.data.token)
                Cookies.set('token_hint', res.data.data.id_token)
                Cookies.set('username', res.data.data.userInfo.name)
                Cookies.set('user_id', res.data.data.userInfo.id)
                Cookies.set('avatar', res.data.data.userInfo.avatar)
                if (
                  (res.data.data.userInfo.last_url_access || '').length !== 0
                ) {
                  this.$router.push(res.data.data.userInfo.last_url_access)
                } else {
                  this.$router.push('/')
                }
              }
            })
            .finally(() => {
              this.$store.commit('login/setLogging', false)
            })
        }, 1000)
      }
    },
    validateEmail(value) {
      if ((value || '').trim().length === 0) {
        this.username_msg = 'Không được để trống'
      } else if (!this.$isEmail(value.trim())) {
        this.username_msg = 'Email không hợp lệ'
      } else {
        this.username_msg = ''
      }
    },
    validatePassWord(value) {
      if ((value || '').trim().length === 0) {
        this.password_msg = 'Không được để trống'
      } else if ((value || '').length > 100) {
        this.password_msg = 'Mật khẩu không được quá dài'
      } else {
        this.password_msg = ''
      }
    },
  },
  head() {
    return {
      title: 'Đăng nhập',
    }
  },
  transition(to, from) {
    if (!from) {
      return 'slide-x-transition'
    }
    return 'slide-x-reverse-transition'
  },
}
</script>

<style lang="scss">
.login-style {
  overflow: hidden;

  .logo {
    margin-top: 30px;
  }

  .container {
    margin-left: 38px;
    color: #fff;
  }

  .title {
    font-size: 30px !important;
    margin-top: 20px;
    // opacity: 0.7;
  }

  .sub-title {
    font-size: 19px !important;
    // opacity: 0.7;
  }

  .title-label-input {
    margin-top: 16px;
    margin-bottom: 8px;
  }
}
</style>
