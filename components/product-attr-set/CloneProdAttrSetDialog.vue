<template>
  <v-dialog :value="value" max-width="800px" @input="toggle">
    <v-card>
      <v-card-title class="black--text font-weight-bold">
        Nhân bản thuộc tính {{ attrName }}
      </v-card-title>
      <v-card-text>
        <v-col cols="12" class="py-0">
          <p class="fs-16 black--text">
            {{
              $vuetify.lang.t(
                '$vuetify.productAttrSet.addPage.fields.attrSetName'
              )
            }}
            <span class="error--text ml-1">*</span>
          </p>
          <v-text-field
            v-model="name"
            autofocus
            :error-messages="nameErrors"
            :placeholder="
              $vuetify.lang.t(
                '$vuetify.productAttrSet.addPage.fields.attrSetName'
              )
            "
            class="border-1 fs-14"
            solo
            flat
            dense
            @input="nameErrors = []"
          >
          </v-text-field>
        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="text-none white--text mr-3"
          color="#656565"
          depressed
          width="90"
          @click="toggle(false)"
        >
          Hủy
        </v-btn>
        <v-btn
          class="text-none white--text"
          color="#47BBFF"
          dark
          depressed
          width="90"
          @click="validate"
        >
          Lưu
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CloneProdAttrSetDialog',
  props: {
    value: {
      type: Boolean,
      requried: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      name: '',
      nameErrors: [],
    }
  },
  computed: {
    attrName() {
      return this.item?.name
    },
  },
  methods: {
    toggle(value) {
      this.$emit('input', value)
    },
    validate() {
      let hasError = false
      if (!this.name || !this.name.trim()) {
        hasError = true
        this.nameErrors = ['Không được để trống']
      }

      if (!hasError) {
        this.cloneProdAttrSet()
      }
    },
    cloneProdAttrSet() {
      this.$emit('clone-prod-attr-set', {
        id: this.item.id,
        name: this.name.trim(),
      })
      this.toggle(false)
    },
  },
}
</script>
