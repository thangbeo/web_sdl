<template>
  <div v-if="checkRole()">
    <div style="background-color: #f4f7fe">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-col
              v-for="(item, index) in dataPermission"
              :key="index"
              cols="4"
              class="py-0 d-flex"
            >
              <div>
                <v-card-text>{{ item.page_name }}</v-card-text>
              </div>
              <v-spacer></v-spacer>
              <div>
                <v-switch
                  v-model="item.status"
                  color="#47bbff"
                  :false-value="0"
                  :true-value="1"
                  inset
                  @click="updatePermisson(item)"
                ></v-switch>
              </div>
            </v-col>
            <v-col cols="8"></v-col>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>
<script>
import Rules from '~/assets/configurations/Rules'
export default {
  data: () => ({
    Rules,
    dataPermission: [],
  }),
  mounted() {
    this.getlist()
    this.$store.commit('app/checkBack', false)
  },
  methods: {
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.SupplierDecentralization.id
      )
      return roles
    },
    updatePermisson(item) {
      this.$store
        .dispatch('phan_quyen_nha_cung_cap/update', {
          id: item.id,
          status: item.status,
        })
        .then((response) => {
          if (!response.error) {
            this.$showSuccess(this, 'Cập nhật quyền nhà cung cấp thành công')
          }
        })
    },
    getlist() {
      this.$store
        .dispatch('phan_quyen_nha_cung_cap/getlist')
        .then((response) => {
          if (!response.error) {
            this.dataPermission = response.data.data
          }
        })
    },
  },
  head() {
    this.$store.commit('app/setTitle', 'Phân quyền nhà cung cấp')
    return {
      title: 'Phân quyền nhà cung cấp',
    }
  },
}
</script>
