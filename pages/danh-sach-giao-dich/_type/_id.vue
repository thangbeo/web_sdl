<template>
  <div v-if="checkRole()">
    <OpenDetailHotel
      v-if="open_add == 3 && checkType == 1"
      :hotel="detail"
      @toggle="toggle"
      @OK="toggle"
    >
    </OpenDetailHotel>
    <OpenDetailTour
      v-if="open_add == 3 && checkType == 3"
      :tour="detail"
      @toggle="toggle"
      @OK="toggle"
    >
    </OpenDetailTour>
    <OpenDetailRestaurant
      v-if="open_add == 3 && checkType == 2"
      :restaurant="detail"
      @toggle="toggle"
      @OK="toggle"
    >
    </OpenDetailRestaurant>
    <OpenDetailTourismProduct
      v-if="open_add == 3 && checkType == 4"
      :tourism="detail"
      @toggle="toggle"
      @OK="toggle"
    >
    </OpenDetailTourismProduct>
    <yes-no-alert
      :open="open_confirm"
      alert-msg="Bạn chắc chắn muốn thoát không?"
      @toggle="open_confirm = !open_confirm"
      @OK="toggle"
    />
  </div>
</template>

<script>
import OpenDetailHotel from '~/components/quan-ly-giao-dich/openDetailHotel'
import OpenDetailTour from '~/components/quan-ly-giao-dich/openDetailTour'
import OpenDetailRestaurant from '~/components/quan-ly-giao-dich/openDetailRestaurant'
import OpenDetailTourismProduct from '~/components/quan-ly-giao-dich/openDetailTourismProduct'

import Rules from '~/assets/configurations/Rules'

export default {
  components: {
    OpenDetailHotel,
    OpenDetailTour,
    OpenDetailRestaurant,
    OpenDetailTourismProduct,
  },
  data: () => ({
    Rules,
    open_add: 0,
    detail: {},
    title: 'Chi tiết giao dịch',
    open_confirm: false,
    checkType: 0,
  }),
  watch: {
    '$store.state.app.change_back'(value) {
      this.open_confirm = true
    },
  },
  mounted() {
    let transactionId = 0
    let transactionType = 0
    if ((this.$route.params || '').length !== 0) {
      transactionId = Number(this.$route.params.id)
      transactionType = Number(this.$route.params.type)
    }
    this.$store
      .dispatch('giao_dich/detail', {
        transaction_id: transactionId,
        transaction_type: transactionType,
      })
      .then((res) => {
        if (!res.error) {
          this.detail = res.data.data
          this.set_title(res.data.data.master)
          this.$store.commit('app/checkBack', true)
          this.checkType = transactionType
          this.open_add = 3
        }
      })
  },
  methods: {
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.TransactionList.id
      )
      return roles
    },
    toggle() {
      this.$router.push('/danh-sach-giao-dich')
    },
    set_title(item) {
      this.$store.commit(
        'app/setTitle',
        `Chi tiết giao dịch - #${item.order_id_mask}`
      )
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>
