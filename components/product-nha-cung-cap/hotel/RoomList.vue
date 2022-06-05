<template>
  <div>
    <div class="page page--table">
      <p class="fs-14 pt-4 font-weight-bold">Danh sách phòng nghỉ</p>
      <div class="d-flex">
        <v-text-field
          v-model="searches"
          placeholder="Tìm kiếm theo loại phòng, trạng thái"
          prepend-inner-icon="mdi-magnify"
          class="border-1 pr-2 pb-2"
          solo
          flat
          dense
          hide-details
          @keydown.enter="enter_search"
        >
        </v-text-field>
        <v-btn
          color="#47BBFF"
          class="text-none white--text"
          depressed
          @click="add_room = true"
        >
          <v-icon>mdi-plus</v-icon>
          Thêm phòng
        </v-btn>
      </div>
      <v-data-table
        :headers="headers"
        :items="items"
        hide-default-footer
        loading-text="Xin chờ..."
        no-results-text="Không có kết quả phù hợp"
        no-data-text="Không có dữ liệu"
        fixed-header
        multi-sort
        disable-pagination
        class="elevation-0 page__table"
      >
        <template #top>
          <div class="d-flex align-center pt-3 pl-6">
            <v-btn
              class="fs-14 text-none"
              color="white"
              depressed
              :disabled="disabled"
              @click="toggle_deletes"
            >
              <icon-close :disabled="disabled" class="mr-2" />
              <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                Xóa
              </div>
            </v-btn>
            <v-divider
              style="max-height: 16px"
              class="mx-2 mt-3"
              inset
              vertical
            />
            <v-btn
              class="fs-14 text-none"
              color="white"
              depressed
              :disabled="disabled"
              @click="reset_form"
            >
              <icon-excap :disabled="disabled" class="mr-2" />
              <div :style="`${disabled ? 'color: #CFD8DC' : 'color: black'}`">
                Quay lại
              </div>
            </v-btn>
            <div class="flex-grow-1"></div>
          </div>
        </template>

        <template v-slot:body="props">
          <draggable :list="props.items" tag="tbody" handle=".handle">
            <tr v-for="(item, index) in props.items" :key="`${item}-${index}`">
              <td>
                <v-checkbox
                  v-model="item.checked"
                  :true-value="1"
                  :false-value="0"
                  :ripple="false"
                  class="ma-0"
                  hide-details
                  @change="set_actions"
                >
                </v-checkbox>
              </td>
              <td>
                {{ item.room_type_name }}
              </td>
              <td>
                {{ item.number_rooms }}
              </td>
              <td>
                <v-autocomplete
                  v-model="item.status"
                  :items="list_status"
                  style="width: 200px !important"
                  placeholder="Chọn trạng thái"
                  item-color="white"
                  class="border-1 fs-14"
                  solo
                  flat
                  dense
                  hide-details
                  @change="change_status($event, item)"
                >
                  <template v-slot:selection="data">
                    <div :style="`color: ${data.item.color}`">
                      {{ data.item.text }}
                    </div>
                  </template>
                  <template v-slot:item="data">
                    <div
                      :style="`color: ${data.item.color} !important`"
                      class="fs-13"
                    >
                      {{ data.item.text }}
                    </div>
                  </template>
                </v-autocomplete>
              </td>
              <td>
                <v-icon color="#3F69B8" small class="page__grab-icon handle">
                  mdi-arrow-all
                </v-icon>
              </td>
              <td>
                <div class="d-flex">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        class="ml-2 cp"
                        v-bind="attrs"
                        v-on="on"
                        @click="quest_delete(item)"
                      >
                        <icon-delete />
                      </div>
                    </template>
                    <span>Xóa</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        class="ml-2 cp"
                        v-bind="attrs"
                        v-on="on"
                        @click="quest_edit(item)"
                      >
                        <icon-edit />
                      </div>
                    </template>
                    <span>Cập nhật</span>
                  </v-tooltip>
                </div>
              </td>
            </tr>
          </draggable>
          <tbody v-if="items.length === 0">
            <tr class="v-data-table__empty-wrapper">
              <td colspan="10">Không có dữ liệu</td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </div>

    <yes-no-alert
      :open="open_delete"
      :alert-msg="alertdelete"
      @toggle="open_delete = !open_delete"
      @OK="confirm_delete"
    />

    <yes-no-alert
      :open="open_deletes"
      :alert-msg="alertdelete"
      @toggle="open_deletes = !open_deletes"
      @OK="confirm_deletes"
    />

    <add :open="add_room" @toggle="add_room = !add_room" @add="add" />

    <edit
      :open="edit_room"
      :data="data_row"
      @toggle="edit_room = !edit_room"
      @save="edit"
    />
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

import Add from '~/components/product-nha-cung-cap/hotel/RoomAdd'
import Edit from '~/components/product-nha-cung-cap/hotel/RoomEdit'

export default {
  components: {
    Draggable,
    Add,
    Edit,
  },
  data: () => ({
    items: [],
    list_status: [
      { value: 1, color: '#47BBFF', text: 'Còn phòng trống' },
      { value: 2, color: '#FEBA0F', text: '1 phòng duy nhất' },
      { value: 3, color: '#FF0F59', text: 'Hết phòng' },
    ],
    open_delete: false,
    data_row: {},
    alertdelete: '',
    disabled: true,
    open_deletes: false,
    add_room: false,
    edit_room: false,
    searches: '',
    items_default: [],
  }),
  computed: {
    headers() {
      return [
        { text: '', sortable: false, value: 'checked', width: 20 },
        {
          text: 'Loại phòng',
          sortable: false,
          value: 'room_type_name',
          width: 220,
        },
        {
          text: 'Số lượng phòng',
          sortable: false,
          value: 'number_rooms',
          width: 120,
        },
        { text: 'Trạng thái', sortable: false, value: 'status', width: 120 },
        { text: 'Sắp xếp', sortable: false, value: 'sort', width: 100 },
        { text: 'Hành động', sortable: false, value: 'actions', width: 50 },
      ]
    },
  },
  methods: {
    reset() {
      this.items = []
      this.items_default = []
      this.add_room = false
      this.edit_room = false
      this.disabled = true
    },
    change_status(value, item) {
      for (let i = 0; i < this.items_default; i++) {
        if (this.items_default[i].id === item.id) {
          this.items_default[i].status = value
        }
      }
    },
    enter_search() {
      const arr = []
      if (
        (this.items_default || []).length !== 0 &&
        (this.searches || '').trim().length !== 0
      ) {
        for (let i = 0; i < this.items_default.length; i++) {
          let status = ''
          if (this.items_default[i].status === 1) {
            status = 'con phong trong'
          } else if (this.items_default[i].status === 2) {
            status = '1 phong duy nhat'
          } else if (this.items_default[i].status === 3) {
            status = 'het phong'
          }
          const str = `${this.$removeAccents(
            String(this.items_default[i].room_type_name)
          )} ${status}`

          if (str.includes(this.$removeAccents(this.searches.trim()))) {
            arr.push({
              ...this.items_default[i],
            })
          }
        }
        this.items = [...arr]
      }
      if ((this.searches || '').trim().length === 0) {
        this.items = [...this.items_default]
      }
    },
    quest_delete(item) {
      this.data_row = item
      this.alertdelete =
        'Bạn chắc chắn muốn xóa loại phòng "' + item.room_type_name + '" này?'
      this.open_delete = true
    },
    confirm_delete() {
      const arr = [...this.items]
      for (let i = 0; i < this.items.length; i++) {
        if (this.data_row.id === this.items[i].id) {
          arr.splice(i, 1)
        }
      }
      this.items = [...arr]

      const arr1 = [...this.items_default]
      for (let i = 0; i < this.items_default.length; i++) {
        if (this.data_row.id === this.items_default[i].id) {
          arr1.splice(i, 1)
        }
      }
      this.items_default = [...arr1]
      this.$emit('save', this.items_default)
    },
    toggle_deletes() {
      let count = 0
      let name = ''

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].checked === 1) {
          count += 1
          name = this.items[i].room_type_name
        }
      }

      if (count === 1) {
        this.alertdelete =
          'Bạn chắc chắn muốn xóa loại phòng "' + name + '" này?'
        this.open_deletes = true
      } else if (count > 1) {
        this.alertdelete = 'Bạn chắc chắn muốn xóa những loại phòng này'
        this.open_deletes = true
      }
    },
    confirm_deletes() {
      const arr = []
      const arr2 = [...this.items_default]
      const arrDelete = []

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].checked === 0) {
          arr.push({ ...this.items[i] })
        } else {
          arrDelete.push(this.items[i])
        }
      }
      this.items = [...arr]

      for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arrDelete.length; j++) {
          if (arr2[i].id === arrDelete[j].id) {
            arr2.splice(i, 1)
          }
        }
      }
      this.items_default = [...arr2]
      this.$emit('save', this.items_default)
    },
    quest_edit(item) {
      this.data_row = item
      this.edit_room = true
    },
    reset_form() {
      this.disabled = true

      const arr = [...this.items]

      for (let i = 0; i < arr.length; i++) {
        arr[i] = { ...arr[i], checked: 0 }
      }

      this.items = [...arr]
    },
    set_actions() {
      let count = 0

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].checked === 1) {
          count += 1
        }
      }
      if (count > 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    add(item) {
      this.add_room = false
      const arr = [...this.items]
      arr.push({ ...item, checked: 0 })
      this.items = [...arr]
      this.items_default = [...arr]
      this.$emit('save', this.items)
    },
    edit(item) {
      this.edit_room = false

      const arr = [...this.items]

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === item.id) {
          arr[i] = { ...item }
        }
      }
      this.items = [...arr]
      this.items_default = [...arr]
      this.$emit('save', this.items)
    },
  },
}
</script>

<style lang="scss" scoped>
.page--table {
  .page {
    &__grab-icon {
      cursor: move;
    }
  }
}
.theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: white !important;
  color: black !important;
}
</style>
