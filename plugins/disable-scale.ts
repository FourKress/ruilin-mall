// disable-scale.js
export default defineNuxtPlugin(() => {
  onNuxtReady(async () => {
    // 禁止双击缩放
    document.documentElement.addEventListener(
      'touchstart',
      function (event) {
        if (event.touches.length > 1) {
          event.preventDefault()
        }
      },
      {
        passive: false
      }
    )
    // 禁止双指缩放
    let lastTouchEnd = 0
    document.documentElement.addEventListener(
      'touchend',
      function (event) {
        const now = Date.now()
        if (now - lastTouchEnd <= 300) {
          event.preventDefault()
        }
        lastTouchEnd = now
      },
      { passive: false }
    )
  })
})
