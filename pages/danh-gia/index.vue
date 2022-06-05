<template>
  <div v-if="checkRole()" style="background-color: #f4f7fe">
    <div v-if="open_add == 1" class="review_all">
      <template>
        <v-row>
          <v-col class="px-0">
            <v-app-bar elevation="0" style="background-color: #f4f7fe">
              <v-text-field
                v-model="search1"
                class="mr-3 border-1 fs-14"
                prepend-inner-icon="mdi-magnify"
                placeholder="Tìm kiếm đánh giá"
                solo
                flat
                dense
                hide-details
                height="40"
                style="min-width: 444px"
                @keyup.enter="search_reivew"
              >
              </v-text-field>
              <!-- <v-btn
                color="#47BBFF"
                class="text-none white--text mr-3"
                height="40"
                depressed
                @click="getlist"
              >
                Tìm kiếm
              </v-btn> -->
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
          </v-col>
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
          multi-sort
          item-key="stt"
          class="elevation-1"
        >
          <template #top>
            <div class="d-flex pt-3 review">
              <v-btn
                color="white"
                class="mr-1 ml-1 text-none px-3"
                width="90px"
                depressed
                :disabled="disabled"
                @click="quest_deletes"
              >
                <icon-close
                  :disabled="disabled"
                  class="mr-2"
                  height="14"
                  width="14"
                ></icon-close>
                <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                  Xóa
                </div>
              </v-btn>
              <v-divider style="max-height: 20px" inset vertical></v-divider>
              <v-btn
                color="white"
                class="mr-1 text-none"
                depressed
                :disabled="disabled"
                @click="quest_updatestatus"
                ><icon-edit
                  :disabled="disabled"
                  class="mr-2"
                  height="14"
                  width="14"
                ></icon-edit>
                <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                  Cập nhật trạng thái
                </div>
              </v-btn>
              <v-divider style="max-height: 20px" inset vertical></v-divider>
              <v-btn
                color="white"
                class="mr-1 text-none"
                depressed
                :disabled="disabled"
                @click="reset_form"
                ><icon-excap
                  :disabled="disabled"
                  class="mr-2"
                  height="14"
                  width="14"
                ></icon-excap>
                <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                  Quay lại
                </div>
              </v-btn>
              <v-spacer></v-spacer>
              <div class="font-weight-bold mr-6">
                Tự động phê duyệt Đánh giá và Nhận xét
              </div>
              <v-switch
                v-model="hidden"
                color="#47bbff"
                class="mt-0"
                style="margin-top: -10px !important"
                :true-value="1"
                :false-value="0"
                inset
                hide-details
                @change="change_status_auto"
              ></v-switch>
            </div>
          </template>
          <template v-slot:[`header.data-table-select`]>
            <div class="w-100 d-flex justify-center">
              <v-checkbox
                v-model="tick_all"
                class="ma-0 pb-2"
                hide-details
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
              class="border-2 fs-14"
              style="width: 180px"
              solo
              dense
              hide-details
              @click="set_status(item.status)"
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
                    class="pt-1"
                    icon
                    v-bind="attrs"
                    :to="`/danh-gia/${item.comment_type}/${item.id}`"
                    v-on="on"
                  >
                    <icon-edit></icon-edit>
                  </v-btn>
                </template>
                <span>Cập nhật</span>
              </v-tooltip>

              <!-- <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="pt-1" icon v-bind="attrs" v-on="on">
                    <img
                      class="mr-1"
                      src="~/assets/icon/change_color_view.svg"
                    />
                  </v-btn>
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
    <yes-no-alert
      :open="open_confirm"
      alert-msg="Bạn chắc chắn muốn thoát không?"
      @toggle="open_confirm = !open_confirm"
      @OK="open_add = 1"
    />
    <edit
      v-if="open_add == 2"
      :open="open_add"
      :data="data_row"
      @toggle="getlist"
      @exit="getlist"
    >
    </edit>

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
            v-model="search.enterprise"
            placeholder="Nhà cung cấp"
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
import edit from '~/components/danh-gia/edit'
import updateStatus from '~/components/danh-gia/updateStatus'
import Rules from '~/assets/configurations/Rules'
export default {
  components: { edit, updateStatus, Dialog },
  data() {
    return {
      search: {
        enterprise: null,
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
      selected: null,
      hidden: 1,
      page: 1,
      pageCount: 1,
      pageSize: 50,
      pageInfo: {},
      tick_all: false,
      data_selected: [],
      items: [],
      disabled: true,
      search1: null,
      title: 'Đánh giá',
      open_add: 1,
      data_row: {},
      open_delete: false,
      open_deletes: false,
      update_status: false,
      open_change: false,
      status_data: {},
      status: null,
      status_new: null,
      alertdelete: '',
      headers: [],
      open_confirm: false,
      list_status: [
        { value: 0, text: 'Chưa duyệt', color: '#F5972D' },
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
          width: 80,
        },
      ],
    }
  },
  watch: {
    open_add(value) {
      if (value === 1) {
        this.title = 'Đánh giá'
        this.$store.commit('app/checkBack', false)
      } else if (value === 2) {
        this.title = `Chi tiết đánh giá`
        this.$store.commit('app/setTitle', this.title)
        this.$store.commit('app/checkBack', true)
      }
    },
    '$store.state.app.change_back'(value) {
      this.open_confirm = true
    },
  },
  mounted() {
    this.getlist()
    this.get_status_auto()
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
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.Evaluate.id
      )
      return roles
    },
    reset_data() {
      this.search = {
        enterprise: null,
        status: null,
        user: null,
        categoryProduct: [],
      }
    },
    search_reivew() {
      this.page = 1
      this.getlist()
      this.open_search = false
    },
    getlist() {
      this.open_add = 1
      this.$store
        .dispatch('danh_gia/getlist', {
          search: (this.search1 || []).length !== 0 ? this.search1.trim() : '',
          pageIdx: this.page,
          pageSize: this.pageSize,
          status: this.search.status,
          ncc:
            (this.search.enterprise || []).length !== 0
              ? this.search.enterprise.trim()
              : '',
          customer_id:
            (this.search.user || []).length !== 0
              ? this.search.user.trim()
              : '',
          product_type: this.search.categoryProduct.join(),
        })
        .then((response) => {
          if (!response.error) {
            if ((response.data.data.items || []).length !== 0) {
              for (let i = 0; i < response.data.data.items.length; i++) {
                response.data.data.items[i] = {
                  ...response.data.data.items[i],
                  stt: i + 1,
                  checked: 0,
                }
                for (let j = 0; j < this.data_selected.length; j++) {
                  if (
                    response.data.data.items[i].id === this.data_selected[j].id
                  ) {
                    response.data.data.items[i] = {
                      ...response.data.data.items[i],
                      checked: 1,
                    }
                  }
                }
              }

              let count = 0

              for (let i = 0; i < response.data.data.items.length; i++) {
                if (response.data.data.items[i].checked === 1) {
                  count += 1
                }
              }
              if (count === response.data.data.items.length) {
                this.tick_all = true
              } else {
                this.tick_all = false
              }
            }
            this.items = response.data.data.items
            this.pageInfo = response.data.data.pageable
            this.pageCount = response.data.data.pageable.total_page
          }
        })
    },
    quest_deletes() {
      if (!this.disabled) {
        if (this.data_selected.length === 1) {
          this.alertdelete = 'Bạn chắc chắn muốn xóa đánh giá này?'
        } else if (this.data_selected.length > 1) {
          this.alertdelete = 'Bạn chắc chắn muốn xóa những đánh giá này?'
        }
        this.open_deletes = true
      }
    },
    quest_delete(value) {
      this.data_row = value
      this.alertdelete = 'Bạn chắc chắn muốn xóa đánh giá này?'
      this.open_delete = true
    },
    confirm_delete() {
      this.$store
        .dispatch('danh_gia/delete', {
          deleteCommentRequests: [
            { id: this.data_row.id, type: this.data_row.comment_type },
          ],
        })
        .then((res) => {
          if (!res.error) {
            this.getlist()
            this.$showSuccess(this, 'Xóa dữ liệu thành công')
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
            this.getlist()
            this.$showSuccess(this, 'Xóa dữ liệu thành công')
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
          .dispatch('danh_gia/change_status', DATA)
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
        .dispatch('danh_gia/change_status', DATA)
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
    get_status_auto() {
      this.$store.dispatch('danh_gia/auto_browse_product').then((res) => {
        if (!res.error) {
          this.hidden = res.data.data[0].comment_status
        }
      })
    },
    quest_updatestatus() {
      if (!this.disabled) {
        this.update_status = true
      }
    },
    reset_form() {
      if (!this.disabled) {
        this.tick_all = false
        this.disabled = true
        this.data_selected = []
        const arr = [...this.items]

        for (let i = 0; i < arr.length; i++) {
          arr[i].checked = 0
        }
        this.items = [...arr]
      }
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
        this.disabled = false

        const arr = [...this.items]

        for (let i = 0; i < arr.length; i++) {
          if (this.data_selected.length > 0) {
            const arr1 = [...this.data_selected]
            for (let j = 0; j < this.data_selected.length; j++) {
              if (
                arr[i].id === this.data_selected[j].id &&
                arr[i].comment_type === this.data_selected[j].comment_type
              ) {
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
          if (
            item.id === arrselected[i].id &&
            item.comment_type === arrselected[i].comment_type
          ) {
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
            if (
              arr[i].id === this.data_selected[j].id &&
              arr[i].comment_type === this.data_selected[j].comment_type
            ) {
              arr1.splice(j, 1)
            }
          }
          this.data_selected = [...arr1]
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
.review_all {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(100vh - 280px) !important;
  }
  .review {
    .theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
      background-color: white !important;
      color: black !important;
    }
  }
}
</style>
