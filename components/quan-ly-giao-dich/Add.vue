<template>
  <div class="transition">
    <div>
      <div class="d-flex w-100 actions-coordinates-2 py-4">
        <div class="flex-grow-1"></div>
        <v-btn
          depressed
          class="text-none error mr-4"
          width="90"
          @click="open_cancel = true"
          ><span>Hủy</span></v-btn
        >
        <v-btn
          depressed
          color="#47BBFF"
          class="text-none white--text"
          width="90"
          @click="open_save = true"
        >
          <span class="fs-14">Thêm</span></v-btn
        >
      </div>
      <v-row class="pl-8">
        <v-col cols="3">
          <v-card-text class="pb-0 pt-2 font-weight-bold"
            >Loại sản phẩm <span class="red--text">*</span>
          </v-card-text>
        </v-col>
        <v-col cols="8">
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
          >
          </v-select>
        </v-col>
      </v-row>
    </div>

    <AddHotel
      v-show="selected == 1"
      ref="validateHotel"
      :nation="listNation"
      :open="selected == 1"
      @exit="exit"
    >
    </AddHotel>
    <AddNhaHang
      v-show="selected == 2"
      ref="validateRestaurant"
      :nation="listNation"
      :open="selected == 2"
      @exit="exit"
    >
    </AddNhaHang>
    <AddTour
      v-show="selected == 3"
      ref="validateTour"
      :nation="listNation"
      :open="selected == 3"
      @exit="exit"
    >
    </AddTour>
    <AddTourismProduct
      v-show="selected == 4"
      ref="validateTourismProduct"
      :open="selected == 4"
      @exit="exit"
    >
    </AddTourismProduct>
    <yes-no-alert
      :open="open_save"
      alert-msg="Bạn chắc chắn muốn thêm giao dịch?"
      @toggle="open_save = !open_save"
      @OK="save"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_cancel"
      alert-msg="Bạn chắc chắn muốn hủy?"
      @toggle="open_cancel = !open_cancel"
      @OK="toggle"
    >
    </yes-no-alert>
  </div>
</template>

<script>
import AddHotel from '~/components/quan-ly-giao-dich/AddHotel'
import AddTour from '~/components/quan-ly-giao-dich/AddTour'
import AddNhaHang from '~/components/quan-ly-giao-dich/AddNhaHang'
import AddTourismProduct from '~/components/quan-ly-giao-dich/AddTourismProduct'
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
      selected: null,
      selectedError: [],
      loaiSanPham: [],
      listNation: [],
      open_cancel: false,
      open_save: false,
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
    exit() {
      this.$emit('exit')
    },
    toggle() {
      this.$emit('toggle')
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
.transition {
  .actions-coordinates-2 {
    position: fixed;
    z-index: 3;
    right: 30px;
    bottom: 0;
    background-color: #f5f7fe;
  }
}
</style>
