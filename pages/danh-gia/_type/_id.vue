<template>
  <div v-if="checkRole()">
    <edit
      v-if="open_add == 2"
      :data="detail"
      :comment="comment_type"
      @toggle="toggle"
      @OK="toggle"
    >
    </edit>
    <yes-no-alert
      :open="open_confirm"
      alert-msg="Bạn chắc chắn muốn thoát không?"
      @toggle="open_confirm = !open_confirm"
      @OK="toggle"
    />
  </div>
</template>

<script>
import edit from '~/components/danh-gia/edit'
import Rules from '~/assets/configurations/Rules'

export default {
  components: {
    edit,
  },
  data: () => ({
    Rules,
    open_add: 0,
    detail: {},
    title: 'Chi tiết đánh giá',
    open_confirm: false,
    page: 1,
    pageSize: 50,
    comment_type: null,
  }),
  watch: {
    '$store.state.app.change_back'(value) {
      this.open_confirm = true
    },
  },
  mounted() {
    let reviewId = 0
    let commentType = 0
    if ((this.$route.params || '').length !== 0) {
      reviewId = Number(this.$route.params.id)
      commentType = Number(this.$route.params.type)
    }
    this.$store
      .dispatch('danh_gia/detail', {
        page_index: this.page,
        page_size: this.pageSize,
        id: reviewId,
        type: commentType,
      })
      .then((res) => {
        if (!res.error) {
          this.comment_type = commentType
          this.detail = res.data.data
          this.set_title(res.data.data.commentGetLists)
          this.$store.commit('app/checkBack', true)
          this.open_add = 2
        }
      })
  },
  methods: {
    checkRole() {
      const roles = this.$isAccessAction(
        this.$store.state.app.roles,
        Rules.System.Evaluate.id
      )
      return roles
    },
    toggle() {
      this.$router.push('/danh-gia')
    },
    set_title(item) {
      this.$store.commit('app/setTitle', `Chi tiết đánh giá`)
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>
