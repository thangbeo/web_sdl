<template>
  <div class="main_posts" @mousewheel="checked_scroll">
    <div class="page page--table">
      <v-data-table
        :headers="headers"
        :items="items"
        show-select
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
            <v-row class="pl-3 pb-4">
              <v-col cols="12" class="px-4 pt-4 pb-0">
                <v-text-field
                  v-model="search"
                  placeholder="Tìm kiếm"
                  prepend-inner-icon="mdi-magnify"
                  class="border-1"
                  solo
                  flat
                  dense
                  hide-details
                  @keyup.enter="get_list"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <div class="fs-14 ml-5">
              Số lượng bài viết: {{ items.length }} bài viết
            </div>
          </div>
        </template>
        <template v-slot:[`header.data-table-select`]>
          <div class="w-100 d-flex justify-center">
            <v-checkbox
              v-model="tick_all"
              class="ma-0"
              hide-details
              :indeterminate="indeterminate"
              disabled
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
              disabled
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
                  disabled
                  :ripple="false"
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
                      small
                      label
                      outlined
                    >
                      {{ status.text }}
                    </v-chip>
                  </template>
                </template>
              </td>
            </tr>
          </draggable>
        </template>
      </v-data-table>

      <yes-no-alert
        :open="open_delete"
        :alert-msg="alertdelete"
        @toggle="open_delete = !open_delete"
        @OK="confirm_delete"
      >
      </yes-no-alert>

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
    </div>
    <v-overlay :value="loading">
      <div id="product-edit-loading">
        <span class="sk-cube sk-cube1"></span>
        <span class="sk-cube sk-cube2"></span>
        <span class="sk-cube sk-cube3"></span>
        <span class="sk-cube sk-cube4"></span>
        <span class="sk-cube sk-cube5"></span>
        <span class="sk-cube sk-cube6"></span>
        <span class="sk-cube sk-cube7"></span>
        <span class="sk-cube sk-cube8"></span>
        <span class="sk-cube sk-cube9"></span>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

// import Edit from '~/components/CategoryPosts/EditPosts'
// import preview from '~/components/CategoryPosts/ViewPost'
export default {
  components: {
    // Edit,
    Draggable,
    // preview,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    // openEdits: false,
    items: [],
    items_add: [],

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
    total_page: 0,
    pageCount: 1,
    pageSize: 50,
    item_data: {},
    item_data_view: {},
    loading: false,
    check: 0,
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
        },
        {
          text: 'Thời gian cập nhật gần nhất',
          sortable: false,
          value: 'time_update',
        },
        { text: 'Trạng thái', sortable: false, value: 'status', width: '150' },
      ]
    },
  },

  methods: {
    change_move(value) {
      const arr = [...this.items]

      arr.splice(value.moved.oldIndex, 1)
      arr.splice(value.moved.newIndex, 0, value.moved.element)
      const DATA = []
      for (let i = 0; i < arr.length; i++) {
        DATA.push(arr[i])
      }
      this.$emit('post_add', DATA)
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
    get_list() {
      this.page = 1
      const DATA = {
        category_id: this.data.categoryPost.id,
        pageIdx: this.page,
        pageSize: this.pageSize,
        search: (this.search || []).length !== 0 ? this.search.trim() : '',
      }
      this.$store.dispatch('danh_muc_bai_viet/in_post', DATA).then((res) => {
        if (!res.error) {
          this.items = []
          if ((res.data.data.items || []).length !== 0) {
            for (let i = 0; i < res.data.data.items.length; i++) {
              res.data.data.items[i] = {
                ...res.data.data.items[i],
                checked: 0,
              }
            }
          }

          this.items = res.data.data.items
          this.total_page = res.data.data.pageable.total_page
        }
      })
    },
    reset(id) {
      this.search = ''
      this.tick_all = false
      this.data_row = {}
      this.pageSize = 20
      this.total_page = 0
      this.loading = false

      this.page = 1
      const DATA = {
        category_id: id,
        pageIdx: this.page,
        pageSize: this.pageSize,
        search: (this.search || []).length !== 0 ? this.search.trim() : '',
      }
      this.$store.dispatch('danh_muc_bai_viet/in_post', DATA).then((res) => {
        if (!res.error) {
          this.items = []
          if ((res.data.data.items || []).length !== 0) {
            for (let i = 0; i < res.data.data.items.length; i++) {
              res.data.data.items[i] = {
                ...res.data.data.items[i],
                checked: 0,
              }
            }
          }
          this.items = res.data.data.items
          this.total_page = res.data.data.pageable.total_page
        }
      })
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
      } else {
        this.set_selected_all(0)
      }
    },
    quest_delete(item, check) {
      // this.$log.debug(item)

      this.data_row = item
      this.check = check

      this.alertdelete =
        'Bạn chắc chắn muốn xóa bài viết "' + item.post_name + '" này?'
      this.open_delete = true
    },
    confirm_delete() {
      let arr = []

      if (this.check === 1) {
        arr = [...this.items]

        for (let i = 0; i < arr.length; i++) {
          if (this.data_row.post_id === arr[i].post_id) {
            arr.splice(i, 1)
          }
        }
        this.items = [...arr]
        this.$emit('post_add', this.items)
      }
      // else if (this.check === 2) {
      //   arr = [...this.items]
      //   console.log(arr)
      //   for (let i = 0; i < arr.length; i++) {
      //     if (this.data_row.post_id === arr[i].post_id) {
      //       arr.splice(i, 1)
      //     }
      //   }
      //   this.items = [...arr]

      //   const deletedPost = []

      //   for (let i = 0; i < this.items.length; i++) {
      //     deletedPost.push(this.items[i].id)
      //   }
      //   this.$emit('deleted_post', deletedPost)
      // }
    },

    checked_scroll() {
      if (this.page < this.total_page) {
        const attributeTable = document.getElementsByClassName(
          'v-data-table__wrapper'
        )
        const attributeTableContent = document.getElementsByTagName('table')

        if (
          attributeTable[1].scrollTop + attributeTable[1].clientHeight >
          attributeTableContent[1].clientHeight - 1
        ) {
          this.page += 1
          const DATA = {
            category_id: this.data.id,
            pageIdx: this.page,
            pageSize: this.pageSize,
            search: (this.search || []).length !== 0 ? this.search.trim() : '',
          }
          this.loading = true
          this.$store
            .dispatch('danh_muc_bai_viet/in_post', DATA)
            .then((res) => {
              if (!res.error) {
                let arr = [...this.items]
                if ((res.data.data.items || []).length !== 0) {
                  for (let i = 0; i < res.data.data.items.length; i++) {
                    res.data.data.items[i] = {
                      ...res.data.data.items[i],
                      checked: 0,
                    }
                  }
                }
                arr = [...arr, ...res.data.data.items]
                this.items = [...arr]
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      }
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
  #product-edit-loading {
    width: 40px;
    height: 40px;
  }
  #product-edit-loading .sk-cube {
    width: 33%;
    height: 33%;
    background-color: #333;
    float: left;
    -webkit-animation: sk-cubegridscaledelay 1.3s infinite ease-in-out;
    animation: sk-cubegridscaledelay 1.3s infinite ease-in-out;
  }
  #product-edit-loading .sk-cube1 {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }
  #product-edit-loading .sk-cube2 {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }
  #product-edit-loading .sk-cube3 {
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
  }
  #product-edit-loading .sk-cube4 {
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
  }
  #product-edit-loading .sk-cube5 {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }
  #product-edit-loading .sk-cube6 {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }
  #product-edit-loading .sk-cube7 {
    -webkit-animation-delay: 0s;
    animation-delay: 0s;
  }
  #product-edit-loading .sk-cube8 {
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
  }
  #product-edit-loading .sk-cube9 {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }

  @-webkit-keyframes sk-cubegridscaledelay {
    0%,
    70%,
    100% {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
    35% {
      -webkit-transform: scale3d(0, 0, 1);
      transform: scale3d(0, 0, 1);
    }
  }
  @keyframes sk-cubegridscaledelay {
    0%,
    70%,
    100% {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
    35% {
      -webkit-transform: scale3d(0, 0, 1);
      transform: scale3d(0, 0, 1);
    }
  }
}
</style>
