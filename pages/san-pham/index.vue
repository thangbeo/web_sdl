<template>
  <div v-if="checkRole()">
    <client-only>
      <div v-show="actions === 1">
        <v-tabs
          v-model="tab"
          color="primary"
          active-class="primary--text"
          background-color="#f4f7fe"
          style="position: fixed; z-index: 5"
        >
          <v-tab
            :class="
              (tab !== 0 && 'black--text') +
              ' text-none letter-spacing-normal fs-17 font-weight-bold'
            "
            @click="clicked(0)"
          >
            Danh sách sản phẩm
          </v-tab>

          <v-tab
            :class="
              (tab !== 1 && 'black--text') +
              ' text-none letter-spacing-normal fs-17 font-weight-bold'
            "
            @click="clicked(1)"
          >
            Sản phẩm do nhà cung cấp tạo
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab" style="background-color: #f5f7fe">
          <v-tab-item eager>
            <product-admin
              ref="product_admin"
              style="margin-top: 50px"
              @add="actions = 2"
              @edit="edit"
            />
          </v-tab-item>

          <v-tab-item eager>
            <product-ncc
              ref="product_ncc"
              style="margin-top: 50px"
              @add="actions = 2"
              @edit="edit"
            />
          </v-tab-item>
        </v-tabs-items>
      </div>

      <add v-if="actions === 2" @toggle="actions = 1" @OK="success" />

      <edit-hotel
        v-if="actions === 3"
        :data="detail"
        @toggle="actions = 1"
        @OK="success"
      />

      <edit-restaurant
        v-if="actions === 4"
        :data="detail"
        @toggle="actions = 1"
        @OK="success"
      />

      <edit-tour
        v-if="actions === 5"
        :data="detail"
        @toggle="actions = 1"
        @OK="success"
      />

      <yes-no-alert
        :open="open_confirm"
        alert-msg="Bạn chắc chắn muốn thoát không?"
        @toggle="open_confirm = !open_confirm"
        @OK="actions = 1"
      />
    </client-only>
  </div>
</template>

<script>
import ProductAdmin from '../../components/Product/ProductAdmin'
import ProductNcc from '../../components/Product/ProductNcc'
import Add from '../../components/Product/add/index'
import EditHotel from '../../components/Product/edit/hotel/index'
import EditRestaurant from '../../components/Product/edit/restaurant/index'
import EditTour from '../../components/Product/edit/tour/index'
import Rules from '~/assets/configurations/Rules'

export default {
  components: {
    ProductAdmin,
    ProductNcc,
    Add,
    EditHotel,
    EditRestaurant,
    EditTour,
  },
  data: () => ({
    Rules,
    title: 'Sản phẩm',
    tab: 0,
    actions: 1,
    detail: {},
    check_load: 0,
    open_confirm: false,
  }),
  watch: {
    actions(value) {
      if (value === 1) {
        this.title = 'Sản phẩm'
        this.$store.commit('app/setTitle', this.title)
        this.$store.commit('app/checkBack', false)
      } else if (value === 2) {
        this.title = 'Thêm mới sản phẩm'
        this.$store.commit('app/setTitle', this.title)
        this.$store.commit('app/checkBack', true)
      }
    },
    '$store.state.app.change_back'(value) {
      if (
        this.$store.state.app.pageTitle === 'Thêm mới sản phẩm - Khách sạn' ||
        this.$store.state.app.pageTitle === 'Thêm mới sản phẩm - Nhà hàng' ||
        this.$store.state.app.pageTitle ===
          'Thêm mới sản phẩm - Tour du lịch' ||
        this.$store.state.app.pageTitle === 'Thêm mới sản phẩm du lịch'
      ) {
        this.actions = 2
      } else if (
        this.$store.state.app.pageTitle.includes('Cập nhật sản phẩm') ||
        this.$store.state.app.pageTitle === 'Thêm mới sản phẩm'
      ) {
        this.open_confirm = true
      } else {
        this.actions = 1
      }
    },
  },
  mounted() {
    this.$store.commit('app/checkBack', false)
  },
  created() {
    if (this.$route.fullPath === '/san-pham') {
      this.title = 'Sản phẩm'
      this.$store.commit('app/setTitle', 'Sản phẩm')
    }
  },
  methods: {
    clicked(value) {
      this.check_load = value
      if (this.check_load === 0) {
        this.$refs.product_admin.get_list()
      } else {
        this.$refs.product_ncc.get_list()
      }
    },
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.Product.id
      )
      return roles
    },
    success() {
      this.actions = 1
      if (this.check_load === 0) {
        this.$refs.product_admin.get_list()
      } else {
        this.$refs.product_ncc.get_list()
      }
    },
    set_title(item, checked) {
      const title = checked ? 'Thông tin' : 'Cập nhật'
      this.$store.commit('app/setTitle', `${title} sản phẩm - #${item.sku}`)
    },
    edit(item) {
      if (item.product_type === this.$store.state.app.product_type.hotel) {
        // sửa sản phẩm khách sạn
        this.$store.dispatch('product/hotel_detail', item.id).then((res) => {
          if (!res.error) {
            // console.log(res, ' :1')
            this.detail = res.data.data
            this.set_title(item, res.data.data.hotel.of_status === 1)
            this.actions = 3
            this.$store.commit('app/checkBack', true)
          }
        })
      } else if (
        item.product_type === this.$store.state.app.product_type.restaurant
      ) {
        // sửa sản phẩm nhà hàng
        this.$store
          .dispatch('product/restaurant_detail', item.id)
          .then((res) => {
            if (!res.error) {
              // console.log(res, ' :2')
              this.detail = res.data.data
              this.set_title(item, res.data.data.restaurant.of_status === 1)
              this.actions = 4
              this.$store.commit('app/checkBack', true)
            }
          })
      } else if (
        item.product_type === this.$store.state.app.product_type.tour
      ) {
        // sửa sản phẩm tour

        this.$store.dispatch('product/tour_detail', item.id).then((res) => {
          if (!res.error) {
            // console.log(res, ' :3')
            this.detail = res.data.data
            this.set_title(item, res.data.data.tour.of_status === 1)
            this.actions = 5
            this.$store.commit('app/checkBack', true)
          }
        })
      }
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
