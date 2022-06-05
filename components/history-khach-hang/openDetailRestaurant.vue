<template>
  <div style="background-color: #f4f7fe">
    <div class="detail">
      <div>
        <v-row class="pl-4">
          <v-col cols="7" class="mr-5" style="background-color: #fff">
            <v-row class="px-3">
              <v-col
                cols="3"
                style="background-color: #f9f9f9; border-radius: 4px"
              >
                <v-card-text class="pt-0 font-weight-medium"
                  >Mã giao dịch:
                </v-card-text>
                <v-card-text class="pt-0" style="color: #3f69b8"
                  >#067773335555
                </v-card-text>
              </v-col>
              <v-col
                cols="4"
                style="background-color: #f9f9f9; border-radius: 4px"
              >
                <v-card-text class="pt-0 font-weight-medium"
                  >Thời gian đặt bàn:
                </v-card-text>
                <v-card-text class="pt-0" style="color: #3f69b8"
                  >20/10/2020-11:25:15
                </v-card-text>
              </v-col>
              <v-col
                cols="5"
                style="background-color: #f9f9f9; border-radius: 4px"
              >
                <v-card-text class="pt-0 font-weight-medium"
                  >Trạng thái:
                </v-card-text>
                <v-col cols="12" class="pt-0">
                  <v-select
                    v-model="status"
                    class="border-1 fs-14"
                    :items="list_status"
                    solo
                    dense
                    flat
                    :error-messages="statusError"
                    @input="statusError = []"
                    @change="open_change = true"
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
                  </v-select>
                </v-col>
              </v-col>
            </v-row>
            <v-card-text class="fs-17 font-weight-bold"
              >Thông tin đặt bàn</v-card-text
            >
            <v-row>
              <v-col cols="4">
                <v-card-text class="pt-0">Thời gian đặt:</v-card-text>
                <v-card-text class="pt-0">Số lượng khách:</v-card-text>
              </v-col>
              <v-col cols="8" style="text-align: right">
                <v-card-text class="pt-0">14:00 - T6, 22/10/2020</v-card-text>
                <v-card-text class="pt-0">100 khách</v-card-text>
              </v-col>
            </v-row>
            <v-row class="px-4">
              <v-col cols="12" class="py-0">
                <v-card-text
                  class="fs-17 font-weight-bold px-0"
                  style="border-top: 1px solid #ececec"
                  >Thông tin khách hàng</v-card-text
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-card-text class="pt-0">Tên người liên hệ:</v-card-text>
                <v-card-text class="pt-0">Số điện thoại:</v-card-text>
                <v-card-text class="pt-0">Quốc tịch:</v-card-text>
                <v-card-text class="pt-0">Email:</v-card-text>
                <v-card-text class="pt-0">Tên khách:</v-card-text>
                <v-card-text class="py-0">Ghi chú:</v-card-text>
              </v-col>
              <v-col cols="8" style="text-align: right">
                <v-card-text class="pt-0">Hoang Nhung</v-card-text>
                <v-card-text class="pt-0">0919 222 111</v-card-text>
                <v-card-text class="pt-0">Viet Nam</v-card-text>
                <v-card-text class="pt-0">nhungnhung@gmail.com</v-card-text>
                <v-card-text class="pt-0">Hoang Nhung</v-card-text>
              </v-col>
            </v-row>
            <v-row class="px-4">
              <v-col cols="12" class="py-0">
                <v-card-text
                  class="fs-17 font-weight-bold px-0"
                  style="border-top: 1px solid #ececec"
                  >Lịch sử xử lý</v-card-text
                >
              </v-col>
            </v-row>
            <v-row class="px-4">
              <v-col cols="12">
                <v-data-table
                  :headers="headers"
                  :items="item"
                  fixed-header
                  disable-pagination
                  hide-default-footer
                >
                </v-data-table>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" style="background-color: #fff">
            <v-card-text class="fs-17 font-weight-bold pt-0"
              >Thanh toán</v-card-text
            >
            <v-row>
              <v-col cols="11" class="pt-0 ml-4">
                <v-img
                  src="https://staticproxy.mytourcdn.com/1000x600,q90/resources/pictures/hotels/1/ZaebzWX3SLiN6inyWRDYeA-163.jpeg"
                >
                </v-img>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="py-0 ml-4">
                <div class="fs-17 font-weight-bold mb-2">Nhà hàng Lan Chín</div>
                <div class="fs-14" style="color: #3f69b8">
                  50 Hạ Long, P. Bãi Cháy, Tp. Hạ Long, Quảng Ninh
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </div>
    <div>
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="pt-0 d-flex justify-center">
              <v-btn
                class="text-none white--text mr-3"
                color="#47BBFF"
                dark
                depressed
                width="90"
                >Lưu</v-btn
              >
              <v-btn
                color="error"
                class="text-none white--text"
                depressed
                width="90"
                @click="toggle"
              >
                Hủy
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <ChangeStatus :open="open_change" @toggle="open_change = !open_change">
    </ChangeStatus>
  </div>
</template>

<script>
import ChangeStatus from '~/components/history-khach-hang/ChangeStatus'
export default {
  components: { ChangeStatus },
  props: {},
  data: () => ({
    file_img: '',
    required_img: false,
    status: 6,
    open_change: false,
    headers: [
      {
        text: 'Thời điểm',
        value: 'thoiDiem',
      },
      {
        text: 'Hoạt động',
        value: 'hoatDong',
      },
    ],
    item: [
      {
        thoiDiem: '14:00 - Thứ 6 - 20/10/2020',
        hoatDong: '{Thay đổi trạng thái} + {Lý do nếu có}',
      },
      {
        thoiDiem: '14:00 - Thứ 6 - 20/10/2020',
        hoatDong: '{Thay đổi trạng thái} + {Lý do nếu có}',
      },
      {
        thoiDiem: '14:00 - Thứ 6 - 20/10/2020',
        hoatDong: '{Thay đổi trạng thái} + {Lý do nếu có}',
      },
      {
        thoiDiem: '14:00 - Thứ 6 - 20/10/2020',
        hoatDong: '{Thay đổi trạng thái} + {Lý do nếu có}',
      },
      {
        thoiDiem: '14:00 - Thứ 6 - 20/10/2020',
        hoatDong: '{Thay đổi trạng thái} + {Lý do nếu có}',
      },
      {
        thoiDiem: '14:00 - Thứ 6 - 20/10/2020',
        hoatDong: '{Thay đổi trạng thái} + {Lý do nếu có}',
      },
      {
        thoiDiem: '14:00 - Thứ 6 - 20/10/2020',
        hoatDong: '{Thay đổi trạng thái} + {Lý do nếu có}',
      },
      {
        thoiDiem: '14:00 - Thứ 6 - 20/10/2020',
        hoatDong: '{Thay đổi trạng thái} + {Lý do nếu có}',
      },
      {
        thoiDiem: '14:00 - Thứ 6 - 20/10/2020',
        hoatDong: '{Thay đổi trạng thái} + {Lý do nếu có}',
      },
      {
        thoiDiem: '14:00 - Thứ 6 - 20/10/2020',
        hoatDong: '{Thay đổi trạng thái} + {Lý do nếu có}',
      },
    ],
    list_status: [
      { value: 5, text: 'Đã hủy', status: 6, color: '#FF0F59' },
      { value: 6, text: 'Thành công', status: 7, color: '#17E555' },
      { value: 7, text: 'Đã đóng', status: 8, color: '#FF0F59' },
      { value: 8, text: 'Xác nhận', status: 9, color: '#17E555' },
    ],
  }),
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
<style lang="scss">
.detail {
  .v-data-table__wrapper {
    border-bottom: none !important;
  }
  .v-data-table {
    .v-data-table-header tr th {
      color: #242424 !important;
      border-bottom: none !important;
      box-shadow: none !important;
    }
    tbody tr td {
      background-color: #f9f9f9;
      border-bottom: none !important;
    }
    .v-data-table-header tr th i {
      display: none;
    }
  }
}
</style>
