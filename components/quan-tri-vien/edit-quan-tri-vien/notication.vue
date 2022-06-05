<template>
  <div style="background-color: #f4f7fe" class="notication">
    <v-container>
      <v-row class="pt-10">
        <v-col
          v-for="(item, index) in dataThongbao"
          :key="index"
          cols="4"
          class="py-0 d-flex"
        >
          <div>
            <v-card-text class="pt-5">{{ item.notify_name }}</v-card-text>
          </div>
          <v-spacer></v-spacer>
          <!-- v-model="item.status" -->
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
        <v-col cols="12">
          <v-card-text>Danh sách thông báo</v-card-text>
          <v-data-table
            :headers="headers"
            :items="listNotication"
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
            @click="open_cancel = true"
            >Hủy</v-btn
          >
          <v-btn
            class="text-none"
            width="90px"
            color="#47BBFF"
            dark
            depressed
            @click="open_update = true"
            >Lưu</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
    <yes-no-alert
      :open="open_cancel"
      alert-msg="Bạn chắc chắn muốn hủy không?"
      @toggle="open_cancel = !open_cancel"
      @OK="toggle"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_update"
      alert-msg="Bạn chắc chắn muốn lưu thông tin được thay đổi của quản trị viên không?"
      @toggle="open_update = !open_update"
      @OK="save"
    >
    </yes-no-alert>
  </div>
</template>

<script>
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
    id: {
      type: Object,
      default: null,
    },
    listnotification: {
      type: Array,
      default: null,
    },
  },
  data: () => ({
    open_update: false,
    open_cancel: false,
    page: 1,
    pageCount: 1,
    pageSize: 50,
    pageInfo: {},
    list_notify: [],
    listNotication: [],
    dataThongbao: [],
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
        this.getlist()
        this.notificationList()
      } else {
      }
    },
  },
  methods: {
    toggle() {
      this.$emit('exit')
    },
    getlist() {
      this.dataThongbao = this.listnotification
      for (let i = 0; i < this.dataThongbao.length; i++) {
        const element = this.dataThongbao[i]
        if (
          this.data.filter((e) => e.notify_index === element.notify_index)
            .length === 0
        ) {
          element.status = 0
        }
      }
    },
    notificationList() {
      this.$store
        .dispatch('quan_tri_vien/notificationList', {
          account_id: this.id.id,
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
    save() {
      this.list_notify = []
      for (let i = 0; i < this.dataThongbao.length; i++) {
        if (this.dataThongbao[i].status === 1) {
          this.list_notify.push(this.dataThongbao[i].notify_index)
        }
      }
      const data = {
        account_id: this.id.id,
        list_notify:
          (this.list_notify || []).length === 0 ? '' : this.list_notify.join(),
      }
      this.$store
        .dispatch('quan_tri_vien/updateNotication', data)
        .then((response) => {
          if (!response.error) {
            this.$emit('exit')
            this.$emit('success')
            this.$showSuccess(this, 'Cập nhật quản trị viên thành công')
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
        .finally(() => {})
    },
    clicked(value, field) {
      this.$store.commit('quan_tri_vien/change_value', {
        name: field,
        value,
      })
    },
  },
}
</script>
<style lang="scss">
.notication {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(80vh - 355px);
  }
}
</style>
