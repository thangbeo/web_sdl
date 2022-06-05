<template>
  <div class="main_posts">
    <div class="page page--table">
      <v-data-table
        :headers="headers"
        :items="items"
        show-select
        :search="search"
        :items-per-page="pageSize"
        fixed-header
        disable-pagination
        hide-default-footer
        loading-text="Xin chờ..."
        no-results-text="Không có kết quả phù hợp"
        no-data-text="Không có dữ liệu"
        class="elevation-0 page__table"
        :page.sync="page"
        @page-count="pageCount = $event"
      >
        <template #top>
          <div>
            <v-row class="pl-3 pt-0">
              <v-col class="pl-4 pt-4">
                <v-text-field
                  v-model="search"
                  placeholder="Tìm kiếm"
                  prepend-inner-icon="mdi-magnify"
                  class="border-1"
                  solo
                  flat
                  dense
                  hide-details
                >
                </v-text-field>
              </v-col>
              <v-col cols="auto" class="pt-4">
                <v-btn
                  color="#47BBFF"
                  class="text-none white--text mr-2"
                  depressed
                  @click="get_search"
                >
                  Tìm kiếm
                </v-btn>
                <v-btn
                  color="#47BBFF"
                  depressed
                  class="text-none white--text mr-2"
                  @click="open_add = true"
                >
                  <v-icon>mdi-plus</v-icon>
                  Thêm mới
                </v-btn>
              </v-col>
            </v-row>
          </div>
          <v-row class="pl-2">
            <div class="d-flex fs-14">
              <v-btn
                style="background-color: white !important"
                class="mr-1 ml-1 text-none px-3"
                width="90px"
                depressed
                :disabled="disabled"
                @click="quest_deletes"
              >
                <icon-close :disabled="disabled" class="mr-2" />
                <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                  Xóa
                </div></v-btn
              >
              <v-divider style="max-height: 20px" inset vertical></v-divider>
              <v-btn
                class="mr-1 text-none"
                style="background-color: white !important"
                depressed
                :disabled="disabled"
                @click="reset_form"
                ><icon-excap :disabled="disabled" class="mr-2" />
                <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                  Quay lại
                </div></v-btn
              >
            </div>
          </v-row>
        </template>

        <template v-slot:[`header.data-table-select`]>
          <div class="w-100 d-flex justify-center">
            <v-checkbox
              v-model="tick_all"
              class="ma-0"
              hide-details
              :indeterminate="indeterminate"
              :disabled="(items || []).length === 0"
              :ripple="false"
              @change="select_all"
            >
            </v-checkbox>
          </div>
        </template>

        <template v-slot:[`item.data-table-select`]="{ item }">
          <div class="w-100 d-flex justify-center">
            <v-checkbox
              v-model="item.checked"
              class="ma-0"
              hide-details
              :true-value="1"
              :false-value="0"
              :ripple="false"
              @change="set_value($event, item)"
            >
            </v-checkbox>
          </div>
        </template>

        <template v-slot:body="props">
          <draggable
            :list="props.items"
            tag="tbody"
            handle=".handle"
            @change="change_move"
          >
            <tr v-for="(item, index) in props.items" :key="`${item}-${index}`">
              <td>
                <v-checkbox
                  v-model="item.checked"
                  class="ma-0"
                  hide-details
                  :true-value="1"
                  :false-value="0"
                  :ripple="false"
                  @change="set_value($event, item)"
                >
                </v-checkbox>
              </td>
              <td>
                {{ item.post_name }}
              </td>
              <td>{{ item.update_by }}</td>
              <td>{{ item.update_time }}</td>
              <td>
                <template>
                  <template v-for="(status, i) in list_status">
                    <v-chip
                      v-if="status.value === item.status"
                      :key="`${i}-${status}`"
                      :color="status.color"
                      class="fs-14"
                      small
                      label
                      outlined
                    >
                      {{ status.text }}
                    </v-chip>
                  </template>
                </template>
              </td>
              <td>
                <v-icon color="#3F69B8" small class="page__grab-icon handle">
                  mdi-arrow-all
                </v-icon>
              </td>
              <td>
                <div class="d-flex">
                  <!-- @click="openDetail(item)" -->
                  <!-- <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        class="ml-2"
                        v-bind="attrs"
                        v-on="on"
                        @click="quest_view(item)"
                      >
                        <v-icon size="19" color="">mdi-eye</v-icon>
                      </div>
                    </template>
                    <span>Xem trước</span>
                  </v-tooltip> -->
                  <!-- @click="openEdit(item)" -->
                  <!-- <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        class="ml-2 mt-1"
                        v-bind="attrs"
                        v-on="on"
                        @click="quest_edit(item)"
                      >
                        <icon-edit></icon-edit>
                      </div>
                    </template>
                    <span>Cập nhật</span>
                  </v-tooltip> -->
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        class="ml-2 mt-1"
                        v-bind="attrs"
                        v-on="on"
                        @click="quest_delete(item)"
                      >
                        <icon-delete></icon-delete>
                      </div>
                    </template>
                    <span>Xóa</span>
                  </v-tooltip>
                </div>
              </td>
            </tr>
          </draggable>
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

      <yes-no-alert
        :open="open_delete"
        :alert-msg="alertdelete"
        @toggle="open_delete = !open_delete"
        @OK="confirm_delete"
      >
      </yes-no-alert>

      <add-posts
        :open="open_add"
        :data="items"
        @toggle="open_add = !open_add"
        @add="add"
      />

      <!-- <Edit
        :open="open_edit"
        :data="item_data"
        @toggle="open_edit = !open_edit"
        @demo="demo"
      >
      </Edit> -->
      <!-- <preview
        :open="open_view"
        :data="item_data_view"
        @toggle="open_view = !open_view"
      >
      </preview> -->
      <yes-no-alert
        :open="open_deletes"
        :alert-msg="alertdelete"
        @toggle="open_deletes = !open_deletes"
        @OK="confirm_deletes"
      >
      </yes-no-alert>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import AddPosts from '~/components/CategoryPosts/AddPosts'
// import Edit from '~/components/CategoryPosts/EditPosts'
// import preview from '~/components/CategoryPosts/ViewPost'
export default {
  components: {
    AddPosts,
    // Edit,
    Draggable,
    // preview,
  },
  data: () => ({
    // openEdits: false,
    items: [],
    items_default: [],
    action: 1,
    update_status: {},
    list_status: [
      { value: 1, color: '#47BBFF', text: 'Hiển thị' },
      { value: 0, color: '#FF0F59', text: 'Ẩn' },
    ],
    dataDetail: {},
    search: '',
    data_selected: [],
    tick_all: false,
    indeterminate: false,
    open_delete: false,
    data_row: {},
    alertdelete: '',
    disabled: true,
    open_add: false,
    open_edit: false,
    open_deletes: false,
    open_view: false,
    alertdeletes: '',
    page: 1,
    pageCount: 1,
    pageSize: 50,
    item_data: {},
    item_data_view: {},
  }),
  computed: {
    headers() {
      return [
        {
          text: 'Tên Bài viết',
          sortable: false,
          value: 'post_name',
        },
        {
          text: 'Người sửa gần nhất',
          sortable: false,
          value: 'user_update',
          width: 150,
        },
        {
          text: 'Thời gian cập nhật gần nhất',
          sortable: false,
          value: 'time_update',
          width: 200,
        },
        { text: 'Trạng thái', sortable: false, value: 'status', width: '150' },
        { text: 'Sắp xếp', sortable: false, value: 'sort' },
        { text: 'Hành động', sortable: false, value: 'actions' },
      ]
    },
  },
  methods: {
    get_search() {
      const arr = []
      if (
        (this.items_default || []).length !== 0 &&
        (this.search || '').trim().length !== 0
      ) {
        for (let i = 0; i < this.items_default.length; i++) {
          const str = `${this.$removeAccents(
            String(this.items_default[i].post_name)
          )}`

          if (str.includes(this.$removeAccents(this.search.trim()))) {
            arr.push({
              ...this.items_default[i],
            })
          }
        }
        this.items = [...arr]
      }
      if ((this.search || '').trim().length === 0) {
        this.items = [...this.items_default]
      }
    },
    change_move(value) {
      // console.log(value, '1')
      // console.log(this.items, '2')
      const arr = [...this.items]
      const DATA = []

      arr.splice(value.moved.oldIndex, 1)
      arr.splice(value.moved.newIndex, 0, value.moved.element)

      for (let i = 0; i < arr.length; i++) {
        DATA.push(arr[i])
      }
      this.$emit('set_posts', DATA)
    },
    // demo(value) {
    //   const arr = [...this.items]
    //   for (let i = 0; i < arr.length; i++) {
    //     if (arr[i].post_id === value.post_id) {
    //       arr[i] = value
    //     }
    //   }
    //   this.items = [...arr]
    // },
    // quest_edit(value) {
    //   this.data_row = value
    //   this.$store
    //     .dispatch('bai_viet/detail', { post_id: value.post_id })
    //     .then((res) => {
    //       if (!res.error) {
    //         this.item_data = res.data.data
    //         this.open_edit = true
    //       }
    //     })
    // },
    // quest_view(value) {
    //   this.data_row = value
    //   this.$store
    //     .dispatch('bai_viet/detail', { post_id: value.post_id })
    //     .then((res) => {
    //       if (!res.error) {
    //         this.item_data_view = res.data.data
    //         this.open_view = true
    //       }
    //     })
    // },
    changePage(value) {
      this.page = value
    },
    changePageSize(pageSizes) {
      if (pageSizes !== this.itemsPerPage) {
        this.page = 1
        this.pageSize = pageSizes
      }
    },
    set_selected_all(checked) {
      const arr = [...this.items]

      for (let i = 0; i < arr.length; i++) {
        arr[i] = {
          ...arr[i],
          checked,
        }
      }
      this.items = [...arr]
    },
    select_all(value) {
      // this.$log.debug(this.items)
      if (value) {
        this.set_selected_all(1)
        this.data_selected = this.items
        this.disabled = false
      } else {
        this.set_selected_all(0)
        this.data_selected = []
        this.disabled = true
      }
    },
    set_value(value, item) {
      // this.$log.debug(value, item)
      item.checked = value
      const arrselected = [...this.data_selected]

      if (value === 1) {
        arrselected.push(item)
      } else {
        for (let i = 0; i < arrselected.length; i++) {
          if (item.id === arrselected[i].id) {
            arrselected.splice(i, 1)
          }
        }
      }
      this.data_selected = [...arrselected]

      const arr = []

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].checked === 1) {
          arr.push(this.items[i].checked)
        }
      }

      if (arr.length > 0 && arr.length < this.items.length) {
        this.indeterminate = true
        this.disabled = false
      } else if (arr.length === this.items.length) {
        this.indeterminate = false
        this.tick_all = true
        this.disabled = false
      } else if (arr.length === 0) {
        this.tick_all = false
        this.indeterminate = false
        this.disabled = true
      }
    },
    quest_delete(item) {
      // this.$log.debug(item)

      this.data_row = item
      this.alertdelete =
        'Bạn chắc chắn muốn xóa bài viết "' + item.post_name + '" này?'
      this.open_delete = true
    },
    confirm_delete() {
      const arr = [...this.items]
      // console.log(arr, '1')
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].post_id === this.data_row.post_id) {
          arr.splice(i, 1)
        }
      }
      this.items = [...arr]
      this.items_default = [...this.items]
      this.$emit('set_posts', this.items)
    },
    reset_form() {
      this.tick_all = false
      this.indeterminate = false
      this.disabled = true
      const arr = [...this.items]

      for (let i = 0; i < arr.length; i++) {
        arr[i].checked = 0
      }
      this.items = [...arr]
    },
    reset() {
      this.items = []
    },
    add(items) {
      const arr = [...items]
      for (let i = 0; i < arr.length; i++) {
        arr[i].checked = 0
      }
      this.items = [...this.items, ...arr]
      this.items_default = [...this.items]
      this.$emit('set_posts', this.items)
    },
    quest_deletes() {
      let count = 0
      let name = ''
      if (!this.disabled) {
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].checked === 1) {
            count += 1
            name = this.items[i].post_name
          }
        }
        if (count === 1) {
          this.alertdelete =
            'Bạn chắc chắn muốn xóa bài viết "' + name + '" này?'
        } else {
          this.alertdelete = 'Bạn chắc chắn muốn xóa những bài viết này?'
        }
        this.open_deletes = true
      }
    },
    confirm_deletes() {
      this.tick_all = false
      this.indeterminate = false
      const arr = []

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].checked === 0) {
          arr.push(this.items[i])
        }
      }
      this.items = [...arr]
      this.$emit('set_posts', this.items)
    },
  },
}
</script>
<style lang="scss" scoped>
.main_posts {
  .page--table {
    .page {
      &__table {
        margin-top: 20px;
      }

      &__grab-icon {
        cursor: move;
      }
    }
  }
}
</style>
