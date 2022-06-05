<template>
  <div>
    <client-only>
      <v-tabs
        v-model="tab"
        color="primary"
        active-class="primary--text"
        background-color="#f4f7fe"
        style="position: fixed; z-index: 1"
      >
        <v-tab
          :class="
            (tab !== 0 && 'black--text') +
            ' text-none letter-spacing-normal fs-17 font-weight-bold'
          "
          @click="clicked_tab(1)"
        >
          Thông tin
        </v-tab>

        <v-tab
          :class="
            (tab !== 1 && 'black--text') +
            ' text-none letter-spacing-normal fs-17 font-weight-bold'
          "
          @click="clicked_tab(2)"
        >
          Thông báo
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <information :get="check_get" :data="dataThongtin"> </information>
        </v-tab-item>

        <v-tab-item eager>
          <notication
            :get="check_get"
            :open="tab == 1"
            :data="dataThongbao"
            @notication="DetailAccount"
          >
          </notication>
        </v-tab-item>
      </v-tabs-items>
    </client-only>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import information from '../../components/tai-khoan/information'
import notication from '../../components/tai-khoan/notication'
export default {
  components: {
    information,
    notication,
  },
  data: () => ({
    tab: 0,
    check_get: 0,
    dataThongtin: {},
    dataThongbao: [],
  }),
  mounted() {
    this.DetailAccount()
  },
  methods: {
    DetailAccount() {
      const data = {
        account_id: Cookies.get('user_id'),
      }
      this.$store
        .dispatch('quan_tri_vien/detail', data)
        .then((response) => {
          if (!response.error) {
            this.dataThongtin = response.data.data.accountCmsCur
            this.dataThongbao = response.data.data.accountNotifyCurList
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
    },
    clicked_tab(value) {
      this.check_get = value
    },
  },
  head() {
    this.$store.commit('app/setTitle', 'Tài khoản')
    return {
      title: 'Tài khoản',
    }
  },
}
</script>
