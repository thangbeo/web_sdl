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
        <v-container class="py-0 px-7">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="posts_name"
                placeholder="Tên bài viết"
                class="border-1"
                solo
                flat
                dense
                hide-details
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="category_posts"
                :items="list_category"
                placeholder="Danh mục bài viết"
                class="border-1 fs-14"
                solo
                flat
                dense
                multiple
                hide-details
                clearable
              ></v-autocomplete>
            </v-col>

            <v-col cols="12">
              <v-autocomplete
                v-model="status"
                placeholder="Trạng thái"
                :items="list_status"
                class="border-1 fs-14"
                solo
                flat
                dense
                hide-details
                clearable
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
  components: {},
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    posts_name: '',
    category_posts: [],
    status: '',
    list_category: [],
    list_status: [
      { value: 1, text: 'Hiển thị', color: '#47BBFF' },

      { value: 0, text: 'Ẩn', color: '#ff0f59' },
    ],
  }),
  watch: {
    open(value) {
      if (value === true) {
        this.get_list()
      }
    },
  },
  methods: {
    clearSelected() {
      this.selected = null
    },
    get_list() {
      this.$store.dispatch('bai_viet/category_post', {}).then((response) => {
        if (!response.error) {
          response.data.data.map((item) => {
            this.list_category.push({
              text: item.tilte,
              value: item.category_post_id,
            })
          })
        }
      })
    },
    toggle() {
      this.$emit('toggle')
    },
    reset() {
      this.posts_name = null
      this.category_posts = []
      this.status = null
      this.$emit('toggle')
    },
    Save() {
      const data = {
        posts_name: this.$isNullOrEmpty(this.posts_name)
          ? ''
          : this.posts_name.trim(),
        category_posts: this.category_posts.join(),
        status: this.status,
      }
      this.$emit('filter', data)
      this.$emit('toggle')
    },
  },
}
</script>
