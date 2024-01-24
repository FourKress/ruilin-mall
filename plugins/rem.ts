// disable-scale.js
export default defineNuxtPlugin(() => {
  if (process.client) {
    // 屏幕适应
    ;(function (win, doc) {
      if (!win.addEventListener) return

      function setFont() {
        let screenWidth = document.querySelector('html')!.clientWidth
        const pageWidth = 390
        let fontSize = (screenWidth / pageWidth) * 100

        document.querySelector('html')!.style.fontSize = `${fontSize}px`
      }

      setFont()

      doc.addEventListener('DOMContentLoaded', setFont, false)
      win.addEventListener('resize', setFont, false)
    })(window, document)
  }
})
