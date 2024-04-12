import videoJs from 'video.js'

const videoInit = () => {
  const videoElList = document.querySelectorAll('.my-video')
  videoElList.forEach((d) => {
    if (d.className.includes('banner-video')) {
      const bannerVideo = videoJs(d, {
        controls: true,
        muted: 'muted',
        autoplay: true,
        preload: 'auto',
        language: 'en',
        children: [
          'mediaLoader',
          'posterImage',
          'bigPlayButton',
          {
            name: 'controlBar',
            children: ['playToggle', 'fullscreenToggle']
          }
        ]
      })

      setTimeout(() => {
        bannerVideo.pause()
      }, 3000)
    }
    videoJs(d, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      language: 'en',
      children: [
        'mediaLoader',
        'posterImage',
        'bigPlayButton',
        {
          name: 'controlBar',
          children: ['playToggle', 'fullscreenToggle']
        }
      ]
    })
  })
}
export default videoInit
