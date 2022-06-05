<template>
  <div v-if="checkRole()">
    <div class="cau-hinh">
      <client-only>
        <div>
          <v-autocomplete
            v-model="category"
            :items="list_category"
            item-value="id"
            item-text="name"
            label="Chọn danh mục"
            no-data-text="Không có dữ liệu"
            class="border-1 fs-14"
            solo
            flat
            dense
            @change="set_data"
          >
          </v-autocomplete>
        </div>
        <v-tabs v-model="tab">
          <v-tab
            v-for="(item, index) in language"
            :key="`${index}-${item}`"
            class="text-none"
            @click="change_tab(item.id)"
          >
            {{ item.name }}
          </v-tab>
          <div class="flex-grow-1"></div>
          <div class="pa-3">
            <v-btn
              color="#47BBFF"
              class="text-none white--text"
              depressed
              @click="open_add = true"
            >
              <v-icon>mdi-plus</v-icon>
              Thêm mới
            </v-btn>
          </div>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item
            v-for="(data, index) in language"
            :key="`${index}-${data.id}`"
            :eager="true"
          >
            <v-data-table
              :headers="headers"
              :items="items"
              fixed-header
              :items-per-page="pageSize"
              :page.sync="page"
              hide-default-footer
              :disable-sort="true"
              loading-text="Xin chờ..."
              no-results-text="Không có kết quả phù hợp"
              no-data-text="Không có dữ liệu"
              class="elevation-0"
              @page-count="pageCount = $event"
            >
              <template v-slot:[`item.actions`]="{ item }">
                <div class="d-flex">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="quest_delete(item)"
                      >
                        <icon-delete />
                      </v-btn>
                    </template>
                    <span>Xóa</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="quest_edit(item)"
                      >
                        <icon-edit />
                      </v-btn>
                    </template>
                    <span>Cập nhật</span>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
            <pagination
              :server="false"
              :items="items"
              :page="page"
              :page-size="pageSize"
              :page-count="pageCount"
              @changePage="changePage"
              @changePageSize="changePageSize"
            >
            </pagination>
          </v-tab-item>
        </v-tabs-items>

        <yes-no-alert
          :alert-msg="alertdelete"
          :open="open_delete"
          @toggle="open_delete = !open_delete"
          @OK="confirm_delete"
        />

        <Add
          :open="open_add"
          dialog-name="Thêm cấu hình"
          @toggle="open_add = !open_add"
          @add="confirm_add"
        />

        <Edit
          :open="open_edit"
          :data="data_row"
          dialog-name="Cập nhật cấu hình"
          @toggle="open_edit = !open_edit"
          @edit="confirm_edit"
        />
      </client-only>
    </div>
  </div>
</template>

<script>
import Add from '../../components/ConfigSystem/add'
import Edit from '../../components/ConfigSystem/edit'

import Rules from '~/assets/configurations/Rules'

export default {
  components: {
    Add,
    Edit,
  },
  data: () => ({
    Rules,
    title: 'Cấu hình hệ thống',
    tab: 0,
    items: [],
    language: [],
    data_row: {},
    category: null,
    list_category: [],
    open_add: false,
    open_delete: false,
    alertdelete: '',
    open_edit: false,
    open_confirm: false,
    page: 1,
    pageCount: 1,
    pageSize: 50,
  }),
  computed: {
    headers() {
      return [
        { text: 'ID', value: 'id', width: '15%' },
        { text: 'Giá trị', value: 'name', width: '70%' },
        { text: 'Hành động', value: 'actions', width: '15%' },
      ]
    },
  },
  mounted() {
    this.$store.commit('app/checkBack', false)
    this.$store.dispatch('cau_hinh_he_thong/getlistCategory').then((res) => {
      if (!res.error) {
        this.list_category = res.data.data
        this.category = this.list_category[0].id

        const LANGUAGE = [...this.$store.state.app.languages]

        if ((LANGUAGE || []).length !== 0) {
          for (let i = 0; i < LANGUAGE.length; i++) {
            LANGUAGE[i] = {
              ...LANGUAGE[i],
            }
          }
        }
        this.language = [...LANGUAGE]
        this.get_list(this.language[0].id)
      }
    })
  },
  methods: {
    set_data() {
      this.tab = 0
      this.get_list(this.language[0].id)
    },
    get_list(lang) {
      this.items = []
      const DATA = {
        type: this.category,
        lang_id: lang,
      }
      this.$store
        .dispatch('cau_hinh_he_thong/detailCategory', DATA)
        .then((res) => {
          if (!res.error) {
            this.items = res.data.data
          }
        })
    },
    change_tab(id) {
      this.get_list(id)
      this.page = 1
      this.pageCount = 1
      this.pageSize = 50
    },
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.configSystem.id
      )
      return roles
    },
    quest_delete(item) {
      this.data_row = item
      this.alertdelete =
        'Bạn chắc chắn muốn xóa cấu hình hệ thống "' +
        item.name +
        '" này không?'
      this.open_delete = true
    },
    confirm_delete() {
      this.$store
        .dispatch('cau_hinh_he_thong/deleteDetailCategory', {
          id: this.data_row.id,
          type: this.category,
        })
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Xóa cấu hình hệ thống thành công')
            this.get_list(this.data_row.lang_id)
          }
        })
    },
    quest_edit(item) {
      this.data_row = item
      this.open_edit = true
    },
    confirm_edit(name) {
      const updateConfigSystems = [
        {
          name,
          lang_id: this.data_row.lang_id,
        },
      ]

      const DATA = {
        type: this.category,
        id: this.data_row.id,
        updateConfigSystems,
      }
      this.$store
        .dispatch('cau_hinh_he_thong/updateDetailCategory', DATA)
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Cập nhật cấu hình hệ thống thành công')
            this.set_data()
            this.open_edit = false
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
        .finally(() => {})
    },
    confirm_add(data) {
      const configSystems = []
      for (let i = 0; i < data.length; i++) {
        configSystems.push({
          name: data[i].config,
          lang_id: data[i].id,
        })
      }

      const DATA = {
        type: this.category,
        configSystems,
      }
      this.$store
        .dispatch('cau_hinh_he_thong/addDetailCategory', DATA)
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Thêm mới cấu hình hệ thống thành công')
            this.set_data()
            this.open_add = false
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
      }
    },
    changePage(value) {
      this.page = value
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
.cau-hinh {
  .v-data-table--fixed-header .v-data-table__wrapper {
    max-height: calc(100vh - 245px);
  }
}
</style>
