<template>
  <div style="background-color: #f4f7fe">
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
            :items="list"
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
            ref="Pagination"
            class="pt-2"
            :page="page"
            :total="totalItem"
            :page-size="pageSize"
            :items="list"
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
      :open="open_update"
      alert-msg="Bạn chắc chắn muốn lưu thông tin quản trị viên không?"
      @toggle="open_update = !open_update"
      @OK="save"
    >
    </yes-no-alert>
    <yes-no-alert
      :open="open_cancel"
      alert-msg="Bạn chắc chắn muốn hủy không?"
      @toggle="open_cancel = !open_cancel"
      @OK="toggle"
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
    listnotification: {
      type: Array,
      default: null,
    },
  },

  data: () => ({
    open_cancel: false,
    open_update: false,
    dataThongbao: [],
    page: 1,
    pageSize: 20,
    pageCount: 1,
    itemPerPage: 0,
    totalItem: 0,
    dataThongtin: {},
    listThongbao: [],
    list: [],
  }),
  computed: {
    headers() {
      return [
        { text: 'Thời điểm', value: 'thoidiem', sortable: false, width: '200' },
        {
          text: 'Thông báo',
          value: 'thongbao',
          sortable: false,
        },
      ]
    },
  },

  watch: {
    open(value) {
      if (value) {
        this.getlist()
      } else {
        this.listThongbao = []
        for (let i = 0; i < this.dataThongbao.length; i++) {
          if (this.dataThongbao[i].status === 1) {
            this.listThongbao.push(this.dataThongbao[i].notify_index)
          }
        }
        this.$store.commit(
          'quan_tri_vien/add_Thongbao',
          this.listThongbao.join()
        )
      }
    },
  },
  methods: {
    toggle() {
      this.$emit('exit')
    },
    getlist() {
      this.dataThongbao = this.listnotification
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
      }
    },
    changePage(value) {
      this.page = value
    },
    save() {
      this.listThongbao = []
      for (let i = 0; i < this.dataThongbao.length; i++) {
        if (this.dataThongbao[i].status === 1) {
          this.listThongbao.push(this.dataThongbao[i].notify_index)
        }
      }
      this.$store.commit('quan_tri_vien/add_Thongbao', this.listThongbao.join())
      this.dataThongtin = this.$store.state.quan_tri_vien.data_add_QTVien
      let hasErrors = false
      if (this.$isNullOrEmpty(this.dataThongtin.name)) {
        hasErrors = true
        this.$emit('tab')
      }
      if (this.$isNullOrEmpty(this.dataThongtin.email)) {
        hasErrors = true
        this.$emit('tab')
      } else if (!this.$isEmail(this.dataThongtin.email)) {
        hasErrors = true
        this.$emit('tab')
      }
      if (this.$isNullOrEmpty(this.dataThongtin.note)) {
        hasErrors = true
        this.$emit('tab')
      }
      if (isNaN(this.phone) && !this.$isNullOrEmpty(this.dataThongtin.phone)) {
        hasErrors = true
        this.$emit('tab')
      } else if (
        (this.dataThongtin.phone + '').length < 10 ||
        (this.dataThongtin.phone + '').length > 12
      ) {
        if (!this.$isNullOrEmpty(this.dataThongtin.phone)) {
          hasErrors = true
          this.$emit('tab')
        }
      }
      if (!hasErrors) {
        this.Add()
      }
    },
    Add() {
      const data = {
        list_notify: this.listThongbao.join(),
        list_page: this.$store.state.quan_tri_vien.listPhanQuyen,
        is_owner: this.$store.state.quan_tri_vien.is_owner,
      }
      Object.assign(data, this.$store.state.quan_tri_vien.data_add_QTVien)
      this.$store
        .dispatch('quan_tri_vien/add', data)
        .then((response) => {
          if (!response.error) {
            this.$emit('exit')
            this.$emit('success')
            this.$showSuccess(this, 'Thêm mới quản trị viên thành công')
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
        .finally(() => {})
    },
  },
}
</script>
