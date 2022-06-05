<template>
  <div>
    <v-row>
      <v-col cols="2">
        <p class="pt-5 fs-14 font-weight-bold">
          Tiêu đề <span class="error--text">*</span>
        </p>
      </v-col>
      <v-col cols="10">
        <v-text-field
          v-model="add_Title"
          placeholder="Nhập Tiêu đề"
          solo
          flat
          dense
          class="pt-3 border-1 fs-14"
          :error-messages="add_TitleError"
          @input="add_TitleError = []"
        >
        </v-text-field>
      </v-col>
      <v-col cols="2">
        <p class="pt-5 fs-14 font-weight-bold">
          Link <span class="error--text">*</span>
        </p>
      </v-col>
      <v-col cols="10">
        <v-text-field
          v-model="add_Link"
          placeholder="Nhập Link"
          solo
          flat
          dense
          class="pt-3 border-1 fs-14"
          :error-messages="add_LinkError"
          @input="check_url"
        >
        </v-text-field>
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
    add_Title: null,
    add_TitleError: [],
    add_Link: null,
    add_LinkError: [],
  }),
  watch: {
    open(value) {
      if (!value) {
        this.reset()
      }
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    reset() {
      this.add_Title = null
      this.add_TitleError = []
      this.add_Link = null
      this.add_LinkError = []
    },
    check_url() {
      this.add_LinkError = []
      if (this.$isNullOrEmpty(this.add_Link)) {
        this.add_LinkError = ['Không được để trống']
      } else if (
        this.$isHasVietnamese(this.add_Link) ||
        /\s/g.test(this.add_Link)
      ) {
        this.add_LinkError = ['Không đúng định dạng url']
      }
    },
    save() {
      let hasErrors = false
      let count = 0
      if (this.$isNullOrEmpty(this.add_Title)) {
        hasErrors = true
        this.add_TitleError = ['Không được để trống']
        count += 1
      }
      if (this.$isNullOrEmpty(this.add_Link)) {
        hasErrors = true
        this.add_LinkError = ['Không được để trống']
        count += 1
      } else if (
        this.$isHasVietnamese(this.add_Link) ||
        /\s/g.test(this.add_Link)
      ) {
        hasErrors = true
        this.add_LinkError = ['Không đúng định dạng url']
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
        page_type: 3,
        page_id: null,
        page_name: this.add_Title,
        page_link: this.add_Link,
      }
      this.$store
        .dispatch('danh_sach_menu/insert', data)
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Thêm danh mục link thành công')
            if (this.$isNullOrEmpty(this.$store.state.danh_sach_menu.menu_id)) {
              this.$store.commit(
                'danh_sach_menu/setMenuID',
                response.data.data.menu_id
              )
            }
            const DATA = {
              menu_id: response.data.data.menu_id,
              id: response.data.data.menu_detail_id,
              page_name: this.add_Title,
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
