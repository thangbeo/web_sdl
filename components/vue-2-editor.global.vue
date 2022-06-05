<template>
  <client-only>
    <vue-editor
      :id="id"
      v-model="data_editor"
      :editor-toolbar="customToolbar"
      :disabled="disabled"
      use-custom-image-handler
      @text-change="textChange"
    />
  </client-only>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      default: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    customToolbar: [
      // font size
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      // text direction
      [
        {
          size: [
            '6px',
            '8px',
            '10px',
            '12px',
            '14px',
            '16px',
            '18px',
            '20px',
            '24px',
            '30px',
            '32px',
            '36px',
          ],
        },
      ],
      ['bold', 'italic', 'underline', 'strike'],
      // Bold, italic, underline, strikethrough
      ['blockquote', 'code-block'],
      // Reference, code block
      [{ header: 1 }, { header: 2 }],
      // Title, the form of key-value pairs; 1, 2 represents the font size
      [{ list: 'ordered' }, { list: 'bullet' }],
      // list
      [{ script: 'sub' }, { script: 'super' }],
      // superscript and subscript
      [{ indent: '-1' }, { indent: '+1' }],
      // indent
      [{ direction: 'rtl' }],
      // Several levels of title
      [{ color: [] }, { background: [] }],
      // font color, font background color
      [{ font: [] }],
      // font
      [{ align: [] }],
      // alignment
      ['clean'],
      // Clear font style
      ['image', 'video'],
      // Upload pictures, upload videos
    ],
    editorSettings: {
      modules: {
        Size: true,
      },
    },
    data_editor: '',
  }),
  created() {
    this.data_editor = this.data
  },
  methods: {
    textChange(e) {
      this.$emit('text-change', this.data_editor)
    },
  },
}
</script>

<style lang="scss">
.ql-snow {
  .ql-picker {
    &.ql-size {
      .ql-picker-label,
      .ql-picker-item {
        &::before {
          content: attr(data-value) !important;
        }
      }
    }
  }
}
.ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
  max-height: 200px;
  overflow-x: auto;
}
</style>
