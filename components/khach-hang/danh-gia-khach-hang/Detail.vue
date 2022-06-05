<template>
  <div style="background-color: #f4f7fe">
    <div style="background-color: #fff">
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
              class="d-inline-block text-truncate"
              style="max-width: 200px"
              :href="customerCommentDetail.url"
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
        <v-col cols="2" class="pb-0">
          <v-select
            v-model="status"
            :items="list_status_reivew"
            background-color="#F9F9F9"
            style="width: 160px"
            solo
            disabled
            dense
            flat
            hide-details
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
            disabled
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
                <v-img height="100px" :src="images.url"> </v-img>
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
            disabled
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
        <template v-slot:[`item.content`]="{ item }">
          <v-textarea
            v-model="item.content"
            solo
            flat
            disabled
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
            disabled
            solo
            dense
            hide-details
            style="width: 160px"
            class="pb-3 pt-3"
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
    <div>
      <v-app-bar flat>
        <v-spacer></v-spacer>
        <div class="pt-0">
          <v-btn
            class="text-none white--text mr-3"
            color="#656565"
            disabled
            depressed
            width="90"
            @click="open_reset = true"
            >Nhập lại</v-btn
          >
          <v-btn
            class="text-none white--text mr-3"
            color="#47BBFF"
            disabled
            depressed
            width="90"
            @click="open_update = true"
            >Cập nhật</v-btn
          >
          <v-btn
            color="error"
            class="text-none white--text"
            depressed
            @click="open_cancel = true"
          >
            Hủy
          </v-btn>
        </div>
      </v-app-bar>
    </div>

    <yes-no-alert
      :open="open_cancel"
      alert-msg="Bạn chắc chắn muốn hủy?"
      @toggle="open_cancel = !open_cancel"
      @OK="toggle"
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
    pageSize: 20,
    pageInfo: {},
    items: [],
    changes_item_status: {},
    status: null,
    reply_content_by_admin: '',
    content: null,
    rating: null,
    open_update: false,
    open_cancel: false,
    list_status_reivew: [
      { value: 2, text: 'Chờ duyệt', color: '#F5972D' },
      { value: 3, text: 'Từ chối', color: '#FF0F59' },
      { value: 1, text: 'Phê duyệt', color: '#17E555' },
    ],
    list_status: [
      { value: 1, text: 'Hiển thị', color: '#17E555' },
      { value: 0, text: 'Ẩn', color: '#FF0F59' },
    ],
    headers: [
      { text: 'ID', sortable: false, value: 'id', width: 100 },
      {
        text: 'Thời gian',
        sortable: false,
        value: 'at',
        width: 200,
      },
      {
        text: 'Người dùng',
        sortable: false,
        value: 'cust_name',
        width: 250,
      },
      {
        text: 'Trả lời',
        sortable: false,
        value: 'content',
        width: 350,
      },
      {
        text: 'Trạng thái',
        sortable: false,
        value: 'status',
        width: 100,
      },
    ],
  }),

  watch: {
    data() {
      this.get_list()
    },
  },

  methods: {
    toggle() {
      this.$emit('toggle')
    },
    get_list() {
      this.$store
        .dispatch('danh_gia/detail', {
          page_idx: this.page,
          page_size: this.pageSize,
          id: this.data.id,
          type: this.data.comment_type,
        })
        .then((response) => {
          if (!response.error) {
            this.items = response.data.data.commentDetails
            this.reply_content_by_admin = ''
            this.commentImages = response.data.data.commentImages
            this.customerCommentDetail =
              response.data.data.customerCommentDetail
            this.rating = response.data.data.customerCommentDetail.rate

            this.nhanXet = response.data.data.customerCommentDetail.content
            this.status = response.data.data.customerCommentDetail.status
            this.pageInfo = response.data.data.pageable
            this.pageCount = response.data.data.pageable.total_page
          }
        })
    },

    changePage(value) {
      this.page = value
      this.get_list()
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.pageSize) {
        this.page = 1
        this.pageSize = pageSizes
        this.get_list()
      }
    },
  },
}
</script>
