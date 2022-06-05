<template>
  <div>
    <dialog-content-full :open="open">
      <div class="d-flex">
        <div class="fs-18 ml-4 d-flex align-center font-weight-bold">
          <v-icon class="cp" size="26" color="black" @click="toggle">
            mdi-chevron-left
          </v-icon>
          Thêm phòng
        </div>
      </div>
      <v-row class="mt-2 mx-10">
        <v-col cols="12" class="py-0">
          <div class="d-flex align-center">
            <div class="fs-14 font-weight-bold mr-10">Hiển thị/ Ẩn</div>
            <v-switch
              v-model="hidden"
              color="#47bbff"
              :true-value="1"
              :false-value="0"
              inset
            />
          </div>
        </v-col>
        <v-col cols="12" class="py-0">
          <v-row>
            <v-col cols="4" class="py-0">
              <p class="ma-0 fs-14 font-weight-bold">
                Loại phòng <span class="error--text ml-1">*</span>
              </p>
              <v-autocomplete
                v-model="type_room"
                :items="list_type_room"
                :error-messages="type_room_msg"
                placeholder="Chọn loại phòng"
                class="border-1 fs-14"
                solo
                flat
                dense
                return-object
                @input="type_room_msg = []"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="4" class="py-0">
              <p class="ma-0 fs-14 font-weight-bold">
                Loại giường <span class="error--text ml-1">*</span>
              </p>
              <v-autocomplete
                v-model="type_bed"
                :items="list_type_bed"
                :error-messages="type_bed_msg"
                placeholder="Chọn loại giường"
                class="border-1 fs-14"
                solo
                flat
                dense
                @input="type_bed_msg = []"
              >
              </v-autocomplete>
            </v-col>
            <v-col cols="4" class="py-0">
              <p class="ma-0 fs-14 font-weight-bold">
                Trạng thái <span class="error--text ml-1">*</span>
              </p>
              <v-autocomplete
                v-model="status"
                :items="list_status"
                :error-messages="status_msg"
                placeholder="Chọn trạng thái"
                item-color="white"
                class="border-1 fs-14"
                solo
                flat
                dense
                @input="status_msg = []"
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
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="py-0">
          <v-row>
            <v-col cols="4" class="py-0">
              <p class="ma-0 fs-14 font-weight-bold">
                Diện tích <span class="error--text ml-1">*</span>
              </p>
              <v-text-field
                v-model="acreage"
                :error-messages="acreage_msg"
                type="number"
                placeholder="Mét vuông"
                solo
                flat
                dense
                @input="validate_number('acreage')"
              />
            </v-col>
            <v-col cols="4" class="py-0">
              <p class="ma-0 fs-14 font-weight-bold">
                Sức chứa <span class="error--text ml-1">*</span>
              </p>
              <v-text-field
                v-model="capacity_adults"
                :error-messages="capacity_adults_msg"
                type="number"
                placeholder="Người lớn"
                hint="Người lớn"
                :persistent-hint="capacity_adults_msg.length === 0"
                solo
                flat
                dense
                @input="validate_number('capacity_adults')"
              />
            </v-col>
            <v-col cols="4" class="py-0">
              <v-text-field
                v-model="capacity_child"
                :error-messages="capacity_child_msg"
                type="number"
                placeholder="Trẻ em dưới 4 tuổi"
                hint="Trẻ em < 4 tuổi"
                :persistent-hint="capacity_child_msg.length === 0"
                style="margin-top: 21px"
                solo
                flat
                dense
                @input="validate_number('capacity_child')"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="py-0">
          <v-row>
            <v-col cols="6" class="py-0">
              <p class="ma-0 fs-14 font-weight-bold">
                Số lượng phòng <span class="error--text ml-1">*</span>
              </p>
              <v-text-field
                v-model="room"
                :error-messages="room_msg"
                type="number"
                placeholder="Phòng"
                solo
                flat
                dense
                @input="validate_number('room')"
              />
            </v-col>
            <v-col cols="6" class="py-0">
              <p class="ma-0 fs-14 font-weight-bold">
                Giá <span class="error--text ml-1">*</span>
              </p>
              <div class="d-flex align-center w-100">
                <!--                <v-menu top disabled>-->
                <!--                  <template v-slot:activator="{ on, attrs }">-->
                <!--                    <v-btn-->
                <!--                      class="rounded-r-0 mb-7 pr-2"-->
                <!--                      color="#2F5EB5"-->
                <!--                      dark-->
                <!--                      depressed-->
                <!--                      v-bind="attrs"-->
                <!--                      v-on="on"-->
                <!--                    >-->
                <!--                      {{ currency.text }}-->
                <!--                      &lt;!&ndash;                      <v-icon>mdi-menu-down</v-icon>&ndash;&gt;-->
                <!--                    </v-btn>-->
                <!--                  </template>-->
                <!--                  <v-list dense>-->
                <!--                    <v-list-item-->
                <!--                      v-for="(money, i) in moneys"-->
                <!--                      :key="`${i}-${money.value}`"-->
                <!--                      @click="set_currency(money)"-->
                <!--                    >-->
                <!--                      <v-list-item-title>{{ money.text }}</v-list-item-title>-->
                <!--                    </v-list-item>-->
                <!--                  </v-list>-->
                <!--                </v-menu>-->

                <v-btn class="rounded-r-0 mb-7" color="#2F5EB5" dark depressed>
                  VND
                </v-btn>
                <v-text-field
                  v-model="price"
                  :error-messages="price_msg"
                  type="number"
                  placeholder="Nhập số tiền"
                  class="rounded-l-0"
                  solo
                  flat
                  dense
                  @input="validate_number('price')"
                />
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" class="py-0 d-flex justify-end">
          <v-btn
            color="error"
            class="text-none white--text mr-3"
            depressed
            width="90"
            @click="toggle"
          >
            Hủy
          </v-btn>
          <v-btn
            class="text-none white--text"
            color="#47BBFF"
            depressed
            width="90"
            @click="save"
          >
            Lưu
          </v-btn>
        </v-col>
      </v-row>
    </dialog-content-full>
  </div>
</template>

<script>
import uniqid from 'uniqid'

import DialogContentFull from '~/components/Dialog/FullContent'

export default {
  components: {
    DialogContentFull,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    hidden: 1,
    status: null,
    status_msg: [],
    list_status: [
      { value: 1, color: '#47BBFF', text: 'Còn phòng trống' },
      { value: 2, color: '#FEBA0F', text: '1 phòng duy nhất' },
      { value: 3, color: '#FF0F59', text: 'Hết phòng' },
    ],
    type_room: null,
    list_type_room: [],
    type_room_msg: [],
    type_bed: null,
    list_type_bed: [],
    type_bed_msg: [],
    acreage: null,
    acreage_msg: [],
    capacity_adults: null,
    capacity_adults_msg: [],
    capacity_child: null,
    capacity_child_msg: [],
    room: null,
    room_msg: [],
    currency: null,
    moneys: [],
    price: null,
    price_msg: [],
  }),
  watch: {
    open(value) {
      if (value) {
        const currencies = [...this.$store.state.app.currencies]
        const arr = []
        for (let i = 0; i < currencies.length; i++) {
          arr.push({
            value: currencies[i].id,
            text: currencies[i].code,
          })
        }
        this.moneys = [...arr]
        this.currency = arr[0]

        this.$store
          .dispatch('nha_cung_cap_san_pham/hotel_room_type')
          .then((res) => {
            if (!res.error) {
              const arr = []
              if ((res.data.data || []).length !== 0) {
                for (let i = 0; i < res.data.data.length; i++) {
                  arr.push({
                    value: res.data.data[i].id,
                    text: res.data.data[i].name,
                  })
                }
              }
              this.list_type_room = [...arr]
            }
          })

        this.$store
          .dispatch('nha_cung_cap_san_pham/hotel_bed_type')
          .then((res) => {
            if (!res.error) {
              const arr = []
              if ((res.data.data || []).length !== 0) {
                for (let i = 0; i < res.data.data.length; i++) {
                  arr.push({
                    value: res.data.data[i].id,
                    text: res.data.data[i].name,
                  })
                }
              }
              this.list_type_bed = [...arr]
            }
          })
      } else {
        this.reset()
      }
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    reset() {
      this.hidden = 1
      this.status = null
      this.status_msg = []
      this.type_room = null
      this.list_type_room = []
      this.type_room_msg = []
      this.type_bed = null
      this.list_type_bed = []
      this.type_bed_msg = []
      this.acreage = null
      this.acreage_msg = []
      this.capacity_adults = null
      this.capacity_adults_msg = []
      this.capacity_child = null
      this.capacity_child_msg = []
      this.room = null
      this.room_msg = []
      this.currency = null
      this.price = null
      this.price_msg = []
    },
    set_currency(value) {
      this.currency = value
    },
    validate_number(field) {
      if (this.$isNullOrEmpty(this[field]) || this[field] < 0) {
        this[`${field}_msg`] = 'Đơn vị không hợp lệ'
      } else {
        this[`${field}_msg`] = ''
      }
    },
    save() {
      let hasErrors = false

      if ((this.type_room || []).length === 0) {
        hasErrors = true
        this.type_room_msg = 'Không được để trống'
      }

      if ((this.type_bed || []).length === 0) {
        hasErrors = true
        this.type_bed_msg = 'Không được để trống'
      }

      if ((this.status || []).length === 0) {
        hasErrors = true
        this.status_msg = 'Không được để trống'
      }

      if (this.acreage <= 0) {
        hasErrors = true
        this.acreage_msg = 'Đơn vị không hợp lệ'
      }

      if (this.capacity_adults <= 0) {
        hasErrors = true
        this.capacity_adults_msg = 'Đơn vị không hợp lệ'
      }

      if (this.capacity_child < 0) {
        hasErrors = true
        this.capacity_child_msg = 'Đơn vị không hợp lệ'
      }

      if (this.room <= 0) {
        hasErrors = true
        this.room_msg = 'Đơn vị không hợp lệ'
      }

      if (this.price <= 0) {
        hasErrors = true
        this.price_msg = 'Đơn vị không hợp lệ'
      }

      if (!hasErrors) {
        const DATA = {
          id: uniqid(),
          enable: this.hidden,
          room_type_id: this.type_room.value,
          room_type_name: this.type_room.text,
          bed_type: this.type_bed,
          status: this.status,
          acreage: parseInt(this.acreage),
          number_adults: parseInt(this.capacity_adults),
          number_children: parseInt(
            !this.$isNullOrEmpty(this.capacity_child) ? this.capacity_child : 0
          ),
          number_rooms: parseInt(this.room),
          currency_id: parseInt(this.currency.value),
          currency_name: this.currency.text,
          price_value: parseInt(this.price),
        }
        this.$emit('add', DATA)
      }
    },
  },
}
</script>
