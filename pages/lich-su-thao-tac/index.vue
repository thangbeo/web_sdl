<template>
  <div class="custom-system-log">
    <v-row>
      <v-col class="py-0">
        <div>
          <v-text-field
            v-model="search"
            placeholder="Tìm kiếm"
            prepend-inner-icon="mdi-magnify"
            class="border-1 fs-14 pr-0"
            solo
            flat
            dense
            hide-details
            @keydown.enter="system_log"
          >
          </v-text-field>
        </div>
      </v-col>
      <v-col class="pt-0">
        <div style="max-width: 500px">
          <date-range-picker-page :date="date"></date-range-picker-page>
        </div>
      </v-col>
      <v-col cols="auto" class="pt-0">
        <v-btn
          depressed
          height="38"
          class="mr-3 text-none white--text"
          color="#47BBFF"
          @click="system_log"
          >Tìm kiếm</v-btn
        >
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers1"
      :items="logs"
      :items-per-page="pageSize"
      fixed-header
      :page.sync="page"
      light
      show-expand
      single-expand
      multi-sort
      hide-default-footer
      :sort-desc="true"
      loading-text="Xin chờ..."
      no-results-text="Không có kết quả phù hợp"
      no-data-text="Không có dữ liệu"
      class="elevation-0 page__table"
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          {{ item.request }}
        </td>
      </template>
      <template v-slot:[`item.code`]="{ item }">
        <div v-if="item.code === 0">Thành công</div>
        <div v-else>Thất bại</div>
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
</template>

<script>
import moment from 'moment'
import Vue from 'vue'

Vue.prototype.moment = moment

const now = new Date()
const firstDate = moment(now).format('YYYY-MM-DD')
const endDate = moment(now).format('YYYY-MM-DD')

export default {
  name: 'SystemLog',
  data() {
    return {
      page: 1,
      pageSize: 50,
      pageCount: 1,
      pageInfo: {},
      logs: [],
      search: '',
      date: [firstDate, endDate],
    }
  },
  computed: {
    headers1() {
      return [
        { text: 'Nội dung', sortable: false, value: 'action_name' },
        { text: 'Thời gian', sortable: false, value: 'action_at' },
        {
          text: 'Người tác động',
          sortable: false,
          value: 'action_by',
        },

        {
          text: 'Trạng thái',
          sortable: false,
          value: 'code',
          width: 120,
        },
      ]
    },
  },
  mounted() {
    this.system_log()
  },
  methods: {
    // checkRole(actionId) {
    //   let isAllowed = this.$isAccessAction(
    //     this.$store.state.app.roles,
    //     Rules.System.SystemLog.id,
    //     actionId
    //   )
    //   return isAllowed
    // },
    changePage(value) {
      this.page = value
      this.system_log()
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
        this.system_log()
      }
    },
    system_log() {
      const data = {
        search: this.search,
        start_date: moment(this.date[0]).format('YYYY-MM-DD'),
        end_date: moment(this.date[1]).format('YYYY-MM-DD'),
        pageIdx: this.page,
        pageSize: this.pageSize,
      }

      this.$store
        .dispatch('lich_su_thao_tac/log_action_list', data)
        .then((response) => {
          if (!response.error) {
            this.logs = response.data.data.items

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

  head() {
    this.$store.commit('app/setTitle', 'Lịch sử thao tác')
    return {
      title: 'Lịch sử thao tác',
    }
  },
}
</script>
<style lang="scss">
.custom-system-log {
  .v-data-table__expanded__content {
    box-shadow: none !important;
  }
}
</style>
