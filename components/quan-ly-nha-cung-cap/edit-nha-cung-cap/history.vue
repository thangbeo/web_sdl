<template>
  <div style="background-color: #f4f7fe" class="pt-16">
    <div v-if="open_add === 1" class="history">
      <template>
        <v-menu :close-on-content-click="false" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="text-none white--text mr-2"
              color="#47BBFF"
              depressed
              height="40"
              style="text-align: right"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-pencil-box-outline</v-icon>
              <span class="fs-14">Trường thông tin</span>
            </v-btn>
          </template>
          <v-list
            v-for="(header, i) in headerscustom"
            :key="`${i}-${header.text}`"
            class="pa-0"
            style="border-top: 1px solid #f0f0f0 !important"
            dense
            subheader
          >
            <v-list-item v-if="i !== 0 && i !== headerscustom.length - 1">
              <v-checkbox
                v-model="header.checked"
                class="ma-0"
                hide-details
                :true-value="1"
                :false-value="0"
                :ripple="false"
                @change="set_headers($event, header)"
              >
              </v-checkbox>
              <v-list-item-title class="mt-1">
                {{ header.text }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-row>
          <v-app-bar flat color="#f4f7fe">
            <v-text-field
              v-model="search"
              class="mr-3 fs-14"
              prepend-inner-icon="mdi-magnify"
              style="margin-left: -3px"
              placeholder="Tìm kiếm: ID, khách hàng, mã giao dịch"
              height="40"
              solo
              flat
              dense
              hide-details
              @keyup.enter="searchHistory"
            >
            </v-text-field>

            <div>
              <v-btn
                class="text-none white--text mr-2"
                color="#656565"
                height="40"
                depressed
                @click="open_dialog = true"
              >
                <span class="fs-14">Tìm kiếm nâng cao</span>
              </v-btn>
              <v-btn
                depressed
                class="text-none white--text mr-2"
                color="#3F69B8"
                height="40"
                style="text-align: right"
                @click="export_file"
              >
                <img src="~/assets/icon/excel.svg" width="13" height="12" />
                <span class="fs-14">Xuất Excel</span>
              </v-btn>
              <v-btn
                class="text-none white--text mr-3"
                color="#656565"
                height="40"
                depressed
                :disabled="disabled"
                @click="quest_closestatus"
              >
                <span class="fs-14">Đóng giao dịch</span>
              </v-btn>

              <v-btn
                class="text-none white--text"
                color="#47BBFF"
                depressed
                height="40"
                @click="click_add"
              >
                <v-icon class="mr-1">mdi-plus</v-icon>
                <span class="fs-14">Thêm mới</span>
              </v-btn>
            </div>
          </v-app-bar>
        </v-row>
      </template>
      <div>
        <v-data-table
          :headers="headers"
          :items="items"
          show-select
          :items-per-page="pageSize"
          hide-default-footer
          loading-text="Xin chờ..."
          no-results-text="Không có kết quả phù hợp"
          no-data-text="Không có dữ liệu"
          fixed-header
          :header-props="{ sortIcon: 'mdi-menu-swap' }"
          class="elevation-0"
          @update:options="onSortedChange($event)"
        >
          <template v-slot:[`header.data-table-select`]>
            <div class="w-100 d-flex justify-center">
              <v-checkbox
                v-model="tick_all"
                class="ma-0 pb-2"
                hide-details
                :indeterminate="indeterminate"
                :disabled="(items || []).length === 0"
                :ripple="false"
                @change="select_all"
              >
              </v-checkbox>
            </div>
          </template>

          <template v-slot:[`item.data-table-select`]="{ item }">
            <div class="w-100 d-flex justify-center">
              <v-checkbox
                v-model="item.checked"
                class="ma-0 pb-2"
                hide-details
                :true-value="1"
                :false-value="0"
                :ripple="false"
                @change="set_value($event, item)"
              >
              </v-checkbox>
            </div>
          </template>
          <template v-slot:[`item.order_id_mask`]="{ item }">
            <v-chip outlined small>{{ item.order_id_mask }}</v-chip>
          </template>

          <template v-slot:[`item.cust_name`]="{ item }">
            <div>
              <v-avatar size="24">
                <v-img :src="item.cust_avatar"> </v-img>
              </v-avatar>
              {{ item.cust_name }}
            </div>
          </template>
          <template v-slot:[`item.total_amount`]="{ item }">
            {{ `${$formatMoney({ amount: item.total_amount })}` }}
            {{ item.currency_name }}
          </template>
          <!-- eslint-disable-next-line vue/no-unused-vars -->
          <template v-slot:[`item.order_status`]="{ item }">
            <v-select
              v-model="item.order_status"
              :items="updateStatus(item.order_status)"
              flat
              style="width: 180px"
              class="pb-3 pt-3 fs-14"
              background-color="#F9F9F9"
              solo
              dense
              hide-details
              @click="set_status(item.order_status)"
              @change="confirm_change_status(item)"
            >
              <template v-slot:selection="data_status">
                <div class="fs-14" :style="`color: ${data_status.item.color}`">
                  {{ data_status.item.text }}
                </div>
              </template>
              <template v-slot:item="data_status">
                <div
                  :style="`color: ${data_status.item.color} !important`"
                  class="fs-14"
                >
                  {{ data_status.item.text }}
                </div>
              </template>
            </v-select>
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    small
                    v-bind="attrs"
                    v-on="on"
                    @click="openDetail(item)"
                  >
                    <img src="~/assets/icon/change_color_view.svg" />
                  </v-btn>
                </template>
                <span>Xem trước</span>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
        <pagination
          :page-info="pageInfo"
          :page="page"
          :page-size="pageSize"
          :page-count="pageCount"
          @changePage="changePage"
          @changePageSize="changePageSize"
        >
        </pagination>
      </div>
    </div>
    <OpenDialog
      :is-reset="true"
      :open="open_dialog"
      @reset="reset_filter"
      @filter="getlistHistory"
      @toggle="open_dialog = !open_dialog"
    >
    </OpenDialog>
    <Add
      v-if="open_add == 2"
      :open="open_add"
      @toggle="open_add = 1"
      @changeselect="$emit('nameadd')"
      @backhistory="$emit('backhistory')"
      @success="get_history"
    >
    </Add>
    <OpenDetailHotel
      v-if="open_add == 3 && checkType == 1"
      :hotel="data_row"
      @toggle="open_add = 1"
      @backhistory="$emit('backhistory')"
      @exit="get_history"
      @set_title="
        $store.commit(
          'app/setTitle',
          `Lịch sử giao dịch - ${data.producer_name}`
        )
      "
    >
    </OpenDetailHotel>
    <OpenDetailTour
      v-if="open_add == 3 && checkType == 3"
      :tour="data_row"
      @toggle="open_add = 1"
      @backhistory="$emit('backhistory')"
      @exit="get_history"
      @set_title="
        $store.commit(
          'app/setTitle',
          `Lịch sử giao dịch - ${data.producer_name}`
        )
      "
    >
    </OpenDetailTour>
    <OpenDetailRestaurant
      v-if="open_add == 3 && checkType == 2"
      :restaurant="data_row"
      @toggle="open_add = 1"
      @backhistory="$emit('backhistory')"
      @exit="get_history"
      @set_title="
        $store.commit(
          'app/setTitle',
          `Lịch sử giao dịch - ${data.producer_name}`
        )
      "
    >
    </OpenDetailRestaurant>

    <OpenDetailTourismProduct
      v-if="open_add == 3 && checkType == 4"
      :tourism="data_row"
      @toggle="open_add = 1"
      @backhistory="$emit('backhistory')"
      @exit="get_history"
      @set_title="
        $store.commit(
          'app/setTitle',
          `Lịch sử giao dịch - ${data.producer_name}`
        )
      "
    >
    </OpenDetailTourismProduct>

    <ChangeStatus
      v-if="status_new == 6 || status_new === 1"
      :open="open_change"
      @toggle="toggle_change_status"
      @OK="change_status"
    >
    </ChangeStatus>

    <yes-no-alert
      v-if="status_new !== 6 && status_new !== 1"
      :open="open_change"
      alert-msg="Bạn có muốn thay đổi trạng thái không?"
      @toggle="toggle_change_status"
      @OK="change_status"
    >
    </yes-no-alert>

    <yes-no-alert
      :open="close_status"
      alert-msg="Bạn chắc chắn muốn đóng giao dịch?"
      @toggle="close_status = !close_status"
      @OK="changes_status"
    ></yes-no-alert>

    <yes-no-alert
      :open="open_confirm_history"
      alert-msg="Bạn chắc chắn muốn thoát không?"
      @toggle="open_confirm_history = !open_confirm_history"
      @OK="backHistory"
    />
  </div>
</template>
<script>
import Add from '~/components/quan-ly-nha-cung-cap/history-nha-cung-cap/Add'
import OpenDetailHotel from '~/components/quan-ly-nha-cung-cap/history-nha-cung-cap/openDetailHotel'
import OpenDetailTour from '~/components/quan-ly-nha-cung-cap/history-nha-cung-cap/openDetailTour'
import OpenDetailRestaurant from '~/components/quan-ly-nha-cung-cap/history-nha-cung-cap/openDetailRestaurant'
import OpenDetailTourismProduct from '~/components/quan-ly-nha-cung-cap/history-nha-cung-cap/openDetailTourismProduct'
import OpenDialog from '~/components/quan-ly-nha-cung-cap/history-nha-cung-cap/OpenDialog'
import ChangeStatus from '~/components/quan-ly-nha-cung-cap/history-nha-cung-cap/ChangeStatus'
export default {
  components: {
    Add,
    OpenDetailHotel,
    OpenDialog,
    OpenDetailTour,
    OpenDetailRestaurant,
    OpenDetailTourismProduct,
    ChangeStatus,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    tab: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      checkType: 0,
      open_confirm_history: false,
      close_status: false,
      selected: null,
      page: 1,
      pageCount: 1,
      pageSize: 50,
      pageInfo: {},
      tick_all: false,
      indeterminate: false,
      data_selected: [],
      items: [],
      disabled: true,
      search: null,
      // title: 'Lịch sử giao dịch',
      open_add: 1,
      data_row: {},
      action: '',
      open_dialog: false,
      open_change: false,
      order_status: null,
      status_new: null,
      status_data: {},
      order_by: null,
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
      headerscustom: [
        { checked: 1, text: 'ID', value: 'id', width: 100 },
        {
          checked: 1,
          text: 'Khách hàng',
          sortable: false,
          value: 'cust_name',
          width: 220,
        },
        {
          checked: 1,
          text: 'Thời gian đặt',
          sortable: false,
          value: 'create_time',
          width: 200,
        },
        {
          checked: 1,
          text: 'Mã giao dịch',
          sortable: false,
          value: 'order_id_mask',
          width: 150,
        },
        {
          checked: 1,
          text: 'Thanh toán',
          sortable: false,
          value: 'total_amount',
          width: 150,
        },
        {
          checked: 1,
          text: 'Trạng thái',
          sortable: false,
          value: 'order_status',
          width: 180,
        },
        {
          checked: 1,
          text: 'Hành động',
          sortable: false,
          value: 'action',
          width: 100,
        },
      ],
      headers: [],
      order1_by: null,
      history: null,
    }
  },
  watch: {
    tab(value) {
      if (value === 5) {
        if (!this.$isServer) {
          this.open_add = 1
          this.getlistHistory()
          const arr = []
          for (let i = 0; i < this.headerscustom.length; i++) {
            if (this.headerscustom[i].checked === 1) {
              arr.push({ ...this.headerscustom[i] })
            }
          }
          this.headers = [...arr]
        }
      }
    },
    '$store.state.app.change_back'(value) {
      if (this.$store.state.app.pageTitle === 'Thêm mới giao dịch') {
        this.open_add = 1
        this.$store.commit(
          'app/setTitle',
          `Lịch sử giao dịch - ${this.data.producer_name}`
        )
      }
      if (this.$store.state.app.pageTitle.includes('Chi tiết giao dịch')) {
        this.open_confirm_history = true
      }
    },
  },
  created() {
    if (!this.$isServer) {
      // this.getlistHistory()
      const arr = []
      for (let i = 0; i < this.headerscustom.length; i++) {
        if (this.headerscustom[i].checked === 1) {
          arr.push({ ...this.headerscustom[i] })
        }
      }
      this.headers = [...arr]
    }
  },
  // mounted() {
  // },
  methods: {
    reset_filter() {
      this.searchHistory = {
        customer_name: null,
        order_id_mask: null,
        order_status: null,
        start_time: null,
        stop_time: [],
      }
    },
    get_history() {
      this.getlistHistory()
      this.$store.commit(
        'app/setTitle',
        `Lịch sử giao dịch - ${this.data.producer_name}`
      )
    },
    backHistory() {
      this.$store.commit(
        'app/setTitle',
        `Lịch sử giao dịch - ${this.data.producer_name}`
      )
      this.open_add = 1
    },
    quest_closestatus() {
      if (!this.disabled) {
        this.close_status = true
      }
    },
    changes_status() {
      const arr = []

      for (let i = 0; i < this.data_selected.length; i++) {
        arr.push({
          transaction_id: this.data_selected[i].id,
          order_status: 8,
        })
      }

      const DATA = { items: [...arr] }

      this.$store
        .dispatch('giao_dich/change_status', DATA)
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Đóng giao dịch thành công')
          }
        })
        .finally(() => {
          this.getlist()
          this.close_status = false
        })
    },
    click_add() {
      this.open_add = 2
      this.$emit('nameadd')
      this.$store.commit('app/setTitle', 'Thêm mới giao dịch')
    },
    getlistHistory(data) {
      this.history = data
      const DATA = {
        enterprise_id: this.data.id,
        search: (this.search || []).length !== 0 ? this.search.trim() : null,
        order_status: (data || []).length !== 0 ? data.order_status : null,
        order_id_mask: (data || []).length !== 0 ? data.order_id_mask : null,
        customer_name: (data || []).length !== 0 ? data.customer_name : null,
        start_time: (data || []).length !== 0 ? data.start_time : null,
        stop_time: (data || []).length !== 0 ? data.stop_time : null,
        order_by: 'a.id desc',
        page_index: this.page,
        page_size: this.pageSize,
        order1_by: this.order1_by,
      }
      this.open_add = 1
      this.$store
        .dispatch('nha_cung_cap/getlistHistory', DATA)
        .then((response) => {
          if (!response.error) {
            this.items = response.data.data.items
            for (let i = 0; i < this.items.length; i++) {
              Object.assign(this.items[i], {
                checked: 0,
              })
            }
            this.pageInfo = response.data.data.pageable
            this.pageCount = response.data.data.pageable.total_page
          }
        })
    },
    onSortedChange(value) {
      if (value.sortBy.length > 0) {
        this.order1_by =
          value.sortBy[0] + ' ' + (value.sortDesc[0] ? 'desc' : 'asc')
      } else {
        this.order1_by = null
      }
      this.getlistHistory()
    },
    set_headers(value, item) {
      let arr = [...this.headers]

      if (value === 1) {
        const array = []

        for (let i = 0; i < this.headerscustom.length; i++) {
          if (this.headerscustom[i].checked === 1) {
            array.push({ ...this.headerscustom[i] })
          }
        }
        arr = [...array]
      } else {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].value === item.value) {
            arr.splice(i, 1)
          }
        }
      }

      this.headers = [...arr]
    },
    updateStatus(value) {
      if (!this.$isNullOrEmpty(value)) {
        if (value === 0) {
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
            { value: 8, text: 'Đã đóng', color: '#8A0829', order_status: 8 },
          ])
        } else if (value === 1) {
          return (this.list_status = [
            {
              value: 1,
              text: 'Từ chối xác nhận',
              color: '#FF0F59',
              order_status: 1,
            },
            { value: 8, text: 'Đã đóng', color: '#8A0829', order_status: 8 },
          ])
        } else if (value === 2) {
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
            { value: 7, text: 'Thành công', color: '#00FFFF', order_status: 7 },
            { value: 8, text: 'Đã đóng', color: '#8A0829', order_status: 8 },
          ])
        } else if (value === 3) {
          return (this.list_status = [
            {
              value: 3,
              text: 'Đã thanh toán',
              color: '#17E555',
              order_status: 3,
            },
            { value: 5, text: 'Đang hủy', color: '#F6CECE', order_status: 5 },
            { value: 6, text: 'Đã hủy', color: '#FF0000', order_status: 6 },
            { value: 7, text: 'Thành công', color: '#00FFFF', order_status: 7 },
            { value: 8, text: 'Đã đóng', color: '#8A0829', order_status: 8 },
          ])
        } else if (value === 5) {
          return (this.list_status = [
            { value: 5, text: 'Đang hủy', color: '#F6CECE', order_status: 5 },
            { value: 6, text: 'Đã hủy', color: '#FF0000', order_status: 6 },
            { value: 8, text: 'Đã đóng', color: '#8A0829', order_status: 8 },
          ])
        } else if (value === 6) {
          return (this.list_status = [
            { value: 6, text: 'Đã hủy', color: '#FF0000', order_status: 6 },
            { value: 8, text: 'Đã đóng', color: '#8A0829', order_status: 8 },
          ])
        } else if (value === 7) {
          return (this.list_status = [
            { value: 7, text: 'Thành công', color: '#00FFFF', order_status: 7 },
            { value: 8, text: 'Đã đóng', color: '#8A0829', order_status: 8 },
          ])
        } else if (value === 8) {
          return (this.list_status = [
            { value: 8, text: 'Đã đóng', color: '#8A0829', order_status: 8 },
          ])
        }
      }
    },
    set_status(orderStatus) {
      this.order_status = orderStatus
    },
    confirm_change_status(item) {
      this.status_data = item
      this.status_new = item.order_status
      this.open_change = true
    },
    toggle_change_status() {
      this.open_change = !this.open_change
      const arr = [...this.items]
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === this.status_data.id) {
          arr[i].order_status = this.order_status
        }
      }
      this.items = [...arr]
    },
    change_status(description) {
      if (!this.$isNullOrEmpty(this.status_data)) {
        const DATA = {
          items: [
            {
              transaction_id: this.status_data.id,
              order_status: this.status_new,
              note: description,
            },
          ],
        }

        this.$store
          .dispatch('giao_dich/change_status', DATA)
          .then((res) => {
            if (!res.error) {
              this.$showSuccess(
                this,
                'Thay đổi trạng thái giao dịch thành công'
              )
              const arr = [...this.items]
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].id === this.status_data.id) {
                  arr[i].order_status = this.status_new
                }
              }
              this.items = [...arr]
            }
          })
          .finally(() => {})
      }
      this.updateStatus()
    },
    select_all(value) {
      if (value) {
        this.set_selected_all(1)
        this.disabled = false

        const arr = [...this.items]

        for (let i = 0; i < arr.length; i++) {
          if (this.data_selected.length > 0) {
            const arr1 = [...this.data_selected]
            for (let j = 0; j < this.data_selected.length; j++) {
              if (arr[i].id === this.data_selected[j].id) {
                arr1.splice(j, 1)
              }
            }
            this.data_selected = [...arr1]
          }
        }

        const arr2 = []

        for (let i = 0; i < arr.length; i++) {
          arr2.push(arr[i])
        }
        this.data_selected = [...arr2, ...this.data_selected]
      } else {
        this.set_selected_all(0)
        this.disabled = true
      }
    },
    set_value(value, item) {
      item.checked = value
      const arrselected = [...this.data_selected]

      if (value === 1) {
        arrselected.push(item)
      } else {
        for (let i = 0; i < arrselected.length; i++) {
          if (item.id === arrselected[i].id) {
            arrselected.splice(i, 1)
          }
        }
      }
      this.data_selected = [...arrselected]

      const arr = []

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].checked === 1) {
          arr.push(this.items[i].checked)
        }
      }

      if (arr.length > 0 && arr.length < this.items.length) {
        this.disabled = false
      } else if (arr.length === this.items.length) {
        this.tick_all = true
        this.disabled = false
      } else if (arr.length === 0) {
        this.tick_all = false
        this.disabled = true
      }
    },
    set_selected_all(checked) {
      const arr = [...this.items]

      for (let i = 0; i < arr.length; i++) {
        arr[i] = {
          ...arr[i],
          checked,
        }

        if (checked === 0 && this.data_selected.length > 0) {
          const arr1 = [...this.data_selected]
          for (let j = 0; j < this.data_selected.length; j++) {
            if (arr[i].id === this.data_selected[j].id) {
              arr1.splice(j, 1)
            }
          }
          this.data_selected = [...arr1]
        }
      }
      this.items = [...arr]
    },
    export_file() {
      this.loading = true
      let DATA = {}
      if (!this.$isNullOrEmpty(this.history)) {
        DATA = {
          customerName: this.history.customer_name,
          orderIdMask: this.history.order_id_mask,
          startTime: this.history.start_time,
          endTime: this.history.stop_time,
          orderStatus: this.history.order_status,
        }
      }
      this.$store
        .dispatch('giao_dich/export_excel', {
          enterpriseId: this.$store.state.nha_cung_cap.enterprise,
          customerId: null,
          search: this.search,
          ...DATA,
        })
        .then((response) => {
          if (!response.error) {
            window.location.href = response.data.data
          }
        })
        .finally(() => {})
      this.loading = false
    },
    openDetail(item) {
      this.data_row = item
      this.open_add = 3
      this.checkType = item.product_type
      this.$store.commit(
        'app/setTitle',
        `Chi tiết giao dịch - #${item.order_id_mask}`
      )
    },
    add() {
      this.open_add = 2
      // this.$emit('addHistory')
      this.$store.commit('app/setTitle', 'Thêm mới giao dịch')
    },
    searchHistory() {
      this.page = 1
      this.getlistHistory()
    },
    changePage(value) {
      this.page = value
      this.getlistHistory()
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
        this.getlistHistory()
      }
    },
  },
  // head() {
  //   this.$store.commit('app/setTitle', this.title)
  //   return {
  //     title: this.title,
  //   }
  // },
}
</script>
<style lang="scss">
.history {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(100vh - 315px);
  }
}
</style>
