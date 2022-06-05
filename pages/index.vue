<template>
  <div class="w-100 h-100 d-flex justify-center align-center">
    <div id="loading-redirect-login">
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
</template>

<script>
import Cookies from 'js-cookie'

export default {
  layout: 'login',
  mounted() {
    const code = this.$route.query.code

    if (!this.$isNullOrEmpty(code)) {
      this.$store.dispatch('login/loginSso', code).then((res) => {
        if (!res.error) {
          Cookies.set('token', res.data.data.token)
          Cookies.set('token_hint', res.data.data.id_token)
          Cookies.set('username', res.data.data.userInfo.name)
          Cookies.set('user_id', res.data.data.userInfo.id)
          Cookies.set('avatar', res.data.data.userInfo.avatar)
          if ((res.data.data.userInfo.last_url_access || '').length !== 0) {
            this.$router.push(res.data.data.userInfo.last_url_access)
          } else {
            this.$router.push('/dashboard')
          }
        }
      })
    } else {
      this.$router.push('/dashboard')
    }
  },
}
</script>

<style lang="scss" scoped>
.cp {
  cursor: pointer;
}

.theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: white !important;
  color: black !important;
}

#loading-redirect-login {
  width: 40px;
  height: 40px;
}

#loading-redirect-login .sk-cube {
  width: 33%;
  height: 33%;
  background-color: #333;
  float: left;
  -webkit-animation: sk-cubegridscaledelay 1.3s infinite ease-in-out;
  animation: sk-cubegridscaledelay 1.3s infinite ease-in-out;
}

#loading-redirect-login .sk-cube1 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

#loading-redirect-login .sk-cube2 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

#loading-redirect-login .sk-cube3 {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

#loading-redirect-login .sk-cube4 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

#loading-redirect-login .sk-cube5 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

#loading-redirect-login .sk-cube6 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

#loading-redirect-login .sk-cube7 {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}

#loading-redirect-login .sk-cube8 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

#loading-redirect-login .sk-cube9 {
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
