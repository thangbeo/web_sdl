<template>
  <div class="add_main_transaction_history">
    <div>
      <div class="d-flex w-100 actions-coordinates-1">
        <div class="flex-grow-1"></div>
        <div class="pb-13"></div>
        <div class="d-flex w-100 actions-coordinates-2">
          <div class="flex-grow-1"></div>
          <v-btn
            color="error"
            class="text-none white--text mr-3"
            depressed
            width="90"
            @click="open_cancel = true"
            >Hủy</v-btn
          >
          <!--  @click="demo" -->
          <v-btn
            class="text-none white--text mr-3"
            color="#47BBFF"
            dark
            depressed
            width="90"
            @click="open_add = true"
            >Thêm</v-btn
          >
        </div>
      </div>
      <div>
        <v-container>
          <v-row>
            <v-col cols="2">
              <v-card-text class="pb-0 pt-2 font-weight-bold"
                >Loại sản phẩm <span class="red--text">*</span>
              </v-card-text>
            </v-col>
            <v-col cols="9">
              <v-select
                v-model="selected"
                :items="loaiSanPham"
                placeholder="Chọn Loại sản phẩm"
                solo
                flat
                dense
                class="fs-14 border-1"
                :error-messages="selectedError"
                @input="selectedError = []"
                @change="change_product_type(selected)"
              >
              </v-select>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>

    <AddHotel
      v-show="selected == 1"
      ref="validateHotel"
      :nation="listNation"
      :open="selected == 1"
      @success="success"
      @exit="toggle"
    >
    </AddHotel>
    <AddNhaHang
      v-show="selected == 2"
      ref="validateRestaurant"
      :nation="listNation"
      :open="selected == 2"
      @success="success"
      @exit="toggle"
    >
    </AddNhaHang>
    <AddTour
      v-show="selected == 3"
      ref="validateTour"
      :nation="listNation"
      :open="selected == 3"
      @success="success"
      @exit="toggle"
    >
    </AddTour>
    <AddTourismProduct
      v-show="selected == 4"
      ref="validateTourismProduct"
      :nation="listNation"
      :open="selected == 4"
      @success="success"
      @exit="toggle"
    >
    </AddTourismProduct>
    <yes-no-alert
      :open="open_cancel"
      alert-msg="Bạn có chắc chắn muốn thoát?"
      @toggle="open_cancel = !open_cancel"
      @OK="toggle"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_add"
      alert-msg="Bạn có chắc chắn muốn Thêm?"
      @toggle="open_add = !open_add"
      @OK="save"
    >
    </yes-no-alert>
  </div>
</template>

<script>
import AddHotel from '~/components/khach-hang/lich-su-giao-dich/AddHotel'
import AddTour from '~/components/khach-hang/lich-su-giao-dich/AddTour'
import AddNhaHang from '~/components/khach-hang/lich-su-giao-dich/AddNhaHang'
import AddTourismProduct from '~/components/khach-hang/lich-su-giao-dich/AddTourismProduct'
export default {
  components: {
    AddHotel,
    AddTour,
    AddNhaHang,
    AddTourismProduct,
  },
  data() {
    return {
      status: null,
      open_cancel: false,
      open_add: false,
      selected: null,
      selectedError: [],
      loaiSanPham: [],
      listNation: [],
    }
  },
  created() {
    this.$store.dispatch('giao_dich/product_type').then((res) => {
      if (!res.error) {
        const arr = []

        if ((res.data.data || []).length !== 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            arr.push({
              value: res.data.data[i].id,
              text: res.data.data[i].name,
            })
          }
        }
        this.loaiSanPham = [...arr]
      }
    })

    this.$store.dispatch('giao_dich/nation').then((res) => {
      if (!res.error) {
        const arr = []

        if ((res.data.data || []).length !== 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            arr.push({
              value: res.data.data[i].id,
              text: res.data.data[i].name,
            })
          }
        }
        this.listNation = [...arr]
      }
    })
  },
  methods: {
    save() {
      let hasErrors = false
      let count = 0
      if (this.$isNullOrEmpty(this.selected)) {
        hasErrors = true
        this.selectedError = ['Không được để trống']
        count += 1
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        if (this.selected === 1) {
          this.$refs.validateHotel.validateHotel()
        } else if (this.selected === 2) {
          this.$refs.validateRestaurant.validateRestaurant()
        } else if (this.selected === 3) {
          this.$refs.validateTour.validateTour()
        } else {
          this.$refs.validateTourismProduct.validateTourismProduct()
        }
      }
    },

    success() {
      this.$emit('success')
    },
    change_product_type() {
      // const arr = []
      for (let i = 0; i < this.loaiSanPham.length; i++) {
        if (this.loaiSanPham[i].value === this.selected) {
          if (this.selected === 1) {
            this.$store.commit(
              'app/setTitle',
              `Thêm giao dịch - ${this.loaiSanPham[i].text}`
            )
            this.$store.commit(
              'khach_hang/back_title',
              this.loaiSanPham[i].text
            )
          }
        }
        if (this.loaiSanPham[i].value === this.selected) {
          if (this.selected === 2) {
            this.$store.commit(
              'app/setTitle',
              `Thêm giao dịch - ${this.loaiSanPham[i].text}`
            )
            this.$store.commit(
              'khach_hang/back_title',
              this.loaiSanPham[i].text
            )
          }
        }
        if (this.loaiSanPham[i].value === this.selected) {
          if (this.selected === 3) {
            this.$store.commit(
              'app/setTitle',
              `Thêm giao dịch - ${this.loaiSanPham[i].text}`
            )
            this.$store.commit(
              'khach_hang/back_title',
              this.loaiSanPham[i].text
            )
          }
        }
        if (this.loaiSanPham[i].value === this.selected) {
          if (this.selected === 4) {
            this.$store.commit(
              'app/setTitle',
              `Thêm giao dịch - ${this.loaiSanPham[i].text}`
            )
            this.$store.commit(
              'khach_hang/back_title',
              this.loaiSanPham[i].text
            )
          }
        }
      }
    },
    closeAdd() {
      this.selected = null
      this.$store.commit('app/setTitle', `Thêm giao dịch`)
      this.$refs.validateHotel.resetHotel()
      this.$refs.validateRestaurant.resetRestaurant()
      this.$refs.validateTour.resetTour()
      this.$refs.validateTourismProduct.resetTourismProduct()
    },
    toggle() {
      this.$emit('toggle')
      this.$store.commit(
        'app/setTitle',
        `Lịch sử giao dịch - ${
          this.$store.state.khach_hang.customerId.info.name === null
            ? this.$store.state.khach_hang.customerId.info.email
            : this.$store.state.khach_hang.customerId.info.name
        }`
      )
      if (this.selected === 1) {
        this.$refs.validateHotel.resetHotel()
      } else if (this.selected === 2) {
        this.$refs.validateRestaurant.resetRestaurant()
      } else if (this.selected === 3) {
        this.$refs.validateTour.resetTour()
      } else {
        this.$refs.validateTourismProduct.resetTourismProduct()
      }
    },
  },
}
</script>
<style lang="scss">
.add_main_transaction_history {
  .actions-coordinates-1 {
    position: fixed;
    z-index: 1;
    right: 0;
    top: 75px;
    background-color: #f5f7fe;
  }
  .actions-coordinates-2 {
    position: fixed;
    padding-bottom: 20px;
    padding-top: 10px;
    z-index: 3;
    right: 0;
    bottom: 0;
    background-color: #f5f7fe;
  }
}
</style>
