<template>
  <div style="background-color: #f4f7fe">
    <div class="page page--table pt-12">
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="pageSize"
        :search="search"
        hide-default-footer
        loading-text="Xin chờ..."
        no-results-text="Không có kết quả phù hợp"
        no-data-text="Không có dữ liệu"
        fixed-header
        multi-sort
        class="elevation-0 page__table"
      >
        <template #top>
          <v-app-bar flat color="#f4f7fe">
            <v-text-field
              v-model="search"
              placeholder="Tìm kiếm"
              prepend-inner-icon="mdi-magnify"
              background-color="white"
              class="mr-3 fs-14"
              style="margin-left: -16px"
              height="40"
              solo
              flat
              dense
              hide-details
              @keyup.enter="get_list"
            >
            </v-text-field>

            <div>
              <v-btn
                color="#47BBFF"
                class="text-none white--text"
                style="margin-right: -15px"
                depressed
                height="40"
                @click="get_list"
              >
                Tìm kiếm
              </v-btn>
            </div>
          </v-app-bar>
        </template>
        <template v-slot:body="props">
          <draggable :list="props.items" tag="tbody" handle=".handle">
            <tr v-for="(item, index) in props.items" :key="`${item}-${index}`">
              <td>
                {{ item.id }}
              </td>
              <td>
                {{ item.time }}
              </td>
              <td>
                {{ item.danhSachDaLuu }}
              </td>
              <td>
                <div>
                  <a
                    :href="item.link"
                    target="_blank"
                    class="d-inline-block text-truncate"
                    style="max-width: 90px"
                    >{{ item.link }}</a
                  >
                </div>
              </td>
            </tr>
          </draggable>
        </template>
      </v-data-table>

      <pagination
        ref="pagination"
        class="pt-2"
        :server="false"
        :items="items"
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
import Draggable from 'vuedraggable'
export default {
  components: {
    Draggable,
  },
  data: () => ({
    items: [],
    page: 1,
    pageCount: 1,
    pageSize: 10,
    totalItem: 0,
    search: '',
    actions: 1,
    open_delete: false,
    data_row: {},
    open_copy: false,
    data: {},
  }),
  computed: {
    headers() {
      return [
        { text: 'ID', sortable: false, value: 'id', width: 50 },
        {
          text: 'Thời gian',
          sortable: false,
          value: 'time',
          width: 140,
        },
        {
          text: 'Danh sách đã lưu',
          sortable: false,
          value: 'danhSachDaLuu',
          width: 220,
        },
        { text: 'Link', sortable: false, value: 'link', width: 100 },
      ]
    },
  },
  mounted() {
    this.get_list()
  },
  methods: {
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
    get_list() {
      this.items = [
        {
          id: '1',
          time: '20h15 ngày 20/10/2020',
          danhSachDaLuu: 'Tour Hạ Long',
          link: 'https://www.24h.com.vn/',
        },
        {
          id: '2',
          time: '20h15 ngày 22/12/2020',
          danhSachDaLuu: 'Nhà hàng Hạ Long',
          link: 'https://www.youtube.com/',
        },
      ]
    },
  },
}
</script>
