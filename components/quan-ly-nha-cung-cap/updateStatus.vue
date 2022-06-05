<template>
  <v-dialog
    :value="open"
    max-width="800px"
    @keydown="$event.key === 'Escape' && toggle()"
    @click:outside="toggle"
  >
    <v-card>
      <v-card-title class="d-flex justify-center">
        Cập nhật trạng thái
        <v-btn
          v-ripple
          color="secondary"
          icon
          class="position-absolute-top-right"
          @click="toggle"
        >
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row :style="update_status">
          <v-col cols="3">
            <v-card-text class="font-weight-bold">Trạng thái</v-card-text>
          </v-col>
          <v-col cols="6">
            <v-autocomplete
              v-model="status"
              class="pt-2"
              placeholder="Chọn trạng thái"
              :items="list"
              outlined
              dense
              @change="statusupdate(list, 1)"
              @click="statusupdate(list, 0)"
              @blur="statusupdate(list, 1)"
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
            <v-card-actions class="justify-center pt-0 pb-0">
              <v-btn
                min-width="120"
                class="text-none white--text mr-12"
                color="#FF0F59"
                depressed
                height="42"
                @click="OK"
              >
                {{ confirm }}
              </v-btn>

              <v-btn
                min-width="120"
                class="text-none white--text"
                color="primary"
                depressed
                height="42"
                @click="toggle"
              >
                {{ close }}
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    confirm: {
      type: String,
      default: 'Có',
    },
    close: {
      type: String,
      default: 'Không',
    },
  },

  data() {
    return {
      update_status: null,
      status: 1,
      list: [
        { value: 1, text: 'Đã duyệt', color: '#17e555' },
        {
          value: 2,
          text: 'Chưa phê duyệt',
          color: '#f5972d',
        },
        { value: 3, text: 'Từ chối', color: '#ff0f59' },
      ],
    }
  },

  methods: {
    statusupdate(value, number) {
      if (number === 0) {
        this.update_status = `margin-bottom: ${value.length * 30}px`
      } else {
        this.update_status = ''
      }
    },
    toggle() {
      this.$emit('toggle')
    },
    OK() {
      let hasErrors = false

      if (this.$isNullOrEmpty(this.status)) {
        hasErrors = true
        this.status_msg = 'Không được để trống'
      }
      if (!hasErrors) {
        this.$emit('OK', this.status)
      }
    },
  },
}
</script>
