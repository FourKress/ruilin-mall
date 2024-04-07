import videoJs from 'video.js'

const videoInit = () => {
  const videoElList = document.querySelectorAll('.my-video')
  console.log(videoElList)
  videoElList.forEach((d) => {
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
