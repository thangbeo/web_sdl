<template>
  <Dialog
    :open="open"
    :dialog-name="dialogName"
    @toggle="toggle"
    @actionsUser="save"
  >
    <v-row>
      <v-col class="pb-0" cols="12">
        <div class="ml-2">
          <p class="ma-0 fs-14 font-weight-bold">
            Hành trình <span class="error--text ml-1">*</span>
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
                v-model="language.journey"
                :error-messages="language.journey_msg"
                placeholder="Nhập các địa điểm tour đi qua"
                class="border-1"
                solo
                flat
                dense
                @input="language.journey_msg = []"
              >
              </v-text-field>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </v-col>
      <v-col class="pb-0" cols="12">
        <div class="ml-2">
          <p class="ma-0 fs-14 font-weight-bold">
            Lịch trình chi tiết <span class="error--text ml-1">*</span>
          </p>
          <v-tabs v-model="tab1">
            <v-tab
              v-for="(language, index) in languages"
              :key="`${index}-${language}`"
              class="text-none"
            >
              {{ language.name }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab1">
            <v-tab-item
              v-for="(language, index) in languages"
              :key="`${index}-${language}`"
            >
              <!--              <quill-editor-->
              <!--                ref="myTextEditor"-->
              <!--                v-model="language.detail"-->
              <!--                :options="$store.state.product.editorOption"-->
              <!--                class="quill-editor pb-12"-->
              <!--                @input="language.detail_msg = []"-->
              <!--              />-->
              <vue-editor
                v-model="language.detail"
                use-custom-image-handler
                @text-change="language.detail_msg = []"
              />
              <div
                v-if="language.detail_msg.length !== 0"
                class="v-messages theme--light error--text mt-1"
                role="alert"
              >
                <div class="v-messages__wrapper">
                  <div class="v-messages__message">Không được để trống</div>
                </div>
              </div>
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
              journey: '',
              journey_msg: [],
              detail: '',
              detail_msg: [],
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
      // let count = 0

      for (let i = 0; i < this.languages.length; i++) {
        if ((this.languages[i].journey || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].journey_msg = 'Không được để trống'
          this.tab = i
          // count += 1
        }
        if ((this.languages[i].detail || '').trim().length === 0) {
          hasErrors = true
          this.languages[i].detail_msg = 'Không được để trống'
          this.tab1 = i
          // count += 1
        }
      }

      // if (count > 0) {
      //   this.$showWarnNotify(this, 'Vui lòng điền đẩy đủ thông tin các tab')
      // }

      if (!hasErrors) {
        this.$emit('add', this.languages)
      }
    },
  },
}
</script>
