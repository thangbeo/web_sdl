<template>
  <div style="background-color: #f4f7fe" class="pt-14">
    <div v-if="open_add == 1" class="review">
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
          <template #top>
            <v-row>
              <v-col cols="12" style="background-color: #f4f7fe">
                <div class="d-flex align-center">
                  <div class="fs-14 font-weight-bold mr-10">
                    Tự động phê duyệt Đánh giá và Nhận xét
                  </div>
                  <v-switch
                    v-model="auto"
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
                  v-model="search1"
                  class="mr-3 fs-14"
                  prepend-inner-icon="mdi-magnify"
                  placeholder="Tìm kiếm: ID, Người dùng, Link đánh giá"
                  style="margin-left: -5px"
                  solo
                  flat
                  dense
                  hide-details
                  height="40"
                  @keyup.enter="search_reivew"
                >
                </v-text-field>
                <v-btn
                  depressed
                  class="text-none white--text mr-2"
                  :disabled="disabled"
                  color="#656565"
                  height="40"
                  @click="reset_form"
                >
                  Quay lại
                </v-btn>
                <v-btn
                  depressed
                  class="text-none white--text mr-2"
                  :disabled="disabled"
                  color="#47BBFF"
                  height="40"
                  @click="quest_updatestatus"
                  >Cập nhật trạng thái</v-btn
                >
                <v-btn
                  depressed
                  class="text-none white--text mr-3"
                  color="error"
                  :disabled="disabled"
                  height="40"
                  width="90"
                  style="margin-right: -3px"
                  @click="quest_deletes"
                >
                  Xóa
                </v-btn>
                <v-btn
                  class="text-none white--text"
                  height="40px"
                  depressed
                  color="#656565"
                  @click="open_search = true"
                >
                  Tìm kiếm nâng cao</v-btn
                >
              </v-app-bar>
            </v-row>
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
                @change="selectall"
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
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on">
                  <a
                    :href="item.url"
                    target="_blank"
                    class="d-inline-block text-truncate"
                    style="max-width: 140px"
                    >{{ item.url }}</a
                  >
                </div>
              </template>
              <span>{{ item.url }}</span>
            </v-tooltip>
          </template>

          <template v-slot:[`item.rate`]="{ item }">
            <v-rating
              v-model="item.rate"
              background-color="orange"
              color="orange"
              half-increments
              dense
              readonly
            ></v-rating>
          </template>

          <template v-slot:[`item.status`]="{ item }">
            <v-select
              v-model="item.status"
              :items="list_status"
              background-color="#F9F9F9"
              flat
              solo
              dense
              hide-details
              style="width: 160px"
              class="pb-3 pt-3"
              @click="set_status(item.status)"
              @change="confirm_change_status(item)"
            >
              <template v-slot:selection="data_status">
                <div :style="`color: ${data_status.item.color}`">
                  {{ data_status.item.text }}
                </div>
              </template>
              <template v-slot:item="data_status">
                <div
                  :style="`color: ${data_status.item.color} !important`"
                  class="fs-13"
                >
                  {{ data_status.item.text }}
                </div>
              </template>
            </v-select>
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <div class="d-flex">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="pt-1"
                    icon
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
                  <v-btn icon v-bind="attrs" v-on="on" @click="editItem(item)">
                    <icon-edit></icon-edit>
                  </v-btn>
                </template>
                <span>Cập nhật</span>
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
    <yes-no-alert
      :alert-msg="alertdelete"
      :open="open_delete"
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
    <yes-no-alert
      :open="open_change"
      alert-msg="Bạn có muốn thay đổi trạng thái không?"
      @toggle="toggle_change_status"
      @OK="change_status"
    >
    </yes-no-alert>
    <edit
      v-if="open_add == 2"
      :open="open_add"
      :data="data_row"
      @toggle="open_add = 1"
      @exit="get_review"
      @backreview="$emit('backreview')"
      @set_title="
        $store.commit('app/setTitle', `Đánh giá - ${data.producer_name}`)
      "
    >
    </edit>
    <yes-no-alert
      :open="open_confirm_review"
      alert-msg="Bạn chắc chắn muốn thoát không?"
      @toggle="open_confirm_review = !open_confirm_review"
      @OK="backReview"
    />
    <Dialog
      :open="open_search"
      dialog-name="Tìm kiếm nâng cao"
      max_width="600"
      :is-reset="true"
      @reset="reset_data"
      @toggle="open_search = !open_search"
      @actionsUser="search_reivew"
    >
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="search.user"
            placeholder="Người dùng"
            class="border-1 fs-14"
            solo
            flat
            dense
            hide-details
            clearable
          >
          </v-text-field>
        </v-col>

        <v-col cols="6">
          <v-select
            v-model="search.status"
            :items="list_status"
            placeholder="Chọn trạng thái"
            item-color="white"
            class="border-1 fs-14"
            solo
            flat
            dense
            hide-details
            clearable
          >
            <template v-slot:selection="data_item">
              <div class="fs-14" :style="`color: ${data_item.item.color}`">
                {{ data_item.item.text }}
              </div>
            </template>
            <template v-slot:item="data_item">
              <div
                :style="`color: ${data_item.item.color} !important`"
                class="fs-14"
              >
                {{ data_item.item.text }}
              </div>
            </template>
          </v-select>
        </v-col>

        <v-col cols="6">
          <v-autocomplete
            v-model="search.categoryProduct"
            :items="list_category"
            placeholder="Loại sản phẩm"
            class="border-1 fs-14"
            solo
            flat
            dense
            multiple
            hide-details
            clearable
          >
          </v-autocomplete>
        </v-col>
      </v-row>
    </Dialog>
  </div>
</template>
<script>
import Dialog from '~/components/Dialog'
import edit from '~/components/quan-ly-nha-cung-cap/review-nha-cung-cap/edit'
import updateStatus from '~/components/quan-ly-nha-cung-cap/review-nha-cung-cap/updateStatus'
export default {
  components: { edit, updateStatus, Dialog },
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
      search: {
        status: null,
        user: null,
        categoryProduct: [],
      },
      list_category: [
        { value: 1, text: 'Khách sạn' },
        { value: 2, text: 'Nhà hàng' },
        { value: 3, text: 'Tour' },
        { value: 4, text: 'Sản phẩm du lịch' },
      ],
      open_search: false,
      open_confirm_review: false,
      selected: null,
      auto: 0,
      page: 1,
      pageCount: 1,
      pageSize: 50,
      pageInfo: {},
      tick_all: false,
      indeterminate: false,
      data_selected: [],
      items: [],
      disabled: true,
      search1: null,
      open_add: 1,
      data_row: null,
      dataDetail: null,
      dataDetails: null,
      open_delete: false,
      open_deletes: false,
      alertdelete: '',
      status_data: {},
      status: null,
      status_new: null,
      update_status: false,
      open_change: false,
      order_by: null,
      list_status: [
        { value: 0, text: 'Chưa duyệt', color: '#F5972D' },
        { value: 2, text: 'Từ chối với phần bình luận', color: '#FF0F59' },
        { value: 1, text: 'Đã duyệt', color: '#47BBFF' },
      ],
      headers: [
        { checked: 1, text: 'ID', value: 'id', width: 80 },
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
          width: 80,
        },
      ],
    }
  },

  watch: {
    tab(value) {
      if (value === 6) {
        if (!this.$isServer) {
          this.getlist()
          this.get_status_auto()
        }
      }
    },
    '$store.state.app.change_back'(value) {
      if (this.$store.state.app.pageTitle.includes('Cập nhật đánh giá')) {
        this.open_confirm_review = true
      }
    },
  },
  created() {
    if (!this.$isServer) {
      // this.getlist()
      this.get_status_auto()
    }
  },
  methods: {
    get_review() {
      this.getlist()
      this.$store.commit(
        'app/setTitle',
        `Đánh giá - ${this.data.producer_name}`
      )
    },
    backReview() {
      this.$store.commit(
        'app/setTitle',
        `Đánh giá - ${this.data.producer_name}`
      )
      this.open_add = 1
    },
    getlist() {
      this.open_add = 1
      this.$store
        .dispatch('nha_cung_cap_danh_gia/getlist', {
          enterprise_id: this.data.id,
          search: (this.search1 || []).length !== 0 ? this.search1.trim() : '',
          page_index: this.page,
          page_size: this.pageSize,
          order_by: this.order_by,
          status: this.search.status,
          customer_id:
            (this.search.user || []).length !== 0
              ? this.search.user.trim()
              : '',
          product_type: this.search.categoryProduct.join(),
        })
        .then((response) => {
          if (!response.error) {
            const arr = []
            for (let i = 0; i < response.data.data.items.length; i++) {
              arr.push({
                ...response.data.data.items[i],
                checked: 0,
              })
            }
            this.items = [...arr]

            this.pageInfo = response.data.data.pageable
            this.pageCount = response.data.data.pageable.total_page
          }
        })
    },
    reset_data() {
      this.search = {
        status: null,
        user: null,
        categoryProduct: [],
      }
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
    change_status_auto() {
      this.$store
        .dispatch('nha_cung_cap_danh_gia/change_auto_browse_product', {
          status: this.auto,
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
    get_status_auto() {
      this.$store
        .dispatch('nha_cung_cap_danh_gia/auto_browse_product')
        .then((res) => {
          if (!res.error) {
            this.auto = res.data.data[0].comment_status
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

    selectall(value) {
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
    quest_deletes() {
      if (!this.disabled) {
        if (this.data_selected.length === 1) {
          this.alertdelete =
            'Bạn chắc chắn muốn xóa đánh giá của người dùng "' +
            this.data_selected[0].cust_name +
            '" này không?'
        } else if (this.data_selected.length > 1) {
          this.alertdelete = 'Bạn chắc chắn muốn xóa những đánh giá này không?'
        }
        this.open_deletes = true
      }
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
        .dispatch('nha_cung_cap_danh_gia/delete', {
          deleteCommentRequests: DATA,
        })
        .then((res) => {
          if (!res.error) {
            this.getlist()
            this.$showSuccess(this, 'Xóa đánh giá thành công')
            this.disabled = true
          }
        })
    },

    quest_delete(value) {
      this.data_row = value
      this.alertdelete = `Bạn chắc chắn muốn xóa nhà cung cấp "${value.cust_name}" này không?`
      this.open_delete = true
    },
    confirm_delete() {
      this.$store
        .dispatch('nha_cung_cap_danh_gia/delete', {
          deleteCommentRequests: [
            { id: this.data_row.id, type: this.data_row.comment_type },
          ],
        })
        .then((res) => {
          if (!res.error) {
            this.getlist()
            this.$showSuccess(this, 'Xóa đánh giá thành công')
            this.disabled = true
          }
        })
    },

    set_status(status) {
      this.status = status
    },
    confirm_change_status(item) {
      this.status_data = item
      this.status_new = item.status
      this.open_change = true
    },
    toggle_change_status() {
      this.open_change = false
      const arr = [...this.items]
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === this.status_data.id) {
          arr[i].status = this.status
        }
      }
      this.items = [...arr]
    },
    change_status() {
      if (!this.$isNullOrEmpty(this.status_data.status)) {
        const DATA = {
          updateStatusCommentRequestList: [
            {
              id: this.status_data.id,
              type: this.status_data.comment_type,
              status: this.status_new,
            },
          ],
        }

        this.$store
          .dispatch('nha_cung_cap_danh_gia/change_status', DATA)
          .then((res) => {
            if (!res.error) {
              this.$showSuccess(this, 'Thay đổi trạng thái Đánh giá thành công')
              const arr = [...this.items]
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].id === this.status_data.id) {
                  arr[i].status = this.status_new
                }
              }
              this.items = [...arr]
            }
          })
          .finally(() => {})
      }
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
        .dispatch('nha_cung_cap_danh_gia/change_status', DATA)
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Thay đổi trạng thái Đánh giá thành công')
          }
        })
        .finally(() => {
          this.getlist()
          this.update_status = false
        })
    },
    quest_updatestatus() {
      if (!this.disabled) {
        this.update_status = true
      }
    },
    editItem(item) {
      this.data_row = item
      this.open_add = 2
      this.$store.commit('app/setTitle', 'Cập nhật đánh giá')
    },
    search_reivew() {
      this.page = 1
      this.getlist()
      this.open_search = false
    },
    changePage(value) {
      this.page = value
      this.getlist()
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.pageSize) {
        this.page = 1
        this.pageSize = pageSizes
        this.getlist()
      }
    },
  },
}
</script>
<style lang="scss">
.review {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(90vh - 250px);
  }
}
</style>
