<template>
  <v-col class="py-0" cols="11">
    <div class="fs-14 font-weight-bold d-flex align-center mb-2">
      Lịch trình<span class="error--text mx-1">*</span>
      <div class="flex-grow-1"></div>
      <v-btn
        color="#47BBFF"
        class="text-none white--text"
        small
        depressed
        @click="open_add = true"
      >
        <!-- :disabled="check_disable" -->
        Thêm ngày
      </v-btn>
    </div>
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
        <v-data-table
          :headers="headers"
          :items="language.list"
          fixed-header
          disable-pagination
          hide-default-footer
          :disable-sort="true"
          loading-text="Xin chờ..."
          no-results-text="Không có kết quả phù hợp"
          no-data-text="Không có dữ liệu"
          class="elevation-0"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <div class="d-flex">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div
                    class="ml-2"
                    v-bind="attrs"
                    v-on="on"
                    @click="quest_delete(item)"
                  >
                    <icon-delete />
                  </div>
                </template>
                <span>Xóa</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div
                    class="ml-2"
                    v-bind="attrs"
                    v-on="on"
                    @click="quest_edit(item)"
                  >
                    <icon-edit />
                  </div>
                </template>
                <span>Cập nhật</span>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>

    <yes-no-alert
      :open="open_delete"
      :alert-msg="alertdelete"
      @toggle="open_delete = !open_delete"
      @OK="confirm_delete"
    />

    <Add
      :open="open_add"
      :dialog-name="`NGÀY`"
      @toggle="open_add = !open_add"
      @add="set_data_add"
    />
    <Edit
      :open="open_edit"
      :dialog-name="`NGÀY`"
      :data="data_row"
      @toggle="open_edit = !open_edit"
      @edit="set_data_edit"
    />
  </v-col>
</template>

<script>
import Add from '~/components/product-nha-cung-cap/tour/schedule/add'
import Edit from '~/components/product-nha-cung-cap/tour/schedule/edit'

export default {
  components: {
    Add,
    Edit,
  },
  // props: {
  //   check: {
  //     type: Object,
  //     default: Object,
  //   },
  // },
  data: () => ({
    tab: null,
    data_row: {},
    open_add: false,
    open_edit: false,
    open_delete: false,
    alertdelete: '',
    languages: [],
    // check_disable: false,
  }),
  computed: {
    headers() {
      return [
        { text: 'Ngày', value: 'day', width: '15%' },
        { text: 'Hành trình', value: 'journeys', width: '70%' },
        { text: 'Hành động', value: 'actions', width: '15%' },
      ]
    },
  },
  // watch: {
  //   check(value) {
  //     if ((this.languages[0].list || []).length >= this.setValue(value)) {
  //       this.check_disable = true
  //     } else {
  //       this.check_disable = false
  //     }
  //   },
  // },
  created() {
    this.set_list()
  },
  methods: {
    // setValue(object) {
    //   if (object.times === 1) {
    //     return 1
    //   } else if (object.times === 2) {
    //     return 2
    //   } else if (object.times === 3) {
    //     if (parseInt(object.daytime) - parseInt(object.night) > 0) {
    //       return parseInt(object.daytime)
    //     } else {
    //       return parseInt(object.night)
    //     }
    //   } else return 0
    // },
    set_list() {
      const LANGUAGE = [...this.$store.state.app.languages]

      if ((LANGUAGE || []).length !== 0) {
        for (let i = 0; i < LANGUAGE.length; i++) {
          LANGUAGE[i] = {
            ...LANGUAGE[i],
            list: [],
          }
        }
      }
      this.languages = [...LANGUAGE]
    },
    quest_delete(item) {
      this.data_row = item
      this.alertdelete =
        'Bạn chắc chắn muốn xóa lịch trình ngày "' + item.day + '" này?'
      this.open_delete = true
    },
    confirm_delete() {
      const arr = [...this.languages]
      for (let i = 0; i < arr.length; i++) {
        // if (arr[i].name === this.data_row.name) {
        for (let j = 0; j < arr[i].list.length; j++) {
          if (arr[i].list[j].day === this.data_row.day) {
            arr[i].list.splice(j, 1)
          }
        }
        // }
      }
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].list.length; j++) {
          arr[i].list[j].day = j + 1
        }
      }
      this.languages = [...arr]
      this.$emit('set_data', this.languages)
      // if (this.setValue(this.check) < (this.languages[0].list || []).length) {
      //   this.check_disable = false
      // }
    },
    quest_edit(item) {
      this.data_row = item
      this.open_edit = true
    },
    reset() {
      this.tab = null
      this.set_list()
    },
    set_data_add(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].name === this.languages[i].name) {
          const arr = [
            ...this.languages[i].list,
            {
              day: i + 1,
              name: this.languages[i].name,
              journeys: data[i].journey,
              journey_msg: [],
              detail: data[i].detail,
              detail_msg: [],
            },
          ]

          for (let i = 0; i < arr.length; i++) {
            arr[i] = { ...arr[i], day: i + 1 }
          }
          this.languages[i].list = [...arr]
        }
      }
      this.$emit('set_data', this.languages)
      // check validate
      // if ((this.languages[0].list || []).length >= this.setValue(this.check)) {
      //   this.check_disable = true
      // }
    },
    set_data_edit(data) {
      const arr = [...this.languages]
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].list.length; j++) {
          if (arr[i].list[j].day === data.day && arr[i].name === data.name) {
            arr[i].list[j] = {
              ...data,
            }
            this.languages[i].list = [...arr[i].list]
          }
        }
      }
      this.languages = [...arr]
      this.$emit('set_data', this.languages)
    },
  },
}
</script>
