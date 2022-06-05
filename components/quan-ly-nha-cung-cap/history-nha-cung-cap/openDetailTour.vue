<template>
  <div class="tour">
    <div style="background-color: #f4f7fe">
      <v-row class="pl-4">
        <v-col cols="7" class="mr-5" style="background-color: #fff">
          <v-row class="px-3">
            <v-col
              class="pb-0"
              cols="3"
              style="background-color: #f9f9f9; border-radius: 4px"
            >
              <v-card-text class="pt-0 font-weight-medium"
                >Mã giao dịch:
              </v-card-text>
              <v-card-text class="py-0" style="color: #3f69b8"
                >#
                {{ $isNullOrEmpty(tourMaster) ? '' : tourMaster.order_id_mask }}
              </v-card-text>
            </v-col>
            <v-col
              class="pb-0"
              cols="4"
              style="background-color: #f9f9f9; border-radius: 4px"
            >
              <v-card-text class="pt-0 font-weight-medium"
                >Thời gian đặt tour:
              </v-card-text>
              <v-card-text class="py-0" style="color: #3f69b8"
                >{{ $isNullOrEmpty(tourMaster) ? '' : tourMaster.create_time }}
              </v-card-text>
            </v-col>
            <v-col
              class="pb-0"
              cols="5"
              style="background-color: #f9f9f9; border-radius: 4px"
            >
              <v-card-text class="pt-0 font-weight-medium"
                >Trạng thái:
              </v-card-text>
              <v-col cols="12" class="py-0">
                <v-select
                  v-model="status"
                  class="border-1 fs-14"
                  :items="list_status"
                  solo
                  dense
                  flat
                  :error-messages="statusError"
                  @input="statusError = []"
                  @click="set_status(status)"
                  @change="confirm_change_status($event)"
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
            <v-col
              v-if="changeStatus"
              class="pt-0"
              cols="3"
              style="background-color: #f9f9f9; border-radius: 4px"
            >
              <v-card-text
                >Lý do<span class="red--text ml-1">*</span>
              </v-card-text></v-col
            >
            <v-col
              v-if="changeStatus"
              class="py-0"
              cols="9"
              style="background-color: #f9f9f9; border-radius: 4px"
            >
              <v-textarea
                v-model="status_description"
                class="border-1 fs-14"
                dense
                label="Nhập lý do"
                solo
                flat
                rows="2"
                :error-messages="status_description_msg"
                @input="status_description_msg = []"
              ></v-textarea>
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
              <v-card-text class="pt-0">{{
                $isNullOrEmpty(start_time) ? '' : start_time
              }}</v-card-text>
              <v-card-text class="pt-0">{{
                $isNullOrEmpty(tourDetail) ? '' : tourDetail.adults_quantity
              }}</v-card-text>
              <v-card-text class="pt-0">{{
                $isNullOrEmpty(tourDetail) ? '' : tourDetail.child_quantity
              }}</v-card-text>
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
              <v-card-text class="pt-0">{{
                $isNullOrEmpty(tourMaster) ? '' : tourMaster.cust_name
              }}</v-card-text>
              <v-card-text class="pt-0">{{
                $isNullOrEmpty(tourMaster) ? '' : tourMaster.cust_phone
              }}</v-card-text>
              <v-card-text class="pt-0" style="height: 38px">{{
                $isNullOrEmpty(tourMaster) ? '' : tourMaster.nation_code
              }}</v-card-text>
              <v-card-text class="pt-0">{{
                $isNullOrEmpty(tourMaster) ? '' : tourMaster.cust_email
              }}</v-card-text>
              <v-card-text class="pt-0">{{
                $isNullOrEmpty(tourMaster) ? '' : tourMaster.cust_name
              }}</v-card-text>
              <v-card-text class="pt-0">{{
                $isNullOrEmpty(tourMaster) ? '' : tourMaster.note
              }}</v-card-text>
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
                :items="items"
                hide-default-footer
                loading-text="Xin chờ..."
                no-results-text="Không có kết quả phù hợp"
                no-data-text="Không có dữ liệu"
                fixed-header
                multi-sort
                :sort-desc="true"
              >
                <template v-slot:[`item.at`]="{ item }">
                  <div>{{ fomartDate(item.at) }}</div>
                </template>
                <template v-slot:[`item.order_status_to`]="{ item }">
                  <div v-if="item.order_status_to == 0" style="color: #f5972d">
                    Chờ xác nhận
                  </div>
                  <div v-if="item.order_status_to == 1" style="color: #ff0f59">
                    Từ chối xác nhận
                  </div>
                  <div v-if="item.order_status_to == 2" style="color: #3f69b8">
                    Đã xác nhận - chưa thanh toán
                  </div>
                  <div v-if="item.order_status_to == 3" style="color: #17e555">
                    Đã thanh toán
                  </div>
                  <div v-if="item.order_status_to == 4" style="color: #00f">
                    Đang giao hàng
                  </div>
                  <div v-if="item.order_status_to == 5" style="color: #f6cece">
                    Đang hủy
                  </div>
                  <div v-if="item.order_status_to == 6" style="color: #f00">
                    Đã hủy
                  </div>
                  <div v-if="item.order_status_to == 7" style="color: #0ff">
                    Thành công
                  </div>
                  <div v-if="item.order_status_to == 8" style="color: #df013a">
                    Đã đóng
                  </div>
                </template>
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
                :src="`${$isNullOrEmpty(tourInfor) ? '' : tourInfor.thumbnail}`"
              >
              </v-img>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="py-0 ml-4">
              <div class="fs-17 font-weight-bold mb-2">
                {{ $isNullOrEmpty(tourInfor) ? '' : tourInfor.name }}
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
              <v-card-text class="pt-0 px-0"
                >{{ $isNullOrEmpty(tourInfor) ? '' : tourInfor.number_day }}
                ngày
                {{ $isNullOrEmpty(tourInfor) ? '' : tourInfor.number_night }}
                đêm</v-card-text
              >
              <v-card-text
                class="pt-0 px-0"
                style="border-bottom: 1px solid #ececec"
                >{{
                  $isNullOrEmpty(tourInfor) ? '' : tourInfor.start_place_name
                }}</v-card-text
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
                >{{
                  $isNullOrEmpty(tourDetail)
                    ? ''
                    : `${$formatMoney({
                        amount: tourDetail.adults_price,
                      })}`
                }}
                {{ $isNullOrEmpty(tourMaster) ? '' : tourMaster.currency_code }}
              </v-card-text>
              <v-card-text class="pt-0" style="color: #3f69b8"
                >{{
                  $isNullOrEmpty(tourDetail)
                    ? ''
                    : `${$formatMoney({
                        amount: tourDetail.child_price,
                      })}`
                }}
                {{ $isNullOrEmpty(tourMaster) ? '' : tourMaster.currency_code }}
              </v-card-text>
              <v-card-text class="pt-0" style="color: #3f69b8"
                >{{ $isNullOrEmpty(tourMaster) ? '' : tourMaster.fee_amount }}
              </v-card-text>
              <v-card-text class="pt-0" style="color: #3f69b8"
                >Thanh toán trực tiếp</v-card-text
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
                >{{
                  $isNullOrEmpty(tourMaster)
                    ? ''
                    : `${$formatMoney({
                        amount: tourMaster.total_amount,
                      })}`
                }}
                {{ $isNullOrEmpty(tourMaster) ? '' : tourMaster.currency_code }}
              </v-card-text></v-col
            >
          </v-row>
        </v-col>
      </v-row>
      <div>
        <v-container>
          <v-row>
            <v-col cols="12">
              <div class="d-flex w-100 actions-coordinates-3 py-4">
                <div class="flex-grow-1"></div>
                <v-btn
                  color="error"
                  class="text-none white--text mr-3"
                  depressed
                  width="90"
                  @click="backTour"
                >
                  Hủy
                </v-btn>
                <v-btn
                  class="text-none white--text"
                  color="#47BBFF"
                  dark
                  depressed
                  width="90"
                  @click="open_update = true"
                  >Lưu</v-btn
                >
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <yes-no-alert
        :open="open_cancel"
        alert-msg="Bạn chắc chắn muốn hủy?"
        @toggle="open_cancel = !open_cancel"
        @OK="toggle"
      >
      </yes-no-alert>
      <yes-no-alert
        :open="open_update"
        alert-msg="Bạn chắc chắn muốn lưu giao dịch ?"
        @toggle="open_update = !open_update"
        @OK="save"
      >
      </yes-no-alert>
      <yes-no-alert
        :open="open_change"
        alert-msg="Bạn có muốn thay đổi trạng thái không?"
        @toggle="toggle_change_status"
        @OK="change_status_history"
      >
      </yes-no-alert>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    tour: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    changeStatus: false,
    status_description: null,
    status_description_msg: [],
    file_img: '',
    open_cancel: false,
    open_change: false,
    open_update: false,
    required_img: false,
    status: null,
    statusHistory: null,
    status_new: null,
    statusDefault: null,
    tourMaster: [],
    tourDetail: [],
    tourInfor: [],
    description: null,
    statusError: [],
    start_time: null,
    headers: [
      {
        text: 'Thời điểm',
        value: 'at',
        sortable: false,
        width: 180,
      },
      {
        text: 'Trạng thái',
        value: 'order_status_to',
        sortable: false,
        width: 200,
      },
      {
        text: 'Lý do',
        sortable: false,
        value: 'description',
      },
    ],
    items: [],
    list_status: [
      { value: 0, text: 'Chờ xác nhận', color: '#F5972D', order_status: 0 },
      {
        value: 1,
        text: 'Từ chối xác nhận',
        color: '#FF0F59',
        order_status: 1,
      },
      {
        value: 2,
        text: 'Đã xác nhận - Chưa thanh toán',
        color: '#3F69B8',
        order_status: 2,
      },
      { value: 3, text: 'Đã thanh toán', color: '#17E555', order_status: 3 },
      { value: 4, text: 'Đang giao hàng', color: '#0000FF', order_status: 4 },
      { value: 5, text: 'Đang hủy', color: '#F6CECE', order_status: 5 },
      { value: 6, text: 'Đã hủy', color: '#FF0000', order_status: 6 },
      { value: 7, text: 'Thành công', color: '#00FFFF', order_status: 7 },
      { value: 8, text: 'Đã đóng', color: '#DF013A', order_status: 8 },
    ],
  }),
  mounted() {
    this.get_list()
  },
  methods: {
    backTour() {
      this.open_cancel = true
    },
    fomartDate(value) {
      return moment(value, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss')
    },
    set_status(status) {
      this.statusHistory = status
      this.statusDefault = this.tourMaster.order_status
    },
    confirm_change_status(value) {
      if (this.statusHistory === 6 || this.statusHistory === 1) {
        if (value === this.statusDefault) {
          this.changeStatus = false
        }
      }
      this.status_new = value
      if (this.status_new !== this.statusDefault) {
        this.open_change = true
      }
    },
    toggle_change_status() {
      if (this.statusHistory !== 6 && this.statusHistory !== 1) {
        this.changeStatus = false
      }
      this.status = this.statusHistory
      this.open_change = !this.open_change
    },
    change_status_history() {
      if (this.status_new === 6 || this.status_new === 1) {
        if (this.statusDefault !== 6 && this.statusDefault !== 1) {
          this.changeStatus = true
        }
      } else if (this.status_new !== 6 && this.status_new !== 1) {
        if (this.statusDefault !== 6 && this.statusDefault !== 1) {
          this.changeStatus = false
        }
      }
      this.description = this.status_description
      this.status = this.status_new
    },
    change_status(value) {
      if (!this.$isNullOrEmpty(this.tour.order_status)) {
        const DATA = {
          items: [
            {
              transaction_id: this.tour.id,
              order_status: this.$isNullOrEmpty(this.status_new)
                ? this.status
                : this.status_new,
              note: this.status_description,
            },
          ],
        }
        if (this.statusDefault !== this.status_new) {
          this.$store
            .dispatch('giao_dich/change_status', DATA)
            .then((res) => {
              if (!res.error) {
                this.$showSuccess(
                  this,
                  'Thay đổi trạng thái giao dịch thành công'
                )
                this.$emit('exit')
              }
            })
            .finally(() => {})
        } else {
          this.$store
            .dispatch('giao_dich/change_status', DATA)
            .then((res) => {
              if (!res.error) {
                this.$showSuccess(
                  this,
                  'Thay đổi trạng thái giao dịch thành công'
                )
                this.$emit('exit')
              }
            })
            .finally(() => {})
        }
      }
    },
    get_list() {
      const data = {
        transaction_id: this.tour.id,
        transaction_type: this.tour.product_type,
      }
      this.$store.dispatch('giao_dich/detail', data).then((response) => {
        if (!response.error) {
          this.items = response.data.data.change_history
          this.start_time = moment(
            response.data.data.tour.departure_date,
            'DD/MM/YYYY hh:mm:ss'
          ).format('DD/MM/YYYY')
          this.tourMaster = response.data.data.master
          this.tourDetail = response.data.data.tour
          this.tourInfor = response.data.data.tourInfo
          this.status = response.data.data.master.order_status
          if (this.status === 0) {
            return (this.list_status = [
              {
                value: 0,
                text: 'Chờ xác nhận',
                color: '#F5972D',
                order_status: 0,
              },
              {
                value: 1,
                text: 'Từ chối xác nhận',
                color: '#FF0F59',
                order_status: 1,
              },
              {
                value: 2,
                text: 'Đã xác nhận - Chưa thanh toán',
                color: '#3F69B8',
                order_status: 2,
              },
              {
                value: 3,
                text: 'Đã thanh toán',
                color: '#17E555',
                order_status: 3,
              },
              {
                value: 8,
                text: 'Đã đóng',
                color: '#8A0829',
                order_status: 8,
              },
            ])
          } else if (this.status === 1) {
            return (this.list_status = [
              {
                value: 1,
                text: 'Từ chối xác nhận',
                color: '#FF0F59',
                order_status: 1,
              },
              { value: 8, text: 'Đã đóng', color: '#8A0829', order_status: 8 },
            ])
          } else if (this.status === 2) {
            return (this.list_status = [
              {
                value: 2,
                text: 'Đã xác nhận - Chưa thanh toán',
                color: '#3F69B8',
                order_status: 2,
              },
              {
                value: 3,
                text: 'Đã thanh toán',
                color: '#17E555',
                order_status: 3,
              },
              { value: 6, text: 'Đã hủy', color: '#FF0000', order_status: 6 },
              {
                value: 7,
                text: 'Thành công',
                color: '#00FFFF',
                order_status: 7,
              },
              {
                value: 8,
                text: 'Đã đóng',
                color: '#8A0829',
                order_status: 8,
              },
            ])
          } else if (this.status === 3) {
            return (this.list_status = [
              {
                value: 3,
                text: 'Đã thanh toán',
                color: '#17E555',
                order_status: 3,
              },
              { value: 5, text: 'Đang hủy', color: '#F6CECE', order_status: 5 },
              { value: 6, text: 'Đã hủy', color: '#FF0000', order_status: 6 },
              {
                value: 7,
                text: 'Thành công',
                color: '#00FFFF',
                order_status: 7,
              },
              {
                value: 8,
                text: 'Đã đóng',
                color: '#8A0829',
                order_status: 8,
              },
            ])
          } else if (this.status === 5) {
            return (this.list_status = [
              { value: 5, text: 'Đang hủy', color: '#F6CECE', order_status: 5 },
              { value: 6, text: 'Đã hủy', color: '#FF0000', order_status: 6 },
              {
                value: 8,
                text: 'Đã đóng',
                color: '#8A0829',
                order_status: 8,
              },
            ])
          } else if (this.status === 6) {
            return (this.list_status = [
              { value: 6, text: 'Đã hủy', color: '#FF0000', order_status: 6 },
              { value: 8, text: 'Đã đóng', color: '#8A0829', order_status: 8 },
            ])
          } else if (this.status === 7) {
            return (this.list_status = [
              {
                value: 7,
                text: 'Thành công',
                color: '#00FFFF',
                order_status: 7,
              },
              { value: 8, text: 'Đã đóng', color: '#8A0829', order_status: 8 },
            ])
          } else if (this.status === 8) {
            return (this.list_status = [
              { value: 8, text: 'Đã đóng', color: '#8A0829', order_status: 8 },
            ])
          }
        }
      })
    },
    save() {
      if (this.status === 6 || this.status === 1) {
        let hasErrors = false
        if (this.$isNullOrEmpty(this.status_description)) {
          hasErrors = true
          this.status_description_msg = 'Không được để trống'
        }
        if (!hasErrors) {
          this.change_status()
        }
      } else {
        this.change_status()
      }
    },
    toggle() {
      this.$emit('backhistory')
      this.$emit('toggle')
      this.$emit('set_title')
    },
  },
}
</script>
<style lang="scss">
.tour {
  .actions-coordinates-3 {
    position: fixed;
    z-index: 3;
    right: 30px;
    bottom: 0;
    background-color: #f5f7fe;
  }
}
</style>
