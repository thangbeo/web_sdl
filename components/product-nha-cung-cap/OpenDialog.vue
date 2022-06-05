<template>
  <div>
    <v-dialog
      :value="open"
      max-width="700px"
      @keydown="$event.key === 'Escape' && toggle()"
      @click:outside="toggle"
    >
      <v-card>
        <v-card-title class="pt-3 pb-1">Tìm kiếm nâng cao</v-card-title>
        <v-container class="py-0">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="supplier"
                label="Nhà cung cấp"
                dense
                hide-details
                outlined
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="name"
                label="Tên sản phẩm"
                dense
                outlined
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="category"
                label="Danh mục sản phẩm"
                dense
                outlined
                hide-details
                clearable
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <v-select
                v-model="status"
                :items="list_status"
                outlined
                solo
                dense
                flat
                hide-details
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
              </v-select>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions class="pt-6">
          <div class="flex-grow-1"></div>
          <v-btn
            depressed
            color="#47BBFF"
            class="text-none white--text mr-1"
            width="90"
          >
            <div class="font_size">Lưu</div>
          </v-btn>
          <v-btn depressed class="text-none error" width="90" @click="toggle">
            <div class="font_size">Hủy</div>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    supplier: '',
    name: '',
    category: '',
    status: 0,
    list_status: [
      { value: 1, text: 'Đã duyệt', color: '#47bbff' },
      {
        value: 0,
        text: 'Chưa phê duyệt',
        color: '#f5972d',
      },
      { value: 2, text: 'Từ chối', color: '#ff0f59' },
    ],
  }),
  methods: {
    clearSelected() {
      this.selected = null
    },
    toggle() {
      this.$emit('toggle')
    },
  },
}
</script>
