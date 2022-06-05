<template>
  <div class="mian_comment_customer" style="background-color: #f4f7fe">
    <div v-show="open_add == 1">
      <template>
        <v-row>
          <v-col cols="12">
            <div class="d-flex align-center">
              <div class="fs-14 font-weight-bold mr-10">
                Tự động phê duyệt Đánh giá và Nhận xét
              </div>
              <v-switch
                v-model="hidden"
                color="#47bbff"
                class="ma-0"
                :true-value="1"
                :false-value="0"
                inset
                hide-details
                @change="change_status_auto"
              ></v-switch>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-app-bar elevation="0" style="background-color: #f4f7fe">
            <v-text-field
              v-model="search"
              class="mr-3 border-1 fs-14"
              prepend-inner-icon="mdi-magnify"
              placeholder="Tìm kiếm đánh giá"
              solo
              flat
              dense
              hide-details
              height="40"
              style="min-width: 444px"
              @keyup.enter="search_list_comment_customer"
            >
            </v-text-field>
            <!-- <v-btn
              depressed
              class="text-none white--text mr-2"
              :disabled="disabled"
              color="#47BBFF"
              height="40"
              @click="update_status = true"
              >Cập nhật trạng thái</v-btn
            > -->
          </v-app-bar>
        </v-row>
      </template>
      <div>
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          show-select
          :items-per-page="pageSize"
          :page.sync="page"
          hide-default-footer
          loading-text="Xin chờ..."
          no-results-text="Không có kết quả phù hợp"
          no-data-text="Không có dữ liệu"
          fixed-header
          multi-sort
          :sort-desc="true"
          class="elevation-1"
        >
          <template #top>
            <div class="d-flex pt-3 customer">
              <v-btn
                style="background-color: white !important"
                class="mr-1 ml-1 text-none px-3"
                width="90px"
                depressed
                :disabled="disabled"
                @click="quest_deletes"
              >
                <icon-close
                  class="mt-1 mr-1"
                  height="14"
                  width="14"
                  :disabled="disabled"
                ></icon-close>
                <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                  Xóa
                </div></v-btn
              >
              <v-divider style="max-height: 20px" inset vertical></v-divider>

              <v-btn
                class="fs-14 text-none"
                color="white"
                depressed
                :disabled="disabled"
                @click="update_status = true"
              >
                <icon-edit
                  :disabled="disabled"
                  class="mr-2"
                  height="15"
                  width="15"
                />
                <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                  Cập nhật trạng thái
                </div>
              </v-btn>
              <v-divider style="max-height: 20px" inset vertical />
              <v-btn
                style="background-color: white !important"
                class="mr-1 text-none"
                depressed
                :disabled="disabled"
                @click="reset_form"
                ><icon-excap
                  :disabled="disabled"
                  class="mt-1 mr-1"
                  height="14"
                  width="14"
                ></icon-excap>
                <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                  Quay lại
                </div></v-btn
              >
            </div>
          </template>
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
          <template v-slot:[`item.url`]="{ item }">
            <div>
              <a
                :href="item.url"
                target="_blank"
                class="d-inline-block text-truncate"
                style="max-width: 140px"
                >{{ item.url }}</a
              >
            </div>
          </template>

          <template v-slot:[`item.rate`]="{ item }">
            <v-rating
              v-model="item.rate"
              background-color="orange"
              color="orange"
              dense
              readonly
            ></v-rating>
          </template>

          <template v-slot:[`item.status`]="{ item }">
            <v-select
              v-model="item.status"
              :items="list_status"
              flat
              item-color="white"
              class="border-1 fs-14"
              solo
              dense
              hide-details
              @change="confirm_change_status(item)"
            >
              <template v-slot:selection="data1">
                <div :style="`color: ${data1.item.color}`">
                  {{ data1.item.text }}
                </div>
              </template>
              <template v-slot:item="data1">
                <div
                  :style="`color: ${data1.item.color} !important`"
                  class="fs-13"
                >
                  {{ data1.item.text }}
                </div>
              </template>
            </v-select>
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <div class="d-flex">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    class="pt-1"
                    v-bind="attrs"
                    v-on="on"
                    @click="quest_delete(item)"
                  >
                    <icon-delete></icon-delete>
                  </v-btn>
                </template>
                <span>Xóa</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    class="pt-1"
                    v-bind="attrs"
                    v-on="on"
                    @click="editItem(item)"
                  >
                    <icon-edit></icon-edit>
                  </v-btn>
                </template>
                <span>Cập nhật</span>
              </v-tooltip>

              <!-- <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div
                    class="ml-4"
                    v-bind="attrs"
                    v-on="on"
                    @click="viewItem(item)"
                  >
                    <img
                      class="mr-1 pt-1"
                      src="~/assets/icon/change_color_view.svg"
                    />
                  </div>
                </template>
                <span>Xem trước</span>
              </v-tooltip> -->
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
        ></pagination>
      </div>
    </div>
    <yes-no-alert
      :open="open_delete"
      :alert-msg="alertdelete"
      @toggle="open_delete = !open_delete"
      @OK="confirm_delete"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_deletes"
      :alert-msg="alertdelete"
      @toggle="open_deletes = !open_deletes"
      @OK="confirm_deletes"
    >
    </yes-no-alert>
    <updateStatus
      :open="update_status"
      @toggle="update_status = !update_status"
      @OK="changes_status"
    ></updateStatus>
    <edit
      v-show="open_add == 4"
      :data="data_row"
      :open="open_add"
      @exit="list_comment_customer"
      @toggle="open_add = 1"
      @backreview="$emit('backreview')"
    >
    </edit>

    <!-- <Detail
      v-show="open_add == 3"
      :data="data_row"
      :open="open_add"
      @toggle="open_add = 1"
    >
    </Detail> -->
    <yes-no-alert
      :open="open_change"
      alert-msg="Bạn có muốn thay đổi trạng thái không?"
      @toggle="toggle_change_status"
      @OK="change_status"
    >
    </yes-no-alert>
  </div>
</template>
<script>
import Edit from '~/components/khach-hang/danh-gia-khach-hang/Edit'
// import Detail from '~/components/khach-hang/danh-gia-khach-hang/Detail'
import updateStatus from '~/components/khach-hang/danh-gia-khach-hang/updateStatus'
export default {
  components: {
    Edit,
    updateStatus,
    // Detail,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      selected: null,
      hidden: 1,
      page: 1,
      pageCount: 1,
      pageSize: 50,
      itemPerPage: 0,
      totalItem: 0,
      tick_all: false,
      indeterminate: false,
      open_change: false,
      data_selected: [],
      items: [],
      disabled: true,
      search: '',
      pageInfo: {},
      open_add: 1,
      data_row: {},
      status_data: {},
      rating: '',
      action: '',
      open_delete: false,
      open_deletes: false,
      update_status: false,
      alertdelete: '',
      list_status: [
        { value: 3, text: 'Chưa duyệt', color: '#F5972D' },
        { value: 1, text: 'Đã duyệt', color: '#17E555' },
        { value: 2, text: 'Từ chối với phần bình luận', color: '#FF0F59' },
      ],
      headerscustom: [
        { checked: 1, text: 'ID', sortable: false, value: 'id', width: 50 },
        {
          checked: 1,
          text: 'Thời gian',
          sortable: false,
          value: 'at',
          width: 140,
        },
        {
          checked: 1,
          text: 'Người dùng',
          sortable: false,
          value: 'cust_name',
          width: 180,
        },
        {
          checked: 1,
          text: 'Link đánh giá',
          sortable: false,
          value: 'url',
          width: 150,
        },
        {
          checked: 1,
          text: 'Đánh giá',
          sortable: false,
          value: 'rate',
          width: 140,
        },
        {
          checked: 1,
          text: 'Trạng thái',
          sortable: false,
          value: 'status',
          width: 140,
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
    }
  },
  watch: {
    // tab(value) {
    //   if (value === 12) {
    //     this.list_comment_customer()
    //     this.title = 'Đánh giá'
    //     this.get_status_auto()
    //   }
    // },
    // open_add(value) {
    //   if (value === 1) {
    //     this.title = 'Đánh giá'
    //   } else if (value === 4) {
    //     this.title = 'Cập nhật đánh giá'
    //   }
    // },
    '$store.state.app.change_back'() {
      if (this.$store.state.app.pageTitle.includes('Cập nhật đánh giá')) {
        this.open_add = 1
        this.$emit('set_title', 3)
      }
    },
  },
  created() {
    const arr = []
    for (let i = 0; i < this.headerscustom.length; i++) {
      if (this.headerscustom[i].checked === 1) {
        arr.push({ ...this.headerscustom[i] })
      }
    }
    this.headers = [...arr]
  },
  methods: {
    get_data() {
      this.list_comment_customer()
      this.get_status_auto()
    },
    closeDanhGia() {
      if (this.$store.state.app.pageTitle === 'Thêm mới khách hàng') {
        this.open_add = 1
      }
      if (this.$store.state.app.pageTitle === 'Cập nhật đánh giá') {
        this.$store.commit(
          'app/setTitle',
          `Lịch sử giao dịch - ${this.$store.state.khach_hang.customerId.name}`
        )
        this.open_add = 1
      }
    },
    change_status() {
      if ((this.status_data.status || []).length !== 0) {
        const DATA = {
          updateStatusCommentRequestList: [
            {
              id: this.status_data.id,
              type: this.status_data.comment_type,
              status: this.status_data.status,
            },
          ],
        }

        this.$store
          .dispatch('danh_gia/change_status', DATA)
          .then((res) => {
            if (!res.error) {
              this.$showSuccess(this, 'Thay đổi trạng thái Đánh giá thành công')
            }
          })
          .finally(() => {
            this.list_comment_customer()
          })
      }
    },
    toggle_change_status() {
      this.open_change = !this.open_change
      this.list_comment_customer()
    },
    confirm_change_status(item) {
      this.status_data = item
      this.open_change = true
    },
    change_status_auto() {
      this.$store
        .dispatch('danh_gia/change_auto_browse_product', {
          status: this.hidden,
        })
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(
              this,
              'Thay đổi trạng thái tự động duyệt Đánh giá thành công'
            )
          }
        })
        .finally(() => {
          this.get_status_auto()
        })
    },
    changes_status(value) {
      const arr = []

      for (let i = 0; i < this.data_selected.length; i++) {
        arr.push({
          id: this.data_selected[i].id,
          type: this.data_selected[i].comment_type,
          status: value,
        })
      }

      const DATA = { updateStatusCommentRequestList: [...arr] }

      this.$store
        .dispatch('danh_gia/change_status', DATA)
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Thay đổi trạng thái Đánh giá thành công')
          }
        })
        .finally(() => {
          this.list_comment_customer()
          this.update_status = false
        })
    },
    get_status_auto() {
      this.$store.dispatch('danh_gia/auto_browse_product').then((res) => {
        if (!res.error) {
          this.hidden = res.data.data[0].comment_status
        }
      })
    },
    search_list_comment_customer() {
      this.page = 1
      this.list_comment_customer()
    },
    list_comment_customer() {
      this.$store
        .dispatch('khach_hang/list_comment_customer', {
          customer_id: this.id,
          page_index: this.page,
          page_size: this.pageSize,
          search: (this.search || []).length !== 0 ? this.search.trim() : '',
        })
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
    reset_form() {
      this.tick_all = false
      this.indeterminate = false
      this.disabled = true
      const arr = [...this.items]

      for (let i = 0; i < arr.length; i++) {
        arr[i].checked = 0
      }
      this.items = [...arr]
    },
    clearSelected() {
      this.selected = null
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
    quest_delete(value) {
      this.data_row = value
      this.alertdelete = `Bạn chắc chắn muốn xóa đsnh giá ${value.cust_name} này?`
      this.open_delete = true
    },
    quest_deletes() {
      if (!this.disabled) {
        if (this.data_selected.length === 1) {
          this.alertdelete =
            'Bạn chắc chắn muốn xóa khách hàng "' +
            this.data_selected[0].cust_name +
            '" này?'
        } else if (this.data_selected.length > 1) {
          this.alertdelete = 'Bạn chắc chắn muốn xóa những khách hàng này?'
        }
        this.open_deletes = true
      }
    },

    confirm_delete() {
      const arr = []
      arr.push({
        id: this.data_row.id,
        type: this.data_row.comment_type,
      })
      this.$store
        .dispatch('danh_gia/delete', {
          deleteCommentRequests: arr,
        })
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Xóa dữ liệu thành công')
            this.list_comment_customer()
          }
        })
    },
    confirm_deletes() {
      const DATA = []

      for (let i = 0; i < this.data_selected.length; i++) {
        DATA.push({
          id: this.data_selected[i].id,
          type: this.data_selected[i].comment_type,
        })
      }

      this.$store
        .dispatch('danh_gia/delete', {
          deleteCommentRequests: DATA,
        })
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Xóa dữ liệu thành công')
            this.list_comment_customer()
          }
        })
    },
    deleteItem(item) {
      // this.$log.debug(item)
      this.data_row = item
      this.alertdelete = `Bạn chắc chắn muốn xóa đánh giá của ${this.data_row.cust_name}  này?`
      this.open_delete = true
    },
    editItem(item) {
      this.data_row = item
      this.open_add = 4
      this.$store.commit('app/setTitle', `Cập nhật đánh giá`)
    },
    // viewItem(item) {
    //   this.data_row = item
    //   this.open_add = 3
    // },
    changePage(value) {
      this.page = value
      this.list_comment_customer()
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
        this.list_comment_customer()
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
.mian_comment_customer {
  .theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
    background-color: white !important;
    color: black !important;
  }
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(80vh - 220px) !important;
  }
}
</style>
