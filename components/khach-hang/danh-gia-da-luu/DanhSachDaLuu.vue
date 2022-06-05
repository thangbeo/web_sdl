<template>
  <div class="main_favorite_customer" style="background-color: #f4f7fe">
    <div>
      <div>
        <v-row>
          <v-col>
            <v-text-field
              v-model="search"
              placeholder="Tìm kiếm"
              prepend-inner-icon="mdi-magnify"
              class="border-1 fs-14"
              solo
              flat
              dense
              hide-details
              @keydown.enter="search_list_favorite_customer"
            >
            </v-text-field>
          </v-col>
          <v-col style="max-width: 125px">
            <v-btn
              color="#47BBFF"
              class="text-none white--text"
              depressed
              height="38"
              @click="search_list_favorite_customer"
            >
              Tìm kiếm
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
        <!-- <template v-slot: [`item.create_time`]="{item}">
          <div>{{ item.create_time }}</div>
        </template> -->
        <template v-slot:[`item.url_seo`]="{ item }">
          <div>
            <a
              :href="item.url_seo"
              target="_blank"
              class="d-inline-block text-truncate"
              style="max-width: 90px"
              >{{ item.url_seo }}</a
            >
          </div>
        </template>
        <template v-slot:[`item.stt`]="{ item }">
          <div>
            {{ getItemIndex(item) }}
          </div>
        </template>
        <!-- <template v-slot:body="props">
          <draggable :list="props.items" tag="tbody" handle=".handle">
            <tr v-for="(item, index) in props.items" :key="`${item}-${index}`">
              <td>
                {{ getItemIndex(item) }}
              </td>
              <td>
                {{ item.create_time }}
              </td>
              <td>
                {{ item.name }}
              </td>
              <td>
                <div>
                  <a
                    :href="item.url_seo"
                    target="_blank"
                    class="d-inline-block text-truncate"
                    style="max-width: 90px"
                    >{{ item.url_seo }}</a
                  >
                </div>
              </td>
            </tr>
          </draggable>
        </template> -->
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
// import Draggable from 'vuedraggable'
export default {
  // components: {
  //   Draggable,
  // },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
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
    open_copy: false,

    pageInfo: {},
  }),
  computed: {
    headers() {
      return [
        { text: 'ID', sortable: false, value: 'stt', width: 50 },
        {
          text: 'Thời gian',
          sortable: false,
          value: 'create_time',
          width: 140,
        },
        {
          text: 'Danh sách đã lưu',
          sortable: false,
          value: 'name',
          width: 220,
        },
        { text: 'Link', sortable: false, value: 'url_seo', width: 100 },
      ]
    },
  },
  watch: {
    // tab(value) {
    //   if (value === 13) {
    //     this.list_favorite_customer()
    //   }
    // },
  },
  methods: {
    getItemIndex(item) {
      return (this.page - 1) * this.pageSize + this.items.indexOf(item) + 1
    },
    changePage(value) {
      this.page = value
      this.list_favorite_customer()
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
        this.list_favorite_customer()
      }
    },
    search_list_favorite_customer() {
      this.page = 1
      this.list_favorite_customer()
    },
    list_favorite_customer() {
      this.$store
        .dispatch('khach_hang/list_favorite_customer', {
          customer_id: this.id,
          page_index: this.page,
          page_size: this.pageSize,
          search: (this.search || []).length !== 0 ? this.search.trim() : '',
          order_by: '',
        })
        .then((response) => {
          if (!response.error) {
            this.items = response.data.data.items
            this.pageCount = response.data.data.pageable.total_page
            const arr = {
              begin_idx: response.data.data.pageable.begin_idx,
              end_idx: response.data.data.pageable.end_idx,
              total_page: response.data.data.pageable.total_page,
              total_record: response.data.data.pageable.total_record,
            }
            this.pageInfo = arr
          }
        })
    },
  },
}
</script>
<style lang="scss">
.main_favorite_customer {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(97vh - 220px) !important;
  }
}
</style>
