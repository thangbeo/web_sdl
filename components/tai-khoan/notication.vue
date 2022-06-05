<template>
  <div style="background-color: #f4f7fe" class="login">
    <v-container>
      <v-row class="pt-10">
        <v-col
          v-for="(item, index) in dataThongbao"
          :key="index"
          cols="4"
          class="py-0 d-flex"
        >
          <div>
            <v-card-text class="pt-6">{{ item.notify_name }}</v-card-text>
          </div>
          <v-spacer></v-spacer>
          <div style="margin-right: 130px">
            <v-switch
              v-model="item.status"
              color="#47bbff"
              :false-value="0"
              :true-value="1"
              inset
            ></v-switch>
          </div>
        </v-col>
        <v-col cols="12" class="py-0">
          <v-card-text class="font-weight-bold"
            >Danh sách thông báo</v-card-text
          >
          <v-data-table
            :headers="headers"
            :items="listNotication"
            :page.sync="page"
            :items-per-page="pageSize"
            hide-default-footer
            fixed-header
            multi-sort
            no-results-text="Không có kết quả phù hợp"
            no-data-text="Không có dữ liệu"
            class="elevation-0"
            loading-text="Xin chờ..."
          >
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
        </v-col>
        <v-col cols="12" class="pt-12 d-flex justify-end">
          <v-btn
            color="#FF0F59"
            width="90px"
            class="text-none white--text mr-3"
            depressed
            @click="offNotication = true"
            >Hủy</v-btn
          >
          <v-btn
            class="text-none"
            width="90px"
            color="#47BBFF"
            dark
            depressed
            @click="saveNotication"
            >Lưu</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
    <yes-no-alert
      :open="openNotication"
      alert-msg="Bạn chắc chắn muốn lưu thông báo được thay đổi của tài khoản không?"
      @toggle="openNotication = !openNotication"
      @OK="save"
    >
    </yes-no-alert>

    <yes-no-alert
      :open="offNotication"
      alert-msg="Bạn chắc chắn muốn hủy không?"
      @toggle="offNotication = !offNotication"
      @OK="back"
    >
    </yes-no-alert>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  props: {
    open: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Array,
      default: null,
    },
  },
  data: () => ({
    openNotication: false,
    offNotication: false,
    page: 1,
    pageCount: 1,
    pageSize: 50,
    pageInfo: {},
    transaction: true,
    listNotication: [],
    list_notify: [],
    product: true,
    dataThongbao: [],
    user: true,
    post: true,
    comment: true,
    chat: true,
  }),
  computed: {
    headers() {
      return [
        {
          text: 'Thời điểm',
          value: 'create_time',
          sortable: false,
          width: '200',
        },
        {
          text: 'Thông báo',
          value: 'content',
          sortable: false,
        },
      ]
    },
  },

  watch: {
    open(value) {
      if (value) {
        for (let i = 0; i < this.dataThongbao.length; i++) {
          const element = this.dataThongbao[i]
          if (
            this.data.filter((e) => e.notify_index === element.notify_index)
              .length === 0
          ) {
            element.status = 0
          }
        }
      } else {
      }
    },
  },
  mounted() {
    this.ListNotify()
    this.notificationList()
  },
  methods: {
    // demo() {
    //   console.log(1)
    // },
    saveNotication() {
      this.openNotication = true
    },
    back() {
      this.openNotication = false
      for (let i = 0; i < this.dataThongbao.length; i++) {
        const element = this.dataThongbao[i]
        element.status = 1
        if (
          this.data.filter((e) => e.notify_index === element.notify_index)
            .length === 0
        ) {
          element.status = 0
        }
      }
    },
    save() {
      this.list_notify = []
      for (let i = 0; i < this.dataThongbao.length; i++) {
        if (this.dataThongbao[i].status === 1) {
          this.list_notify.push(this.dataThongbao[i].notify_index)
        }
      }
      const data = {
        account_id: Cookies.get('user_id'),
        list_notify:
          (this.list_notify || []).length === 0 ? '' : this.list_notify.join(),
      }
      this.$store
        .dispatch('quan_tri_vien/updateNotication', data)
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Cập nhật thành công')
            this.$emit('notication')
            this.openNotication = false
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
        .finally(() => {})
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
        this.notificationList()
      }
    },
    changePage(value) {
      this.page = value
      this.notificationList()
    },
    notificationList() {
      this.$store
        .dispatch('quan_tri_vien/notificationList', {
          account_id: Cookies.get('user_id'),
          pageSize: this.pageSize,
          pageIdx: this.page,
        })
        .then((response) => {
          if (!response.error) {
            this.listNotication = response.data.data.items
            this.pageInfo = response.data.data.pageable
            this.pageCount = response.data.data.pageable.total_page
          }
        })
    },
    ListNotify() {
      this.$store
        .dispatch('quan_tri_vien/getListNotify', {})
        .then((response) => {
          if (!response.error) {
            this.dataThongbao = response.data.data
          }
        })
    },
  },
}
</script>
<style lang="scss">
.login {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(80vh - 330px);
  }
}
</style>
