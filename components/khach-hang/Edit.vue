<template>
  <div></div>
</template>

<script>
// import ThongTinKhachHang from '~/components/khach-hang/ThongTinKhachHang'
// import LichSuGiaoDich from '~/components/khach-hang/lich-su-giao-dich/LichSuGiaoDich'
// import DanhGiaKhachHang from '~/components/khach-hang/danh-gia-khach-hang/DanhGiaKhachHang.vue'
// import DanhSachDaLuu from '~/components/khach-hang/danh-gia-da-luu/DanhSachDaLuu'

export default {
  components: {
    // ThongTinKhachHang,
    // LichSuGiaoDich,
    // DanhSachDaLuu,
    // DanhGiaKhachHang,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tab: 0,
      // open_confirm: 0,
      tabGiaoDich: 0,
      tabDaluu: 0,
      tabDanhGia: 0,
      title: '',
      // data_customer_information: {},
    }
  },
  watch: {
    '$store.state.app.change_back'(value) {
      // this.$refs.closeGiaoDich.closeAddGiaoDich()
      // this.$refs.closeGiaoDich.closeViewGiaoDich()
      // this.$refs.closeDanhGia.closeDanhGia()
      // this.open_confirm = 1
    },
  },
  created() {
    this.tab = 0
    this.$store.commit('app/checkBack', true)
    // this.customer_detail()
  },
  methods: {
    clicked_tab(value) {
      this.tabGiaoDich = value
      this.tabDaluu = value
      this.tabDanhGia = value
      this.$emit('title_edit', value)
    },
    toggle() {
      this.$emit('toggle')
    },
    exit() {
      this.$emit('exit')
    },
  },
}
</script>
