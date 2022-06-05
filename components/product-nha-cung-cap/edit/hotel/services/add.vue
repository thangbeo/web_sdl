<template>
  <Dialog
    :open="open"
    dialog-name="Thêm tiện ích"
    max_width="500"
    @toggle="toggle"
    @actionsUser="save"
  >
    <p class="mt-6 mb-0 fs-14 font-weight-bold">
      Tên tiện ích <span class="error--text ml-1">*</span>
    </p>
    <v-tabs v-model="tab">
      <v-tab
        v-for="(language, index) in languages"
        :key="`${index}-${language}`"
        class="text-none"
      >
        {{ language.name }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="(language, index) in languages"
        :key="`${index}-${language}`"
      >
        <v-text-field
          v-model="language.service"
          :error-messages="language.service_msg"
          class="border-1"
          solo
          flat
          dense
          @input="language.service_msg = []"
        >
        </v-text-field>
      </v-tab-item>
    </v-tabs-items>
  </Dialog>
</template>

<script>
import uniqid from 'uniqid'

import Dialog from '~/components/Dialog'

export default {
  components: {
    Dialog,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    languages: [],
    tab: null,
  }),
  watch: {
    open(value) {
      if (value) {
        this.tab = null

        const LANGUAGE = [...this.$store.state.app.languages]

        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            service: '',
            service_msg: [],
          }
        }
        this.languages = [...LANGUAGE]
      }
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    save() {
      let hasErrors = false
      // let count = 0

      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].service || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].service_msg = 'Không được để trống'
          this.tab = i
          // count += 1
        } else if (this.languages[i].service.length > 255) {
          hasErrors = true
          this.languages[i].service_msg = 'Không được vượt quá 255 ký tự'
          this.tab = i
        }
      }

      // if (count > 0) {
      //   this.$showWarnNotify(this, 'Vui lòng điền đầy đủ thông tin các tab')
      // }

      if (!hasErrors) {
        const arr = [...this.languages]
        const id = uniqid()

        for (let i = 0; i < arr.length; i++) {
          arr[i] = {
            id,
            name: arr[i].service,
            enable: 1,
            type: 0,
          }
        }

        this.$emit('save', arr)
      }
    },
  },
}
</script>
