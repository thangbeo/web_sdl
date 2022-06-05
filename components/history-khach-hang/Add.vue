<template>
  <div>
    <div>
      <div>
        <div>
          <v-row class="pb-12">
            <v-col
              cols="12"
              style="
                position: fixed;
                z-index: 1;
                right: 150px;
                top: 80px;
                background-color: #f5f7fe;
              "
            >
              <div class="pt-0" style="text-align: right">
                <v-btn
                  depressed
                  color="#47BBFF"
                  class="text-none white--text mr-4"
                  width="90"
                  @click="save"
                >
                  <span class="fs-14">Lưu</span></v-btn
                >
                <v-btn
                  depressed
                  class="text-none error"
                  width="90"
                  @click="toggle"
                  ><span>Hủy</span></v-btn
                >
              </div>
            </v-col>
          </v-row>
        </div>
        <v-row class="pl-8">
          <v-col cols="3">
            <v-card-text class="pb-0 pt-2 font-weight-bold"
              >Loại sản phẩm <span class="red--text">*</span>
            </v-card-text>
          </v-col>
          <v-col cols="6">
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
    </div>

    <AddHotel v-if="selected == 0" ref="validateHotel"> </AddHotel>
    <AddTour v-if="selected == 1" ref="validateTour"> </AddTour>
    <AddNhaHang v-if="selected == 2" ref="validateRestaurant"> </AddNhaHang>
  </div>
</template>

<script>
import AddHotel from '~/components/history-khach-hang/AddHotel'
import AddTour from '~/components/history-khach-hang/AddTour'
import AddNhaHang from '~/components/history-khach-hang/AddNhaHang'
export default {
  components: {
    AddHotel,
    AddTour,
    AddNhaHang,
  },
  props: {},
  data() {
    return {
      name_posts_default: '',
      status: null,
      selected: null,
      selectedError: [],
      loaiSanPham: [
        { value: 0, text: 'Khách sạn', type: 1 },
        { value: 1, text: 'Tour du lịch', type: 2 },
        { value: 2, text: 'Nhà hàng', type: 3 },
      ],
    }
  },
  methods: {
    save() {
      let hasErrors = false
      if (this.$isNullOrEmpty(this.selected)) {
        hasErrors = true
        this.selectedError = ['Không được để trống']
      }
      if (!hasErrors) {
        if (this.selected === 0) {
          this.$refs.validateHotel.validateHotel()
        } else if (this.selected === 1) {
          this.$refs.validateTour.validateTour()
        } else {
          this.$refs.validateRestaurant.validateRestaurant()
        }
      }
    },
    toggle() {
      this.$emit('toggle')
    },
  },
}
</script>
