<template>
  <div>
    <div>
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
            :menu-props="{ zIndex: '1' }"
            placeholder="Chọn Loại sản phẩm"
            solo
            flat
            dense
            :outlined="selectedError.length !== 0"
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
      @exit="$emit('success')"
    >
    </AddHotel>
    <AddNhaHang
      v-show="selected == 2"
      ref="validateRestaurant"
      :nation="listNation"
      :open="selected == 2"
      @exit="$emit('success')"
    >
    </AddNhaHang>
    <AddTour
      v-show="selected == 3"
      ref="validateTour"
      :nation="listNation"
      :open="selected == 3"
      @exit="$emit('success')"
    >
    </AddTour>
    <AddTourismProduct
      v-show="selected == 4"
      ref="validateTourismProduct"
      :open="selected == 4"
      @exit="$emit('success')"
    >
    </AddTourismProduct>
    <div style="position: fixed; z-index: 3; right: 208px; bottom: 10px">
      <v-btn
        color="#656565"
        width="90px"
        class="text-none white--text mr-3"
        depressed
        @click="open_cancel = true"
        >Hủy</v-btn
      >
      <v-btn
        class="text-none"
        width="90px"
        color="#47BBFF"
        dark
        depressed
        @click="open_save = true"
        >Tiếp tục</v-btn
      >
    </div>
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
import AddHotel from '~/components/quan-ly-nha-cung-cap/history-nha-cung-cap/AddHotel'
import AddTour from '~/components/quan-ly-nha-cung-cap/history-nha-cung-cap/AddTour'
import AddNhaHang from '~/components/quan-ly-nha-cung-cap/history-nha-cung-cap/AddNhaHang'
import AddTourismProduct from '~/components/quan-ly-nha-cung-cap/history-nha-cung-cap/AddTourismProduct'
export default {
  components: {
    AddHotel,
    AddTour,
    AddNhaHang,
    AddTourismProduct,
  },
  props: {},
  data() {
    return {
      open_cancel: false,
      open_save: false,
      status: null,
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
    // back() {
    //   this.$emit('backhistory')
    //   this.toggle()
    // },
    exit() {
      this.$emit('exit')
    },
    toggle() {
      this.$emit('backhistory')
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
