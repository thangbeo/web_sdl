<template>
  <div v-if="checkRole()">
    <edit-hotel
      v-if="actions === 1"
      :data="detail"
      @toggle="toggle"
      @OK="toggle"
    />

    <edit-restaurant
      v-if="actions === 2"
      :data="detail"
      @toggle="toggle"
      @OK="toggle"
    />

    <edit-tour
      v-if="actions === 3"
      :data="detail"
      @toggle="toggle"
      @OK="toggle"
    />

    <UpdateTourismProduct
      v-if="actions === 4"
      readonly
      :data="detail"
      :prod-attr-set="detail.attributeSetId"
      @toggle="toggle"
      @success="toggle"
    />

    <yes-no-alert
      :open="open_confirm"
      alert-msg="Bạn chắc chắn muốn thoát không?"
      @toggle="open_confirm = !open_confirm"
      @OK="toggle"
    />
  </div>
</template>

<script>
import EditHotel from '../../../components/Product/edit/hotel/index'
import EditRestaurant from '../../../components/Product/edit/restaurant/index'
import EditTour from '../../../components/Product/edit/tour/index'
import UpdateTourismProduct from '~/components/Product/edit/tourism-product/UpdateTourismProduct.vue'

import Rules from '~/assets/configurations/Rules'

export default {
  components: {
    EditHotel,
    EditRestaurant,
    EditTour,
    UpdateTourismProduct,
  },
  data: () => ({
    Rules,
    actions: 0,
    detail: {},
    title: 'Cập nhật sản phẩm',
    open_confirm: false,
  }),
  watch: {
    '$store.state.app.change_back'(value) {
      this.open_confirm = true
    },
  },
  mounted() {
    let id = 0
    let type = 0
    if ((this.$route.params || '').length !== 0) {
      id = Number(this.$route.params.id)
      type = Number(this.$route.params.type)
    }
    if (type === this.$store.state.app.product_type.hotel) {
      // sửa sản phẩm khách sạn
      this.$store.dispatch('product/hotel_detail', id).then((res) => {
        if (!res.error) {
          // console.log(res, ' :1')
          this.detail = res.data.data
          this.set_title(res.data.data.hotel)
          this.$store.commit('app/checkBack', true)
          this.actions = 1
        }
      })
    } else if (type === this.$store.state.app.product_type.restaurant) {
      // sửa sản phẩm nhà hàng
      this.$store.dispatch('product/restaurant_detail', id).then((res) => {
        if (!res.error) {
          // console.log(res, ' :2')
          this.detail = res.data.data
          this.set_title(res.data.data.restaurant)
          this.$store.commit('app/checkBack', true)
          this.actions = 2
        }
      })
    } else if (type === this.$store.state.app.product_type.tour) {
      // sửa sản phẩm tour

      this.$store.dispatch('product/tour_detail', id).then((res) => {
        if (!res.error) {
          // console.log(res, ' :3')
          this.detail = res.data.data
          this.set_title(res.data.data.tour)
          this.$store.commit('app/checkBack', true)
          this.actions = 3
        }
      })
    } else if (type === this.$store.state.app.product_type.products) {
      // sửa sản phẩm tour

      this.$store
        .dispatch('tourismProduct/getTourismProductDetails', {
          product_id: id,
        })
        .then((res) => {
          if (!res.error) {
            // console.log(res, ' :3')
            this.detail = res.data.data
            this.set_title(res.data.data)
            this.$store.commit('app/checkBack', true)
            this.actions = 4
          }
        })
    }
  },
  methods: {
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.Product.id
      )
      return roles
    },
    toggle() {
      this.$router.push('/san-pham')
    },
    set_title(item) {
      this.$store.commit('app/setTitle', `Cập nhật sản phẩm - #${item.sku}`)
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>
