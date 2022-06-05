<template>
  <div>
    <v-dialog
      :value="open"
      max-width="600px"
      @keydown="$event.key === 'Escape' && toggle()"
      @click:outside="toggle"
    >
      <v-card>
        <v-card-title class="pt-3 pb-1">Tìm kiếm nâng cao</v-card-title>
        <v-container class="py-0">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="customer"
                placeholder="Khách hàng"
                class="border-1 fs-14"
                solo
                flat
                dense
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="email"
                placeholder="Địa chỉ email"
                class="border-1 fs-14"
                solo
                flat
                dense
                multiple
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="phone"
                placeholder="Số điện thoại"
                class="border-1 fs-14"
                solo
                flat
                dense
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="choose_group"
                :items="items"
                placeholder="Nhóm người dùng"
                class="border-1 fs-14"
                solo
                flat
                dense
                hide-details
                clearable
              >
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions class="pt-6">
          <div class="flex-grow-1"></div>
          <v-btn depressed class="text-none error" width="90" @click="reset">
            <div class="font_size">Hủy</div>
          </v-btn>
          <v-btn
            depressed
            color="#47BBFF"
            class="text-none white--text mr-1"
            width="90"
            @click="Save"
          >
            <div class="font_size">Lưu</div>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    customer: '',
    phone: '',
    email: '',
    choose_group: null,
    items: [
      { value: 1, text: 'Người lớn' },
      { value: 2, text: 'Học sinh - Sinh viên' },
      { value: 3, text: 'Trẻ em' },
      { value: 4, text: 'Người cao tuổi' },
      { value: 5, text: 'Người có công' },
      { value: 6, text: 'Người địa phương' },
      { value: 7, text: 'Người nước ngoài' },
    ],
  }),
  methods: {
    clearSelected() {
      this.selected = null
    },
    toggle() {
      this.$emit('toggle')
    },
    reset() {
      this.customer = null
      this.email = null
      this.phone = null
      this.$emit('toggle')
    },
    Save() {
      const data = {
        customer: this.$isNullOrEmpty(this.customer)
          ? ''
          : this.customer.trim(),
        email: this.$isNullOrEmpty(this.email) ? '' : this.email.trim(),
        phone: this.$isNullOrEmpty(this.phone) ? '' : this.phone.trim(),
        group_id: this.choose_group,
      }

      this.$emit('filter', data)
      this.$emit('toggle')
    },
  },
}
</script>
