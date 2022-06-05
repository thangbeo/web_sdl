<template>
  <!-- 
  Cách dùng:
  - prop 'open' là giá trị đóng mở dialog (Boolean)
  - prop 'alertMsg' dùng để hiển thị câu hỏi của dialog (Number/String)
  - Event 'toggle' dùng để đóng hoặc mở dialog
  - Khi bấm OK sẽ emit event 'OK' và event 'toggle'
  - Khi bấm 'Hủy' sẽ emit event toggle
  -->
  <div>
    <v-dialog
      :value="open"
      max-width="641"
      @keydown="$event.key === 'Escape' && toggle()"
      @click:outside="toggle"
    >
      <v-card>
        <v-card-text class="py-0">
          <div
            style="min-height: 150px"
            class="fs-22 black--text font-weight-bold d-flex text-center align-center justify-center py-0"
          >
            {{ alertMsg }}
          </div>
        </v-card-text>
        <v-card-actions class="justify-center pt-0 pb-6">
          <v-btn
            min-width="120"
            class="text-none white--text mr-12"
            color="primary"
            depressed
            height="42"
            @click="OK"
          >
            {{ confirm }}
          </v-btn>

          <v-btn
            min-width="120"
            class="text-none white--text"
            color="#FF0F59"
            depressed
            height="42"
            @click="toggle"
          >
            {{ close }}
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
    alertMsg: {
      type: String,
      default: '',
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
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    OK() {
      this.$emit('toggle')
      this.$emit('OK')
    },
  },
}
</script>
