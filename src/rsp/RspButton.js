/* eslint-disable no-unused-vars */
import imgDefault from './assets/btn-start-devault.svg'
import imgActive from './assets/btn-start-active.svg'
import imgHover from './assets/btn-start-hover.svg'
import playText from './assets/play-text.png'
import nextText from './assets/next-text.png'

function RspButton({
  caption = 'play',
  onClick
}) {

  const imgText = (caption) => {
    switch (caption) {
      case 'play':
        return playText;
      case 'next':
        return nextText
      default:
        return playText;
    }
  }
  const altText = (caption) => {
    switch (caption) {
      case 'play':
        return 'Play';
      case 'next':
        return 'Next'
      default:
        return 'Play';
    }
  }

  return (
    <div className='rsp-button' onClick={(e) => onClick(e)}>
      <div className='caption-wrapper'>
        <img className='caption' src={imgText(caption)} alt={altText(caption)} />
      </div>
      <img className='rsp-button-default' src={imgDefault} alt='' />
      <img className='rsp-button-active' src={imgActive} alt='' />
      <img className='rsp-button-hover' src={imgHover} alt='' />
    </div>
  )
}

export {
  RspButton
}
