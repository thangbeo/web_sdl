<template>
  <v-row>
    <v-col cols="12" class="py-0 d-flex">
      <p class="ma-0 fs-14 font-weight-bold">Tiện ích</p>
      <div class="flex-grow-1"></div>
      <v-btn
        v-if="!readonly"
        class="fs-13 text-none cp"
        color="#47BBFF"
        text
        @click="open_add = true"
      >
        <v-icon> mdi-plus </v-icon>
        Thêm tiện ích khác
      </v-btn>
    </v-col>
    <v-col v-for="(item, i) in list_default" :key="`${i}-${item.id}`" cols="2">
      <div v-if="item.type === 1" class="d-flex align-start">
        <v-checkbox
          v-model="item.enable"
          color="#47BBFF"
          :true-value="1"
          :false-value="0"
          :ripple="false"
          class="ma-0 pa-0"
          hide-details
          :readonly="readonly"
          @change="change_default"
        >
        </v-checkbox>
        <div class="fs-14">{{ item.name }}</div>
      </div>
      <div
        v-else
        class="d-flex align-start"
        @mousemove="hoverActions = item.id"
        @mouseleave="hoverActions = 0"
      >
        <v-checkbox
          v-model="item.enable"
          color="#47BBFF"
          :true-value="1"
          :false-value="0"
          :ripple="false"
          class="ma-0 pa-0"
          hide-details
          :readonly="readonly"
          @change="change_default"
        >
        </v-checkbox>
        <div class="fs-14">{{ item.name }}</div>
        <div v-if="hoverActions === item.id && !readonly" class="ml-1">
          <div class="cp" @click="edit_open(item)">
            <icon-edit />
          </div>
          <div class="cp" @click="delete_item(item)">
            <icon-close />
          </div>
        </div>
      </div>
    </v-col>

    <Add :open="open_add" @toggle="open_add = !open_add" @save="add" />

    <Edit
      :open="open_edit"
      :data="data"
      @toggle="open_edit = !open_edit"
      @save="edit"
    />
  </v-row>
</template>

<script>
import Add from '~/components/Product/edit/restaurant/services/add'
import Edit from '~/components/Product/edit/restaurant/services/edit'

export default {
  components: {
    Add,
    Edit,
  },
  props: {
    setData: {
      type: Array,
      required: true,
    },
    readonly: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    utilities: [],
    list_default: [],
    languages: [],
    hoverActions: 0,
    open_add: false,
    open_edit: false,
    data: [],
  }),
  created() {
    const arr = [...this.setData]
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].restaurantServices.length; j++) {
        arr[i].restaurantServices[j] = {
          id: j + 1,
          ...arr[i].restaurantServices[j],
        }
      }
      arr[i].item = [...arr[i].restaurantServices]
    }
    this.utilities = [...arr]
    this.list_default = arr[0].item
  },
  methods: {
    get_data() {
      this.$store
        .dispatch('product/hotel_convenient_services', {
          type: this.$store.state.app.product_type.restaurant,
        })
        .then((res) => {
          if (!res.error) {
            let arr = []
            if ((res.data.data || []).length !== 0) {
              arr = [...res.data.data]
              for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].item.length; j++) {
                  arr[i].item[j] = {
                    id: arr[i].item[j].id,
                    name: arr[i].item[j].name,
                    enable: 1,
                    type: 1,
                  }
                }
              }
              this.utilities = [...arr]
              this.list_default = arr[0].item
            }
          }
        })
    },
    change_default() {
      const arr = [...this.utilities]
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].item.length; j++) {
          arr[i].item[j] = {
            ...arr[i].item[j],
            enable: this.list_default[j].enable,
          }
        }
      }
      this.$emit('setData', this.utilities)
    },
    add(items) {
      this.open_add = false
      const arr = [...this.utilities]
      for (let i = 0; i < arr.length; i++) {
        arr[i].item.push({ ...items[i] })
      }
      this.utilities = [...arr]
      this.$emit('setData', this.utilities)
    },
    delete_item(item) {
      const arr = [...this.utilities]
      for (let i = 0; i < this.utilities.length; i++) {
        for (let j = 0; j < this.utilities[i].item.length; j++) {
          if (this.utilities[i].item[j].id === item.id) {
            arr[i].item.splice(j, 1)
          }
        }
      }
      this.utilities = [...arr]
      this.$emit('setData', this.utilities)
    },
    edit_open(item) {
      const arr = []
      for (let i = 0; i < this.utilities.length; i++) {
        for (let j = 0; j < this.utilities[i].item.length; j++) {
          if (this.utilities[i].item[j].id === item.id) {
            arr.push({ ...this.utilities[i].item[j] })
          }
        }
      }
      this.data = [...arr]
      this.open_edit = true
    },
    edit(items) {
      this.open_edit = false
      const arr = [...this.utilities]
      for (let i = 0; i < this.utilities.length; i++) {
        for (let j = 0; j < this.utilities[i].item.length; j++) {
          if (this.utilities[i].item[j].id === items[i].id) {
            this.utilities[i].item[j] = {
              ...this.utilities[i].item[j],
              name: items[i].name,
            }
          }
        }
      }
      this.utilities = [...arr]
      this.$emit('setData', this.utilities)
    },
  },
}
</script>

<style lang="scss" scoped>
.cp {
  cursor: pointer;
}
</style>
