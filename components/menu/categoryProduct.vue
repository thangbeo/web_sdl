<template>
  <div>
    <v-row>
      <v-col cols="2">
        <p class="pt-5 fs-14 font-weight-bold">
          Chọn danh mục <span class="error--text">*</span>
        </p>
      </v-col>
      <v-col cols="10">
        <v-autocomplete
          v-model="add_Category"
          :items="list_add_Category"
          placeholder="Chọn danh mục"
          solo
          flat
          dense
          class="pt-3 border-1 fs-14"
          return-object
          item-value="ref_category_id"
          item-text="name"
          :error-messages="add_CategoryError"
          @input="add_CategoryError = []"
        >
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-col cols="12" class="pt-12 d-flex justify-end">
      <v-btn
        color="#FF0F59"
        width="90px"
        class="text-none white--text mr-3"
        depressed
        @click="toggle"
        >Hủy</v-btn
      >
      <v-btn
        class="white--text text-none"
        width="90px"
        color="#47BBFF"
        depressed
        @click="save"
        >Lưu</v-btn
      >
    </v-col>
  </div>
</template>

<script>
export default {
  props: {
    opencategorypost: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    add_Category: null,
    add_CategoryError: [],
    list_add_Category: [],
  }),
  watch: {
    open(value) {
      if (!value) {
        this.reset()
      }
    },
  },
  created() {
    this.getCategory()
  },
  methods: {
    getCategory() {
      this.$store
        .dispatch('danh_sach_menu/getCategory', {
          type_id: 2,
        })
        .then((res) => {
          if (!res.error) {
            this.list_add_Category = res.data.data
          }
        })
    },
    reset() {
      this.add_Category = null
      this.add_CategoryError = []
    },
    toggle() {
      this.$emit('toggle')
    },
    save() {
      let hasErrors = false
      let count = 0
      if (this.$isNullOrEmpty(this.add_Category)) {
        hasErrors = true
        this.add_CategoryError = ['Không được để trống']
        count += 1
      }
      if (count > 0) {
        this.$showWarnNotify(this, 'Bạn nhập thiếu thông tin bắt buộc')
      }
      if (!hasErrors) {
        this.Insert()
      }
    },
    Insert() {
      const data = {
        menu_id: this.$store.state.danh_sach_menu.menu_id,
        page_type: this.add_Category.category_type,
        page_id: this.add_Category.ref_category_id,
        page_name: '',
        page_link: '',
      }
      this.$store
        .dispatch('danh_sach_menu/insert', data)
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Thêm danh mục sản phẩm thành công')
            if (this.$isNullOrEmpty(this.$store.state.danh_sach_menu.menu_id)) {
              this.$store.commit(
                'danh_sach_menu/setMenuID',
                response.data.data.menu_id
              )
            }
            const DATA = {
              menu_id: response.data.data.menu_id,
              id: response.data.data.menu_detail_id,
              page_name: this.add_Category.name,
              parent_id: 0,
              level: 1,
            }
            this.$emit('add', DATA)
          }
        })
        .catch((e) => {
          this.$log.debug(e)
        })
        .finally(() => {})
    },
  },
}
</script>
