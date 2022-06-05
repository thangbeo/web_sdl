<template>
  <div v-if="checkRole()" class="main_big_customer">
    <div>
      <v-tabs
        v-model="tab"
        color="primary"
        active-class="primary--text"
        background-color="#f4f7fe"
      >
        <v-tab
          :class="
            (tab !== 0 && 'black--text') +
            ' text-none letter-spacing-normal fs-17  font-weight-bold'
          "
          @click="clicked(0)"
        >
          Danh sách khách hàng
        </v-tab>
        <v-tab
          :class="
            (tab !== 1 && 'black--text') +
            ' text-none letter-spacing-normal fs-17  font-weight-bold'
          "
          @click="clicked(1)"
        >
          Newsletter</v-tab
        >
      </v-tabs>
      <v-tabs-items v-model="tab" class="mt-5">
        <v-tab-item eager>
          <customer ref="list_customer"></customer>
        </v-tab-item>
        <v-tab-item eager>
          <Newsletter ref="list_newsletter"></Newsletter>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>
<script>
// import Edit from '../../components/khach-hang/Edit'
import Newsletter from '~/components/khach-hang/Newsletter/index.vue'
import customer from '~/components/khach-hang/danh-sach-khach-hang/index.vue'
import Rules from '~/assets/configurations/Rules'
export default {
  components: {
    customer,
    Newsletter,
  },
  data() {
    return {
      tab: 0,
      check_load: 0,
    }
  },

  created() {
    if (this.$route.fullPath === '/khach-hang') {
      this.title = 'Khách hàng'
      this.$store.commit('app/setTitle', 'Khách hàng')
    }
  },
  methods: {
    clicked(value) {
      this.check_load = value
      if (this.check_load === 0) {
        this.$refs.list_customer.getlist()
      }
      if (this.check_load === 1) {
        this.$refs.list_newsletter.getlist()
      }
    },
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.Customer.id
      )
      return roles
    },
  },
  head() {
    this.$store.commit('app/setTitle', this.title)
    return {
      title: this.title,
    }
  },
}
</script>
<style lang="scss">
// .main_big_customer {
//   .theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
//     background-color: white !important;
//     color: black !important;
//   }

// }
</style>
