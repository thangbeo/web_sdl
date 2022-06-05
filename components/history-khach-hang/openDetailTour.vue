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
                  >#067773332222
                </v-card-text>
              </v-col>
              <v-col
                cols="4"
                style="background-color: #f9f9f9; border-radius: 4px"
              >
                <v-card-text class="pt-0 font-weight-medium"
                  >Thời gian đặt tour:
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
              >Thông tin đặt tour du lịch</v-card-text
            >
            <v-row>
              <v-col cols="4">
                <v-card-text class="pt-0">Ngày khởi hành:</v-card-text>
                <v-card-text class="pt-0">Số lượng người lớn:</v-card-text>
                <v-card-text class="pt-0">Số lượng trẻ em:</v-card-text>
              </v-col>
              <v-col cols="8" style="text-align: right">
                <v-card-text class="pt-0">22/12/2020</v-card-text>
                <v-card-text class="pt-0">2 người</v-card-text>
                <v-card-text class="pt-0">1 người</v-card-text>
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
                <div class="fs-17 font-weight-bold mb-2">
                  Tour Quảng Ninh 3N2Đ Hà Nội - Cô Tô
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="5" class="pl-7 pr-0">
                <v-card-text class="pt-0 px-0">Lịch trình:</v-card-text>
                <v-card-text
                  class="pt-0 px-0"
                  style="border-bottom: 1px solid #ececec"
                  >Xuất phát:</v-card-text
                >
              </v-col>
              <v-col cols="7" class="pr-7 pl-0" style="text-align: right">
                <v-card-text class="pt-0 px-0">3 ngày 2 đêm</v-card-text>
                <v-card-text
                  class="pt-0 px-0"
                  style="border-bottom: 1px solid #ececec"
                  >từ Hà Nội</v-card-text
                >
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6" class="py-0">
                <v-card-text class="pt-0">Người lớn:</v-card-text>
                <v-card-text class="pt-0">Trẻ em:</v-card-text>
                <v-card-text class="pt-0">Phí dịch vụ:</v-card-text>
                <v-card-text class="pt-0">Phương thức thanh toán:</v-card-text>
              </v-col>
              <v-col cols="6" class="pt-0" style="text-align: right">
                <v-card-text class="pt-0" style="color: #3f69b8"
                  >1,082,251 đ x 100</v-card-text
                >
                <v-card-text class="pt-0" style="color: #3f69b8"
                  >550,000 đ x 1</v-card-text
                >
                <v-card-text class="pt-0" style="color: #3f69b8"
                  >325,000 đ</v-card-text
                >
                <v-card-text class="pt-0" style="color: #3f69b8"
                  >Thanh toán khi nhận phòng</v-card-text
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="5" class="pl-7 py-0 pr-0">
                <v-card-text class="px-0" style="border-top: 1px solid #3f69b8"
                  >Thanh toán:</v-card-text
                ></v-col
              >
              <v-col
                cols="7"
                class="pr-7 pt-0 pl-0"
                style="text-align: right; color: #3f69b8"
              >
                <v-card-text
                  class="px-0 font-weight-medium"
                  style="border-top: 1px solid"
                  >10,500,000 đ</v-card-text
                ></v-col
              >
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
    status: 3,
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
      { value: 1, text: 'Chờ xác nhận', color: '#F5972D', status: 1 },
      { value: 2, text: 'Từ chối xác nhận', color: '#FF0F59', status: 2 },
      { value: 3, text: 'Chưa thanh toán', color: '#3F69B8', status: 3 },
      { value: 4, text: 'Đã thanh toán', color: '#17E555', status: 4 },
      { value: 5, text: 'Đang hủy', color: '#F5972D', status: 5 },
      { value: 6, text: 'Đã hủy', color: '#FF0F59', status: 6 },
      { value: 7, text: 'Thành công', color: '#17E555', status: 7 },
      { value: 8, text: 'Đã đóng', color: '#FF0F59', status: 8 },
      { value: 9, text: 'Xác nhận', color: '#17E555', status: 9 },
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
