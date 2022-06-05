<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      GetVideoThumbnailVideo: null,
      GetVideoThumbnailUrl: null,
      GetVideoThumbnailUrlResolve: null,
    }
  },
  methods: {
    downloadURI(uri, name) {
      // console.log('1')
      const link = document.createElement('a')
      link.download = name
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    timeupdate() {
      // console.log('2')
      const snapped = this.snapImage()
      if (snapped) {
        // console.log('3')
        this.GetVideoThumbnailVideo.removeEventListener(
          'timeupdate',
          this.timeupdate
        )
        this.GetVideoThumbnailVideo.pause()
        this.GetVideoThumbnailUrlResolve(snapped)
      }
    },

    snapImage() {
      // console.log('4')
      const canvas = document.createElement('canvas')
      canvas.width = this.GetVideoThumbnailVideo.videoWidth
      canvas.height = this.GetVideoThumbnailVideo.videoHeight
      canvas
        .getContext('2d')
        .drawImage(
          this.GetVideoThumbnailVideo,
          0,
          0,
          canvas.width,
          canvas.height
        )
      const image = canvas.toDataURL()
      const success = image.length > 100000

      if (success) {
        this.GetVideoThumbnailUrlResolve(image)
        URL.revokeObjectURL(this.GetVideoThumbnailUrl)
      }

      return success
    },

    getThumnail(files) {
      if (files.length) {
        return new Promise((resolve, reject) => {
          this.GetVideoThumbnailUrlResolve = resolve

          const file = files[0]

          const fileReader = new FileReader()
          if (file.type.match('image')) {
            fileReader.onload = () => {
              resolve(fileReader.result)
            }
            fileReader.readAsDataURL(file)
          } else {
            fileReader.onload = () => {
              const blob = new Blob([fileReader.result], { type: file.type })
              this.GetVideoThumbnailUrl = URL.createObjectURL(blob)

              this.GetVideoThumbnailVideo = document.createElement('video')

              this.GetVideoThumbnailVideo.addEventListener('loadeddata', () => {
                const snapped = this.snapImage()
                if (snapped) {
                  this.GetVideoThumbnailVideo.removeEventListener(
                    'timeupdate',
                    this.timeupdate
                  )
                  this.GetVideoThumbnailVideo.pause()
                }
              })

              this.GetVideoThumbnailVideo.addEventListener(
                'timeupdate',
                this.timeupdate
              )

              this.GetVideoThumbnailVideo.preload = 'metadata'

              this.GetVideoThumbnailVideo.src = this.GetVideoThumbnailUrl

              this.GetVideoThumbnailVideo.muted = true
              this.GetVideoThumbnailVideo.playsInline = true
              this.GetVideoThumbnailVideo.play()
            }

            fileReader.readAsArrayBuffer(file)
          }
        })
      } else {
        return false
      }
    },
  },
}
</script>
