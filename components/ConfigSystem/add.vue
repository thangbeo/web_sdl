<template>
  <Dialog
    :open="open"
    :dialog-name="dialogName"
    max_width="600"
    @toggle="toggle"
    @actionsUser="save"
  >
    <v-row>
      <v-col class="pb-0" cols="12">
        <div class="ml-2">
          <p class="ma-0 fs-14 font-weight-bold">
            Giá trị <span class="error--text ml-1">*</span>
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
                v-model="language.config"
                :error-messages="language.config_msg"
                placeholder="Nhập giá trị"
                class="border-1"
                solo
                flat
                dense
                @input="language.config_msg = []"
              >
              </v-text-field>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </v-col>
    </v-row>
  </Dialog>
</template>

<script>
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
    dialogName: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    tab: null,
    tab1: null,
    languages: [],
  }),
  watch: {
    open(val) {
      if (!val) {
        this.tab = null
        this.tab1 = null
      } else {
        const LANGUAGE = [...this.$store.state.app.languages]
        if ((LANGUAGE || []).length !== 0) {
          for (let i = 0; i < LANGUAGE.length; i++) {
            LANGUAGE[i] = {
              ...LANGUAGE[i],
              config: '',
              config_msg: [],
            }
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

      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].config || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].config_msg = 'Không được để trống'
          this.tab = i
        }
      }

      if (!hasErrors) {
        this.$emit('add', this.languages)
      }
    },
  },
}
</script>
