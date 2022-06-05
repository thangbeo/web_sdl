<template>
  <div v-if="checkRole()" style="background-color: #f4f7fe">
    <div v-if="open_add === 1" class="transition">
      <template>
        <v-row>
          <v-col cols="12" class="py-0">
            <v-menu :close-on-content-click="false" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="text-none white--text mr-3"
                  color="#47BBFF"
                  depressed
                  height="40"
                  style="text-align: right"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon small class="mr-1">mdi-pencil-box-outline</v-icon>
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
          </v-col>
          <v-col class="px-0">
            <v-app-bar elevation="0" style="background-color: #f4f7fe">
              <v-text-field
                v-model="search"
                class="mr-3 border-1 fs-14"
                prepend-inner-icon="mdi-magnify"
                placeholder="Tìm kiếm khách hàng, mã giao dịch"
                solo
                flat
                dense
                hide-details
                height="40"
                style="min-width: 444px"
                @keyup.enter="getlist"
              >
              </v-text-field>

              <v-btn
                class="text-none white--text mr-3"
                color="#656565"
                height="40"
                depressed
                @click="open_dialog = true"
              >
                <span class="fs-14">Tìm kiếm nâng cao</span>
              </v-btn>
              <v-btn
                :disabled="loading"
                :loading="loading"
                depressed
                class="text-none white--text mr-3"
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
                class="text-none white--text mr-3"
                color="#47BBFF"
                depressed
                style="text-align: right"
                height="40"
                @click="open_add = 2"
              >
                <v-icon small class="mr-1">mdi-plus</v-icon>
                <span class="fs-14">Thêm mới</span>
              </v-btn>
            </v-app-bar>
          </v-col>
        </v-row>
      </template>
      <div>
        <v-data-table
          :headers="headers"
          :items="items"
          show-select
          :items-per-page="pageSize"
          :header-props="{ sortIcon: 'mdi-menu-swap' }"
          hide-default-footer
          loading-text="Xin chờ..."
          no-results-text="Không có kết quả phù hợp"
          no-data-text="Không có dữ liệu"
          fixed-header
          :sort-desc="true"
          class="elevation-1"
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
              item-color="white"
              class="border-2 fs-14"
              style="width: 180px"
              solo
              flat
              dense
              hide-details
              @click="set_status(item.order_status)"
              @change="confirm_change_status(item)"
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
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="ml-2 pt-1"
                    icon
                    v-bind="attrs"
                    :to="`/danh-sach-giao-dich/${item.product_type}/${item.id}`"
                    v-on="on"
                  >
                    <img
                      class="mr-1"
                      src="~/assets/icon/change_color_view.svg"
                    />
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
      :open="open_dialog"
      @filter="getlist"
      @toggle="open_dialog = !open_dialog"
    >
    </OpenDialog>
    <Add
      v-if="open_add == 2"
      :open="open_add == 2"
      @toggle="open_add = 1"
      @exit="getlist"
    >
    </Add>
    <OpenDetailHotel
      v-if="open_add == 3"
      @toggle="open_add = 1"
      @exit="getlist"
    >
    </OpenDetailHotel>
    <OpenDetailTour v-if="open_add == 3" @toggle="open_add = 1" @exit="getlist">
    </OpenDetailTour>
    <OpenDetailRestaurant
      v-if="open_add == 3"
      @toggle="open_add = 1"
      @exit="getlist"
    >
    </OpenDetailRestaurant>
    <ChangeStatus
      v-if="status_new == 6 || status_new === 1"
      :open="open_change"
      @toggle="toggle_change_status"
      @OK="change_status"
    >
    </ChangeStatus>
    <yes-no-alert
      :open="close_status"
      alert-msg="Bạn chắc chắn muốn đóng giao dịch?"
      @toggle="close_status = !close_status"
      @OK="changes_status"
    ></yes-no-alert>

    <yes-no-alert
      v-if="status_new !== 6 && status_new !== 1"
      :open="open_change"
      alert-msg="Bạn có muốn thay đổi trạng thái không?"
      @toggle="toggle_change_status"
      @OK="change_status"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_confirm"
      alert-msg="Bạn chắc chắn muốn thoát không?"
      @toggle="open_confirm = !open_confirm"
      @OK="open_add = 1"
    />
  </div>
</template>
<script>
import Add from '~/components/quan-ly-giao-dich/Add'
import OpenDetailHotel from '~/components/quan-ly-giao-dich/openDetailHotel'
import OpenDetailTour from '~/components/quan-ly-giao-dich/openDetailTour'
import OpenDetailRestaurant from '~/components/quan-ly-giao-dich/openDetailRestaurant'
import OpenDialog from '~/components/quan-ly-giao-dich/OpenDialog'
import Rules from '~/assets/configurations/Rules'
import ChangeStatus from '~/components/quan-ly-giao-dich/ChangeStatus'
export default {
  components: {
    Add,
    OpenDetailHotel,
    OpenDialog,
    OpenDetailTour,
    OpenDetailRestaurant,
    ChangeStatus,
  },
  data() {
    return {
      Rules,
      loading: false,
      checkType: 0,
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
      title: 'Danh sách giao dịch',
      open_add: 1,
      data_row: {},
      action: '',
      open_dialog: false,
      open_change: false,
      close_status: false,
      status_data: {},
      order_status: null,
      status_new: null,
      headers: [],
      order_by: null,
      open_confirm: false,
      dataSearch: null,
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
        { checked: 1, text: 'ID', value: 'id', width: 70 },
        {
          checked: 1,
          text: 'Khách hàng',
          sortable: false,
          value: 'cust_name',
          width: 210,
        },
        {
          checked: 1,
          text: 'Thời gian đặt',
          sortable: false,
          value: 'create_time',
          width: 180,
        },
        {
          checked: 1,
          text: 'Mã giao dịch',
          value: 'order_id_mask',
          width: 140,
        },
        {
          checked: 1,
          text: 'Thanh toán',
          sortable: false,
          value: 'total_amount',
          width: 140,
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
    }
  },
  watch: {
    open_add(value) {
      if (value === 1) {
        this.title = 'Danh sách giao dịch'
        this.$store.commit('app/checkBack', false)
      } else if (value === 2) {
        this.title = 'Thêm giao dịch'
        this.$store.commit('app/setTitle', this.title)
        this.$store.commit('app/checkBack', true)
      } else if (value === 3) {
        this.title = `Chi tiết giao dịch - #${this.data_row.order_id_mask}`
        this.$store.commit('app/setTitle', this.title)
        this.$store.commit('app/checkBack', true)
      }
    },
    '$store.state.app.change_back'(value) {
      if (this.$store.state.app.pageTitle === 'Thêm giao dịch') {
        this.open_add = 1
      } else {
        this.open_confirm = true
      }
    },
  },
  mounted() {
    this.$store.commit('app/checkBack', false)
    const arr = []
    for (let i = 0; i < this.headerscustom.length; i++) {
      if (this.headerscustom[i].checked === 1) {
        arr.push({ ...this.headerscustom[i] })
      }
    }
    this.headers = [...arr]
  },
  methods: {
    quest_closestatus() {
      if (!this.disabled) {
        this.close_status = true
      }
    },
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.TransactionList.id
      )
      return roles
    },
    getlist(data) {
      this.dataSearch = data
      this.open_add = 1
      const DATA = {
        search: (this.search || []).length !== 0 ? this.search.trim() : null,
        start_time: (data || []).length !== 0 ? data.start_time : null,
        stop_time: (data || []).length !== 0 ? data.stop_time : null,
        order_status: (data || []).length !== 0 ? data.order_status : null,
        order_id_mask: (data || []).length !== 0 ? data.order_id_mask : null,
        customer_name: (data || []).length !== 0 ? data.customer_name : null,
        order_by: this.order_by,
        page_index: this.page,
        page_size: this.pageSize,
      }
      this.$store.dispatch('giao_dich/getlist', DATA).then((response) => {
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
        this.order_by =
          value.sortBy[0] + ' ' + (value.sortDesc[0] ? 'desc' : 'asc')
      } else {
        this.order_by = null
      }
      this.getlist()
    },
    export_file() {
      this.loading = true
      const data = {
        customerId: null,
        search: (this.search || []).length !== 0 ? this.search.trim() : null,
        customerName:
          (this.dataSearch || []).length !== 0
            ? this.dataSearch.customer_name
            : null,
        orderIdMask:
          (this.dataSearch || []).length !== 0
            ? this.dataSearch.order_id_mask
            : null,
        startTime:
          (this.dataSearch || []).length !== 0
            ? this.dataSearch.start_time
            : null,
        endTime:
          (this.dataSearch || []).length !== 0
            ? this.dataSearch.stop_time
            : null,
        orderStatus:
          (this.dataSearch || []).length !== 0
            ? this.dataSearch.order_status
            : null,
      }
      this.$store
        .dispatch('giao_dich/export_excel', data)
        .then((response) => {
          if (!response.error) {
            window.location.href = response.data.data
          }
        })
        .finally(() => {
          this.loading = false
        })
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
      this.open_change = false

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
    select_all(value) {
      // this.$log.debug(this.items)
      if (value) {
        this.set_selected_all(1)
        this.data_selected = this.items
        this.disabled = false
      } else {
        this.set_selected_all(0)
        this.data_selected = []
        this.disabled = true
      }
    },
    set_value(value, item) {
      // this.$log.debug(value, item)
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
        this.indeterminate = true
        this.disabled = false
      } else if (arr.length === this.items.length) {
        this.indeterminate = false
        this.tick_all = true
        this.disabled = false
      } else if (arr.length === 0) {
        this.tick_all = false
        this.indeterminate = false
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
      }
      this.items = [...arr]
    },
    changePage(value) {
      this.page = value
      this.getlist()
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
        this.getlist()
      }
    },
  },
  head() {
    this.$store.commit('app/setTitle', this.title)
    return {
      title: this.title,
    }
  },
}
</script>
<style lang="scss">
.transition {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(100vh - 280px) !important;
  }
}
</style>
