<template>
  <div class="main_news_let_ter_customer" style="background-color: #f4f7fe">
    <div>
      <div>
        <v-row>
          <v-col class="pr-0">
            <v-text-field
              v-model="search"
              placeholder="Tìm kiếm"
              prepend-inner-icon="mdi-magnify"
              class="border-1 fs-14"
              solo
              flat
              dense
              hide-details
              @keydown.enter="search_newsletter"
            >
            </v-text-field>
          </v-col>
          <v-col align="center" class="px-0" style="max-width: 125px">
            <v-btn
              color="#47BBFF"
              class="text-none white--text"
              depressed
              height="38"
              @click="search_newsletter"
            >
              Tìm kiếm
            </v-btn>
          </v-col>
          <v-col class="pl-0" cols="auto">
            <v-btn
              :disabled="loading"
              :loading="loading"
              class="mr-1 text-none border-radius: 4px;"
              color="#3F69B8"
              depressed
              @click="export_newsletter_list"
            >
              <img src="~/assets/icon/excel.svg" width="13" height="12" />
              <span style="color: white"> Xuất Excel</span>
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-data-table
        :headers="headers"
        :items="items"
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
        <template v-slot:[`item.id`]="{ item }">
          <div>
            {{ getItemIndex(item) }}
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
</template>

<script>
export default {
  data: () => ({
    items: [],
    page: 1,
    pageCount: 1,
    pageSize: 50,
    totalItem: 0,
    search: '',
    actions: 1,
    open_delete: false,
    data_row: {},
    loading: false,
    disabled: true,
    open_copy: false,
    pageInfo: {},
  }),
  computed: {
    headers() {
      return [
        { text: 'ID', sortable: false, value: 'id', width: 50 },
        {
          text: 'Địa chỉ email',
          sortable: false,
          value: 'email',
          width: 140,
        },
        {
          text: 'Thời gian đăng ký',
          sortable: false,
          value: 'create_at',
          width: 220,
        },
      ]
    },
  },

  methods: {
    getItemIndex(item) {
      return (this.page - 1) * this.pageSize + this.items.indexOf(item) + 1
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
    search_newsletter() {
      this.page = 1
      this.getlist()
    },
    getlist() {
      this.$store
        .dispatch('khach_hang/newsletter_list', {
          page_index: this.page,
          page_size: this.pageSize,
          search: (this.search || []).length !== 0 ? this.search : null,
        })
        .then((res) => {
          if (!res.error) {
            this.items = res.data.data.items
            this.pageCount = res.data.data.pageable.total_page
            const arr = {
              begin_idx: res.data.data.pageable.begin_idx,
              end_idx: res.data.data.pageable.end_idx,
              total_page: res.data.data.pageable.total_page,
              total_record: res.data.data.pageable.total_record,
            }
            this.pageInfo = arr
          }
        })
    },
    export_newsletter_list() {
      this.loading = true
      this.$store
        .dispatch('khach_hang/export_newsletter_list', {
          search: (this.search || []).length !== 0 ? this.search : null,
        })
        .then((res) => {
          if (!res.error) {
            window.location.href = res.data.data
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
<style lang="scss">
.main_news_let_ter_customer {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(90vh - 220px) !important;
  }
}
</style>
