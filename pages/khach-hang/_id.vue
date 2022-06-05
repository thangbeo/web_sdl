<template>
  <div v-if="checkRole()">
    <div v-if="hidden === 1">
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
          @click="clicked_tab(1)"
        >
          Thông tin khách hàng
        </v-tab>

        <v-tab
          :class="
            (tab !== 1 && 'black--text') +
            ' text-none letter-spacing-normal fs-17  font-weight-bold'
          "
          @click="clicked_tab(2)"
        >
          Lịch sử giao dịch
        </v-tab>
        <v-tab
          :class="
            (tab !== 2 && 'black--text') +
            ' text-none letter-spacing-normal fs-17  font-weight-bold'
          "
          @click="clicked_tab(3)"
        >
          Đánh giá
        </v-tab>
        <v-tab
          :class="
            (tab !== 3 && 'black--text') +
            ' text-none letter-spacing-normal fs-17  font-weight-bold'
          "
          @click="clicked_tab(4)"
        >
          Danh sách đã lưu
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item eager>
          <thong-tin-khach-hang ref="ThongTinKhachHang" :data="data" />
        </v-tab-item>

        <v-tab-item eager>
          <LichSuGiaoDich
            :id="data.id"
            ref="LichSuGiaoDich"
            @set_title="set_title"
          />
        </v-tab-item>

        <v-tab-item eager>
          <DanhGiaKhachHang
            :id="data.id"
            ref="DanhGiaKhachHang"
            @set_title="set_title"
          />
        </v-tab-item>

        <v-tab-item eager>
          <DanhSachDaLuu :id="data.id" ref="DanhSachDaLuu" />
        </v-tab-item>
      </v-tabs-items>

      <yes-no-alert
        :open="open_cancel"
        alert-msg="Bạn có chắc chắn muốn thoát?"
        @toggle="open_cancel = !open_cancel"
        @OK="confirm_cancel"
      />
    </div>
  </div>
</template>

<script>
import ThongTinKhachHang from '~/components/khach-hang/ThongTinKhachHang'
import LichSuGiaoDich from '~/components/khach-hang/lich-su-giao-dich/LichSuGiaoDich'
import DanhGiaKhachHang from '~/components/khach-hang/danh-gia-khach-hang/DanhGiaKhachHang.vue'
import DanhSachDaLuu from '~/components/khach-hang/danh-gia-da-luu/DanhSachDaLuu'
import Rules from '~/assets/configurations/Rules'
export default {
  components: {
    ThongTinKhachHang,
    LichSuGiaoDich,
    DanhSachDaLuu,
    DanhGiaKhachHang,
  },
  data: () => ({
    data: {},
    hidden: 0,
    // info tab
    tab: 0,
    open_cancel: false,
  }),
  watch: {
    '$store.state.app.change_back'() {
      if (
        this.$store.state.app.pageTitle.includes('Thông tin khách hàng') ||
        this.$store.state.app.pageTitle.includes('Lịch sử giao dịch') ||
        this.$store.state.app.pageTitle.includes('Đánh giá') ||
        this.$store.state.app.pageTitle.includes('Danh sách đã lưu')
      ) {
        this.open_cancel = true
      }
      if (this.$store.state.app.pageTitle.includes('Thêm giao dịch')) {
      }
    },
  },
  mounted() {
    this.$store.commit('app/checkBack', true)
    if ((this.$route.params || '').length !== 0) {
      this.$store
        .dispatch('khach_hang/customer_detail', {
          customer_id: Number(this.$route.params.id),
        })
        .then((response) => {
          if (!response.error) {
            this.data = {
              id: Number(this.$route.params.id),
              info: response.data.data,
            }
            this.$store.commit('khach_hang/customer_id', this.data)
            this.$store.commit(
              'app/setTitle',
              `Thông tin khách hàng - ${
                response.data.data.name === null
                  ? response.data.data.email
                  : response.data.data.name
              }`
            )
            this.hidden = 1
          }
        })
    }
  },
  methods: {
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.Customer.id
      )
      return roles
    },
    clicked_tab(value) {
      switch (value) {
        case 1:
          this.$store.commit(
            'app/setTitle',
            `Thông tin khách hàng - ${
              this.data.info.name === null
                ? this.data.info.email
                : this.data.info.name
            }`
          )
          break
        case 2:
          this.$refs.LichSuGiaoDich.list_transaction_customer()
          this.$store.commit(
            'app/setTitle',
            `Lịch sử giao dịch - ${
              this.data.info.name === null
                ? this.data.info.email
                : this.data.info.name
            }`
          )
          break
        case 3:
          this.$refs.DanhGiaKhachHang.get_data()
          this.$store.commit(
            'app/setTitle',
            `Đánh giá - ${
              this.data.info.name === null
                ? this.data.info.email
                : this.data.info.name
            }`
          )
          break
        case 4:
          this.$refs.DanhSachDaLuu.list_favorite_customer()
          this.$store.commit(
            'app/setTitle',
            `Danh sách đã lưu - ${
              this.data.info.name === null
                ? this.data.info.email
                : this.data.info.name
            }`
          )
          break
      }
    },
    confirm_cancel() {
      this.$router.push('/khach-hang')
    },
    set_title(value) {
      if (value === 2) {
        this.$store.commit(
          'app/setTitle',
          `Lịch sử giao dịch - ${
            this.data.info.name === null
              ? this.data.info.email
              : this.data.info.name
          }`
        )
      }
      if (value === 3) {
        this.$store.commit(
          'app/setTitle',
          `Đánh giá - ${
            this.data.info.name === null
              ? this.data.info.email
              : this.data.info.name
          }`
        )
      }
    },
  },
  head() {
    return {
      title: 'Khách hàng',
    }
  },
}
</script>
