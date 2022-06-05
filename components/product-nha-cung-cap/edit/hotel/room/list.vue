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
          v-if="!readonly"
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
          <draggable
            :list="props.items"
            tag="tbody"
            handle=".handle"
            @change="change_sort"
          >
            <tr v-for="(item, index) in props.items" :key="`${item}-${index}`">
              <td>
                <v-checkbox
                  v-model="item.checked"
                  :true-value="1"
                  :false-value="0"
                  :ripple="false"
                  class="ma-0"
                  hide-details
                  :readonly="readonly"
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
                <v-select
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
                  @click="set_status(item.status)"
                  @change="change_status(item, $event)"
                >
                  <template v-slot:selection="data_status">
                    <div :style="`color: ${data_status.item.color}`">
                      {{ data_status.item.text }}
                    </div>
                  </template>
                  <template v-slot:item="data_status">
                    <div
                      :style="`color: ${data_status.item.color} !important`"
                      class="fs-13"
                    >
                      {{ data_status.item.text }}
                    </div>
                  </template>
                </v-select>
              </td>
              <td>
                <v-icon color="#3F69B8" small class="page__grab-icon handle">
                  mdi-arrow-all
                </v-icon>
              </td>
              <td>
                <div v-if="!readonly" class="d-flex">
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

    <add
      :open="add_room"
      :detail="detail"
      @toggle="add_room = !add_room"
      @add="add"
    />

    <edit
      :open="edit_room"
      :data="data_row"
      :detail="detail"
      @toggle="edit_room = !edit_room"
      @save="edit"
    />

    <yes-no-alert
      :open="open_change"
      alert-msg="Bạn có chắc chắn muốn thay đổi trạng thái không?"
      @toggle="toggle_change"
      @OK="update_status"
    />
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

import Add from '~/components/product-nha-cung-cap/edit/hotel/room/add'
import Edit from '~/components/product-nha-cung-cap/edit/hotel/room/edit'

export default {
  components: {
    Draggable,
    Add,
    Edit,
  },
  props: {
    data: {
      type: Array,
      default: Array,
    },
    detail: {
      type: Object,
      default: Object,
    },
    readonly: {
      type: Boolean,
      required: true,
    },
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
    open_change: false,
    status: 0,
    status_new: 0,
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
          width: 100,
        },
        { text: 'Trạng thái', sortable: false, value: 'status', width: 120 },
        { text: 'Sắp xếp', sortable: false, value: 'sort', width: 100 },
        { text: 'Hành động', sortable: false, value: 'actions', width: 50 },
      ]
    },
  },
  created() {
    this.items = this.items_default = [...this.data]
  },
  methods: {
    reset() {
      this.items = []
      this.items_default = []
      this.add_room = false
      this.edit_room = false
      this.disabled = true
      this.open_change = false
      this.status = 0
      this.status_new = 0
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
      this.$store
        .dispatch('nha_cung_cap_san_pham/room_delete', [this.data_row.id])
        .then((res) => {
          if (!res.error) {
            const arr = [...this.items]
            const arrDelete = []
            for (let i = 0; i < this.items.length; i++) {
              if (this.data_row.id === this.items[i].id) {
                arrDelete.push(this.items[i].id)
                arr.splice(i, 1)
              }
            }
            this.items = [...arr]
            this.$emit('delete', arrDelete)

            const arr1 = [...this.items_default]
            for (let i = 0; i < this.items_default.length; i++) {
              if (this.data_row.id === this.items_default[i].id) {
                arr1.splice(i, 1)
              }
            }
            this.items_default = [...arr1]
          }
        })
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
      const arrDelete = []

      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].checked === 0) {
          arr.push({ ...this.items[i] })
        } else if (this.items[i].checked === 1) {
          arrDelete.push(this.items[i].id)
        }
      }

      const arr2 = [...this.items_default]
      for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arrDelete.length; j++) {
          if (arr2[i].id === arrDelete[j].id) {
            arr2.splice(i, 1)
          }
        }
      }

      this.$store
        .dispatch('nha_cung_cap_san_pham/room_delete', [...arrDelete])
        .then((res) => {
          if (!res.error) {
            this.items = [...arr]
            this.items_default = [...arr2]
            this.$emit('delete', arrDelete)
          }
        })
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
    },
    set_status(status) {
      this.status = status
    },
    change_status(item, value) {
      this.data_row = item
      this.status_new = value
      this.open_change = true
    },
    toggle_change() {
      this.open_change = false
      const arr = [...this.items]

      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === this.data_row.id) {
          arr[i].status = this.status
        }
      }
      this.items = [...arr]
    },
    update_status() {
      const DATA = {
        hotel_id: this.detail.hotel.id,
        id: this.data_row.id,
        enable: this.data_row.enable,
        type_id: this.data_row.room_type_id,
        bed_type: this.data_row.bed_type,
        status: this.status_new,
        acreage: parseInt(this.data_row.acreage),
        number_adults: parseInt(this.data_row.number_adults),
        number_children: parseInt(this.data_row.number_children),
        room_number: parseInt(this.data_row.number_rooms),
        currency_id: parseInt(this.data_row.currency_id),
        price: parseInt(this.data_row.price_value),
      }

      this.$store
        .dispatch('nha_cung_cap_san_pham/room_edit', DATA)
        .then((res) => {
          if (!res.error) {
            const arr = [...this.items]

            for (let i = 0; i < arr.length; i++) {
              if (arr[i].id === this.data_row.id) {
                arr[i].status = this.status_new
              }
            }
            this.items = [...arr]

            for (let i = 0; i < this.items_default; i++) {
              if (this.items_default[i].id === this.data_row.id) {
                this.items_default[i].status = this.status_new
              }
            }
          }
        })
    },
    change_sort(object) {
      const arr = [...this.items]
      const DATA = []

      arr.splice(object.moved.oldIndex, 1)
      arr.splice(object.moved.newIndex, 0, object.moved.element)

      for (let i = 0; i < arr.length; i++) {
        DATA.push(arr[i].id)
      }

      this.$store
        .dispatch('nha_cung_cap_san_pham/room_sort', DATA)
        .then((res) => {
          if (!res.error) {
            this.items = [...arr]
          }
        })
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
