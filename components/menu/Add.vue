<template>
  <div style="background-color: #f4f7fe">
    <v-container>
      <v-row class="pt-3">
        <v-col class="pb-0" cols="11">
          <p class="ma-0 fs-14 font-weight-bold">
            Tên menu <span class="error--text ml-1">*</span>
          </p>
          <v-text-field
            v-model="nameMenu"
            :error-messages="nameMenuError"
            placeholder="Nhập Tên menu"
            class="border-1 fs-14"
            solo
            flat
            dense
            :outlined="nameMenuError.length !== 0"
            @input="nameMenuError = []"
          >
          </v-text-field>
        </v-col>

        <v-col class="pb-0" cols="11">
          <p class="ma-0 fs-14 font-weight-bold">
            Dùng cho sites <span class="error--text ml-1">*</span>
          </p>
          <v-autocomplete
            v-model="sites"
            :error-messages="sitesError"
            :items="list_sites"
            item-value="id"
            item-text="name"
            placeholder="Chọn Sites"
            class="border-1 fs-14"
            multiple
            solo
            flat
            dense
            :outlined="sitesError.length !== 0"
            @input="sitesError = []"
          >
          </v-autocomplete>
        </v-col>

        <v-col cols="11">
          <p class="ma-0 fs-14 font-weight-bold">
            Thành phần của menu <span class="error--text ml-1">*</span>
          </p>
          <div class="py-0" style="background-color: white" outlined>
            <div class="d-flex pa-2 justify-end">
              <!-- <v-text-field
                v-model="search"
                placeholder="Tìm kiếm"
                prepend-inner-icon="mdi-magnify"
                class="mr-3 border-1"
                height="40"
                solo
                flat
                dense
                hide-details
              >
              </v-text-field> -->

              <v-btn
                class="text-none white--text"
                depressed
                height="39"
                color="#47BBFF"
                @click="open_add = true"
              >
                <v-icon> mdi-plus </v-icon>
                Thêm danh mục
              </v-btn>
            </div>
            <div class="custom-drag-drop-tree-view pa-2">
              <Tree
                :value="treeData"
                :indent="50"
                edge-scroll
                @change="actions"
                @drop="updateLocation"
              >
                <template v-slot="{ node, path, tree }">
                  <div
                    class="d-flex align-center"
                    style="font-size: 14px; height: 32px"
                  >
                    <img
                      class="ml-2"
                      style="cursor: move"
                      src="~/assets/icon/move.png"
                      width="16"
                      height="16"
                    />
                    <div class="ml-3">{{ node.page_name }}</div>
                    <div class="flex-grow-1"></div>
                    <div
                      style="color: #ff0f59; cursor: pointer"
                      class="mr-4"
                      @click="confirm_delete(path, tree, node)"
                    >
                      Xóa
                    </div>
                  </div>
                </template>
              </Tree>
            </div>
          </div>
          <div class="v-messages theme--light error--text mt-1" role="alert">
            <div class="v-messages__wrapper">
              <div class="v-messages__message">{{ treeDataError }}</div>
            </div>
          </div>
        </v-col>

        <v-col cols="11" class="pt-12 d-flex justify-end">
          <v-btn
            color="#FF0F59"
            width="90px"
            class="text-none white--text mr-3"
            depressed
            @click="open_cancel = true"
            >Hủy</v-btn
          >
          <v-btn
            class="white--text text-none"
            width="90px"
            color="#47BBFF"
            depressed
            @click="checkSave"
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
      :alert-msg="save_msg"
      @toggle="open_update = !open_update"
      @OK="save"
    >
    </yes-no-alert>

    <addCategory
      :open="open_add"
      :data="items"
      @toggle="open_add = !open_add"
      @add="add"
    />

    <yes-no-alert
      :open="open_delete"
      alert-msg="Bạn có chắc chắn muốn xóa không?"
      @toggle="open_delete = !open_delete"
      @OK="delete_item"
    />
  </div>
</template>

<script>
import 'he-tree-vue/dist/he-tree-vue.css'
import { Tree, Draggable } from 'he-tree-vue'
import addCategory from '~/components/menu/addCategory'
export default {
  components: {
    addCategory,
    Tree: Tree.mixPlugins([Draggable]),
  },
  props: {
    open: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    save_msg: 'Bạn chắc chắn muốn lưu thông tin menu không?',
    required: false,
    treeData: [],
    treeDataError: null,
    path: [],
    tree: null,
    open_delete: false,
    search: '',
    open_add: false,
    open_update: false,
    open_cancel: false,
    nameMenu: null,
    nameMenuError: [],
    sites: null,
    sitesError: [],
    list_sites: [],
    items: [],
    level: 0,
  }),
  watch: {
    open(value) {
      if (value === 2) {
        this.$store.commit('app/checkBack', true)
        this.reset()
        this.getSites()
      }
    },
  },
  methods: {
    checkSave() {
      if (
        (this.treeData || []).length !== 0 &&
        !this.$isNullOrEmpty(this.sites)
      ) {
        const data = {
          menu_id: this.$store.state.danh_sach_menu.menu_id,
          listSites: this.sites.join(),
        }
        this.$store
          .dispatch('danh_sach_menu/checkSites', data)
          .then((response) => {
            if (!response.error) {
              if ((response.data.data[0].list_sites || []).length !== 0) {
                this.save_msg = `Bạn sẽ thay đổi sites ${response.data.data[0].list_sites} đã được dùng trong menu khác. Bạn chắc chắn muốn lưu thông tin menu không?`
              } else {
                this.save_msg = 'Bạn chắc chắn muốn lưu thông tin menu không?'
              }
              this.open_update = true
            }
          })
          .catch((e) => {
            this.$log.debug(e)
          })
          .finally(() => {})
      } else {
        this.save_msg = 'Bạn chắc chắn muốn lưu thông tin menu không?'
        this.open_update = true
      }
    },
    updateLocation(object) {
      this.checked(this.treeData, object.dragNode.id)
    },
    checked(arr, id, parentId) {
      this.level += 1

      for (let i = 0; i < arr.length; i++) {
        if ((arr[i].children || '').length !== 0) {
          this.checked(arr[i].children, id, arr[i].id)
        }
        if (arr[i].id === id) {
          const array = []
          if (this.level === 1) {
            for (let i = 0; i < this.treeData.length; i++) {
              array.push({
                menu_id: this.$store.state.danh_sach_menu.menu_id,
                menu_detail_id: this.treeData[i].id,
                parent_id: 0,
                // level: 1,
                page_index: i + 1,
              })
            }
          } else if (this.level > 1) {
            for (let i = 0; i < arr.length; i++) {
              array.push({
                menu_id: this.$store.state.danh_sach_menu.menu_id,
                menu_detail_id: arr[i].id,
                parent_id: parentId,
                // level: this.level,
                page_index: i + 1,
              })
            }
          }
          this.updateDrop(array)
        }
      }
    },
    updateDrop(array) {
      this.$store
        .dispatch('danh_sach_menu/updateDetail', { data: array })
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Cập nhật thành phần menu thành công')
            this.level = 0
          } else {
            this.treeData = []
            this.$store.dispatch('danh_sach_menu/detail').then((res) => {
              if (!res.error) {
                // this.treeData = res.data.data.detailMenu
              }
            })
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
        .finally(() => {})
    },
    getSites() {
      this.$store.dispatch('danh_sach_menu/getSites').then((res) => {
        if (!res.error) {
          this.list_sites = res.data.data
        }
      })
    },
    actions() {
      // this.$log.debug(this.treeData)
    },
    confirm_delete(path, tree, node) {
      this.detailID = node.id
      this.path = path
      this.tree = tree
      this.open_delete = true
    },
    delete_item() {
      this.$store
        .dispatch('danh_sach_menu/deleteDetail', {
          menu_detail_id: this.detailID,
        })
        .then((res) => {
          if (!res.error) {
            this.$showSuccess(this, 'Xóa danh mục thành công')
            this.tree.removeNodeByPath(this.path)
          }
        })
    },
    add(data) {
      this.open_add = false
      const arr = [...this.treeData]
      arr.unshift(data)
      this.treeData = [...arr]
      this.treeDataError = null
    },
    toggle() {
      this.$emit('toggle')
      this.reset()
    },
    reset() {
      this.save_msg = 'Bạn chắc chắn muốn lưu thông tin menu không?'
      this.nameMenu = null
      this.nameMenuError = []
      this.sites = null
      this.sitesError = []
      this.treeData = []
      this.treeDataError = null
    },
    save() {
      let hasErrors = false
      let count = 0
      if ((this.treeData || []).length === 0) {
        hasErrors = true
        this.required = true
        this.treeDataError = 'Không được để trống'
        count += 1
      }
      if (this.$isNullOrEmpty(this.nameMenu)) {
        hasErrors = true
        this.nameMenuError = ['Không được để trống']
        count += 1
      }
      if (this.$isNullOrEmpty(this.sites)) {
        hasErrors = true
        this.sitesError = ['Không được để trống']
        count += 1
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.update()
      }
    },
    update() {
      const data = {
        menu_id: this.$store.state.danh_sach_menu.menu_id,
        menu_name: this.nameMenu,
        list_sites: this.sites.join(),
      }
      this.$store
        .dispatch('danh_sach_menu/update', data)
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Thêm mới menu thành công')
            this.$emit('toggle')
            this.$emit('OK')
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
<style lang="scss">
.custom-drag-drop-tree-view {
  .he-tree .tree-node {
    border-radius: 4px !important;
  }
}
</style>
