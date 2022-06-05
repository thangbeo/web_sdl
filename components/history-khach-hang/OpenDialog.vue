<template>
  <div>
    <v-dialog
      :value="open"
      max-width="700px"
      @keydown="$event.key === 'Escape' && toggle()"
      @click:outside="toggle"
    >
      <v-card>
        <v-card-title class="pt-3 pb-1">Tìm kiếm nâng cao</v-card-title>
        <v-container class="py-0">
          <v-row>
            <v-col cols="6" class="pb-0">
              <v-text-field
                v-model="khachHang"
                label="Khách hàng"
                dense
                hide-details
                outlined
                clearable
              ></v-text-field>
            </v-col>

            <v-col cols="6" class="pb-0">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="dateTime"
                    dense
                    label="Thời gian đặt"
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="6" class="pb-0">
              <v-text-field
                v-model="code"
                label="Mã giao dịch"
                dense
                outlined
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="pb-0">
              <v-autocomplete
                v-model="status"
                label="Trạng thái"
                :items="list_status"
                dense
                outlined
                hide-details
                clearable
                class="fs-14"
              >
                <template v-slot:selection="data">
                  <div :style="`color: ${data.item.color}`">
                    {{ data.item.text }}
                  </div>
                </template>
                <template v-slot:item="data">
                  <div
                    :style="`color: ${data.item.color} !important`"
                    class="fs-13"
                  >
                    {{ data.item.text }}
                  </div>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions class="pt-6">
          <div class="flex-grow-1"></div>
          <v-btn
            depressed
            color="#47BBFF"
            class="text-none white--text mr-1"
            width="90"
          >
            <div class="font_size">Lưu</div>
          </v-btn>
          <v-btn depressed class="text-none error" width="90" @click="toggle">
            <div class="font_size">Hủy</div>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  components: {},
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    khachHang: '',
    time: '',
    code: '',
    status: 1,
    list_status: [
      { value: 1, text: 'Chờ xác nhận', color: '#F5972D' },
      { value: 2, text: 'Từ chối xác nhận', color: '#FF0F59' },
      { value: 3, text: 'Chưa thanh toán', color: '#3F69B8' },
      { value: 4, text: 'Đã thanh toán', color: '#17E555' },
      { value: 5, text: 'Đang hủy', color: '#F5972D' },
      { value: 6, text: 'Đã hủy', color: '#FF0F59' },
      { value: 7, text: 'Thành công', color: '#17E555' },
      { value: 8, text: 'Đã đóng', color: '#FF0F59' },
      { value: 9, text: 'Xác nhận', color: '#17E555' },
    ],
  }),
  computed: {
    dateTime() {
      const strDate = this.date
      if (!strDate) return ''
      return moment(strDate).format('DD/MM/YYYY')
    },
  },
  methods: {
    clearSelected() {
      this.selected = null
    },
    toggle() {
      this.$emit('toggle')
    },
  },
}
</script>
