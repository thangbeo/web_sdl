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
                  @keydown.enter="get_list"
                >
                </v-text-field>
              </v-col>
              <v-col cols="auto" class="pt-4">
                <v-btn
                  color="#47BBFF"
                  class="text-none white--text mr-2"
                  depressed
                  @click="get_list"
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
          <v-row class="ml-1 pb-4">
            <div class="d-flex">
              <v-btn
                class="fs-14 text-none"
                style="background-color: white !important"
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
                class="mr-1 cfs-14 text-none"
                style="background-color: white !important"
                depressed
                :disabled="disabled"
                @click="reset_form"
              >
                <icon-excap :disabled="disabled" class="mr-2" />
                <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                  Quay lại
                </div></v-btn
              >
            </div>
          </v-row>
          <div class="fs-14 ml-5">
            Số lượng bài viết: {{ items.length }} bài viết
          </div>
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
                      small
                      class="fs-14"
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
                      <v-btn
                        icon
                        class="ml-2 mt-1"
                        v-bind="attrs"
                        v-on="on"
                        @click="quest_delete(item, 1)"
                      >
                        <icon-delete></icon-delete>
                      </v-btn>
                    </template>
                    <span>Xóa</span>
                  </v-tooltip>
                </div>
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

      <add-posts
        :open="open_add"
        :data="items"
        :info="data"
        :listisreset="listisreset"
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
import AddPosts from '~/components/CategoryPosts/edit/AddPostsEdit'
// import Edit from '~/components/CategoryPosts/EditPosts'
// import preview from '~/components/CategoryPosts/ViewPost'
export default {
  components: {
    AddPosts,
    // Edit,
    Draggable,
    // preview,
  },
  props: {
    listisreset: {
      type: Boolean,
      required: true,
    },
    posttype: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    // openEdits: false,
    items: [],
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
    id: [],
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
          value: 'update_by',
          width: 150,
        },
        {
          text: 'Thời gian cập nhật gần nhất',
          sortable: false,
          value: 'update_time',
          width: 200,
        },
        { text: 'Trạng thái', sortable: false, value: 'status', width: '150' },
        { text: 'Sắp xếp', sortable: false, value: 'sort' },
        { text: 'Hành động', sortable: false, value: 'actions' },
      ]
    },
  },

  methods: {
    set_value(value, item) {
      // this.$log.debug(value, item)
      item.checked = value
      const arrselected = [...this.data_selected]

      if (value === 1) {
        arrselected.push(item)
      } else {
        for (let i = 0; i < arrselected.length; i++) {
          if (item.post_id === arrselected[i].post_id) {
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
        order_by: '',
        post_type: this.posttype.category_type,
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
        // this.$emit('post_add', [{ id: this.data.post_id }])
      })
    },
    reset_id(id) {
      this.search = ''
      this.tick_all = false
      this.data_row = {}
      this.pageSize = 50
      this.total_page = 0
      this.loading = false

      this.page = 1
      // const DATA = {
      //   order_by: '',
      //   category_id: id,
      //   pageIdx: this.page,
      //   pageSize: this.pageSize,
      //   search: (this.search || []).length !== 0 ? this.search.trim() : '',
      // }
      // this.$store.dispatch('danh_muc_bai_viet/in_post', DATA).then((res) => {
      //   if (!res.error) {
      //     this.items = []

      //     if ((res.data.data.items || []).length !== 0) {
      //       this.id = []
      //       for (let i = 0; i < res.data.data.items.length; i++) {
      //         this.id.push(res.data.data.items[i].post_id)

      //         res.data.data.items[i] = {
      //           ...res.data.data.items[i],
      //           checked: 0,
      //         }
      //       }
      //     }
      //     this.items = []
      //     this.total_page = []
      //   }
      // })
      this.items = []
      this.total_page = []
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
        order_by: '',
        post_type: id.category_type,
        category_id: id.id,
        pageIdx: this.page,
        pageSize: this.pageSize,
        search: (this.search || []).length !== 0 ? this.search.trim() : '',
      }
      this.$store.dispatch('danh_muc_bai_viet/in_post', DATA).then((res) => {
        if (!res.error) {
          this.items = []

          if ((res.data.data.items || []).length !== 0) {
            this.id = []
            for (let i = 0; i < res.data.data.items.length; i++) {
              this.id.push(res.data.data.items[i].post_id)

              res.data.data.items[i] = {
                ...res.data.data.items[i],
                checked: 0,
              }
            }
          }
          this.items = res.data.data.items
          this.total_page = res.data.data.pageable.total_page
        }

        this.$emit('post_add', this.items)
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
        this.data_selected = this.items
        this.disabled = false
      } else {
        this.set_selected_all(0)
        this.data_selected = []
        this.disabled = true
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
    quest_deletes() {
      let count = 0
      let name = ''

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].checked === 1) {
          count += 1
          name = this.items[i].post_name
        }
      }

      if (count === 1) {
        this.alertdelete = 'Bạn chắc chắn muốn xóa bài viết "' + name + '" này?'
        this.open_deletes = true
      } else if (count > 1) {
        this.alertdelete = 'Bạn chắc chắn muốn xóa những bài viết này?'
        this.open_deletes = true
      }
    },
    confirm_deletes() {
      this.tick_all = false
      const arrDelete = []
      const arr = []
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].checked === 1) {
          arrDelete.push(this.items[i].id)
        } else {
          arr.push({ ...this.items[i] })
        }
      }

      this.$emit('deleted_post', arrDelete)

      this.items = [...arr]

      const arr1 = []

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].checked === 0) {
          arr1.push({ ...this.items[i] })
        }
      }
      this.items = [...arr1]

      this.$emit('post_add', this.items)
    },
    add(items) {
      const arr = [...items]

      for (let i = 0; i < arr.length; i++) {
        arr[i].checked = 0
      }

      this.items = [...arr, ...this.items]
      this.$emit('post_add', this.items)
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
            order_by: '',
            post_type: this.posttype.category_type,
            category_id: this.data.post_id,
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
