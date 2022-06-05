<template>
  <div style="background-color: #f4f7fe">
    <div style="background-color: #fff" class="pb-16">
      <v-row>
        <v-col cols="4" class="pb-0">
          <v-card-text class="pt-2"
            ><span
              class="d-inline-block font-weight-bold mr-1 text-truncate"
              style="max-width: 100px"
              >Link đánh giá:</span
            >
            <a
              target="_blank"
              :href="customerCommentDetail.url"
              class="d-inline-block text-truncate"
              style="max-width: 200px"
              >{{
                $isNullOrEmpty(customerCommentDetail)
                  ? ''
                  : customerCommentDetail.url
              }}
            </a>
          </v-card-text>
        </v-col>
        <v-col cols="3" class="pb-0">
          <v-card-text class="pt-2"
            ><span class="d-inline-block font-weight-bold mr-1"
              >Người dùng:
            </span>
            <span>{{
              $isNullOrEmpty(customerCommentDetail)
                ? ''
                : customerCommentDetail.cust_name
            }}</span>
          </v-card-text>
        </v-col>
        <v-col cols="2" class="pb-0">
          <v-card-text
            class="font-weight-bold pt-2 pr-0"
            style="text-align: right"
            >Trạng thái
          </v-card-text>
        </v-col>
        <v-col cols="3" class="pb-0">
          <v-select
            v-model="status"
            :items="list_status_reivew"
            background-color="#F9F9F9"
            style="width: 160px"
            solo
            dense
            flat
            hide-details
            class="fs-14"
            @click="set_status(status)"
            @change="confirm_change_status($event)"
          >
            <template v-slot:selection="data_selected">
              <div :style="`color: ${data_selected.item.color}`">
                {{ data_selected.item.text }}
              </div>
            </template>
            <template v-slot:item="data_selected">
              <div
                :style="`color: ${data_selected.item.color} !important`"
                class="fs-13"
              >
                {{ data_selected.item.text }}
              </div>
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="1" class="pr-0">
          <v-card-text class="pt-1 pr-0"
            ><span class="d-inline-block font-weight-bold mr-1"
              >Đánh giá:
            </span>
          </v-card-text>
        </v-col>
        <v-col cols="3" class="pl-0">
          <v-rating
            v-model="rating"
            background-color="orange"
            color="orange"
            dense
            readonly
          ></v-rating>
        </v-col>
        <v-col cols="4">
          <v-card-text class="pt-1"
            ><span class="d-inline-block font-weight-bold mr-1"
              >Thời gian:
            </span>
            <span>{{
              $isNullOrEmpty(customerCommentDetail)
                ? ''
                : customerCommentDetail.at
            }}</span>
          </v-card-text>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" class="py-0">
          <v-card-text class="font-weight-bold">Nhận xét:</v-card-text>
        </v-col>
        <v-col cols="12" class="pt-0 px-7 border-1">
          <v-textarea
            v-model="nhanXet"
            class="fs-14"
            rows="2"
            solo
            flat
            hide-details
            readonly
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" class="py-0">
          <v-card-text class="font-weight-bold">Hình ảnh:</v-card-text>
        </v-col>
        <v-col cols="1" class="py-0">
          <div class="d-flex">
            <div v-for="(images, index) in commentImages" :key="index">
              <div class="mr-3">
                <v-img height="100px" width="100px" :src="images.url"> </v-img>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" class="py-0">
          <v-card-text class="font-weight-bold" style="color: #3f69b8"
            >Trả lời người dùng:</v-card-text
          >
        </v-col>
        <v-col cols="12" class="pt-0 px-7 border-1">
          <v-textarea
            v-model="reply_content_by_admin"
            rows="4"
            class="fs-14"
            solo
            flat
            hide-details
            placeholder="Nhập câu trả lời"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" class="py-0">
          <v-card-text class="font-weight-bold fs-17"
            >Lịch sử xử lý</v-card-text
          >
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="pageSize"
        hide-default-footer
        loading-text="Xin chờ..."
        no-results-text="Không có kết quả phù hợp"
        no-data-text="Không có dữ liệu"
        fixed-header
        multi-sort
        :sort-desc="true"
        class="elevation-1"
      >
        <template v-slot:[`item.reply_content_by_admin`]="{ item }">
          <v-textarea
            v-model="item.reply_content_by_admin"
            solo
            flat
            hide-details
            rows="3"
            class="border-1 fs-14 py-2"
            readonly
          >
          </v-textarea>
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
            class="pb-3 pt-3 fs-14"
            @click="sets_status(item.status)"
            @change="confirm_changes_status(item)"
          >
            <template v-slot:selection="data_selected">
              <div :style="`color: ${data_selected.item.color}`">
                {{ data_selected.item.text }}
              </div>
            </template>
            <template v-slot:item="data_selected">
              <div
                :style="`color: ${data_selected.item.color} !important`"
                class="fs-13"
              >
                {{ data_selected.item.text }}
              </div>
            </template>
          </v-select>
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
    <div
      class="d-flex w-100 py-4"
      style="
        position: fixed;
        z-index: 3;
        right: 10px;
        bottom: 0;
        background-color: #f5f7fe;
      "
    >
      <div class="flex-grow-1"></div>
      <v-btn
        color="error"
        class="text-none white--text mr-3"
        dark
        depressed
        width="90"
        @click="open_cancel = true"
      >
        Hủy
      </v-btn>
      <v-btn
        class="text-none white--text mr-3"
        color="#656565"
        dark
        depressed
        width="90"
        @click="open_reset = true"
        >Nhập lại</v-btn
      >
      <v-btn
        class="text-none white--text"
        color="#47BBFF"
        dark
        depressed
        width="90"
        @click="open_update = true"
        >Cập nhật</v-btn
      >
    </div>

    <yes-no-alert
      :open="open_reset"
      alert-msg="Bạn chắc chắn muốn nhập lại câu trả lời đánh giá ?"
      @toggle="open_reset = !open_reset"
      @OK="set_again"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_cancel"
      alert-msg="Bạn chắc chắn muốn hủy?"
      @toggle="open_cancel = !open_cancel"
      @OK="toggle"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_update"
      alert-msg="Bạn chắc chắn muốn cập nhật đánh giá?"
      @toggle="open_update = !open_update"
      @OK="save"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_change"
      alert-msg="Bạn có muốn thay đổi trạng thái không?"
      @toggle="toggle_change_status"
      @OK="change_status"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_changes"
      alert-msg="Bạn có muốn thay đổi trạng thái không?"
      @toggle="toggle_changes_status"
      @OK="changes_status"
    >
    </yes-no-alert>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Object,
      required: true,
    },
    comment: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    images: null,
    url: null,
    cust_name: null,
    at: null,
    commentImages: null,
    customerCommentDetail: [],
    open_reset: false,
    open_change: false,
    open_changes: false,
    nhanXet: null,
    page: 1,
    pageCount: 1,
    pageSize: 50,
    pageInfo: {},
    items: [],
    status: null,
    statusHistory: null,
    status_new: null,
    status_data: {},
    statusComment: null,
    reply_content_by_admin: null,
    content: null,
    rating: null,
    open_update: false,
    open_cancel: false,
    list_status_reivew: [
      { value: 0, text: 'Chưa duyệt', color: '#F5972D' },
      { value: 1, text: 'Đã duyệt', color: '#17E555' },
      { value: 2, text: 'Từ chối với phần bình luận', color: '#FF0F59' },
    ],
    list_status: [
      { value: 1, text: 'Hiển thị', color: '#47BBFF' },
      { value: 0, text: 'Ẩn', color: '#FF0F59' },
    ],
    headers: [
      { text: 'ID', sortable: false, value: 'id', width: 100 },
      {
        text: 'Thời gian',
        sortable: false,
        value: 'at',
        width: 180,
      },
      {
        text: 'Người dùng',
        sortable: false,
        value: 'cust_name',
        width: 180,
      },
      {
        text: 'Trả lời',
        sortable: false,
        value: 'reply_content_by_admin',
        width: 350,
      },
      {
        text: 'Trạng thái',
        sortable: false,
        value: 'status',
        width: 80,
      },
    ],
  }),
  mounted() {
    this.get_list()
  },
  methods: {
    set_status(status) {
      this.statusHistory = status
    },
    confirm_change_status(value) {
      this.customerCommentDetail.status = value
      this.open_change = true
    },
    toggle_change_status() {
      this.status = this.statusHistory
      this.open_change = !this.open_change
    },
    change_status() {
      if (!this.$isNullOrEmpty(this.customerCommentDetail.status)) {
        const DATA = {
          updateStatusCommentRequestList: [
            {
              id: this.customerCommentDetail.id,
              type: this.comment,
              status: this.customerCommentDetail.status,
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
            this.get_list()
          })
      }
    },
    sets_status(status) {
      this.statusComment = status
    },
    confirm_changes_status(item) {
      this.status_data = item
      this.status_new = item.status
      this.open_changes = true
    },
    toggle_changes_status() {
      this.open_changes = false
      const arr = [...this.items]
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === this.status_data.id) {
          arr[i].status = this.statusComment
        }
      }
      this.items = [...arr]
    },
    changes_status() {
      if (!this.$isNullOrEmpty(this.status_data)) {
        const DATA = {
          updateStatusCommentRequestList: [
            {
              id: this.status_data.id,
              type: this.comment,
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
    Update() {
      const data = {
        id: this.customerCommentDetail.id,
        type: this.comment,
        content: this.reply_content_by_admin,
        status: this.status,
      }
      this.$store
        .dispatch('danh_gia/update', data)
        .then((response) => {
          if (!response.error) {
            this.$emit('toggle')
            this.$showSuccess(this, 'Cập nhật thành công')
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
        .finally(() => {})
    },
    toggle() {
      this.$emit('toggle')
      this.reset()
    },
    reset() {
      this.status = null
      this.content = null
    },
    set_again() {
      this.reply_content_by_admin = null
    },

    get_list() {
      if (!this.$isNullOrEmpty(this.data.customerCommentDetail)) {
        this.items = this.data.commentDetails
        this.reply_content_by_admin = null
        this.commentImages = this.data.commentImages
        this.customerCommentDetail = this.data.customerCommentDetail
        this.rating = this.data.customerCommentDetail.rate
        this.nhanXet = this.data.customerCommentDetail.content
        this.status = this.data.customerCommentDetail.status
        this.pageInfo = this.data.pageable
        this.pageCount = this.data.pageable.total_page
      }
    },
    save() {
      this.Update()
    },
    changePage(value) {
      this.page = value
      this.get_list()
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
        this.get_list()
      }
    },
  },
}
</script>
