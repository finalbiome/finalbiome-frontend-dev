/* eslint-disable no-unused-vars */
import imgDefault from './assets/btn-start-default.svg'
import imgDefaultRed from './assets/btn-next-default.svg'
import imgActive from './assets/btn-start-active.svg'
import imgActiveRed from './assets/btn-next-active.svg'
import imgHover from './assets/btn-start-hover.svg'
import imgHoverRed from './assets/btn-next-hover.svg'
import playText from './assets/play-text.png'
import nextText from './assets/next-text.png'

function RspButton({
  caption = 'play',
  background = 'green',
  onClick,
  className
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
  const imgBgDefault = (background) => {
    switch (background) {
      case 'green':
        return imgDefault;
      case 'red':
        return imgDefaultRed
      default:
        return imgDefault;
    }
  }
  const imgBgHover = (background) => {
    switch (background) {
      case 'green':
        return imgHover;
      case 'red':
        return imgHoverRed
      default:
        return imgHover;
    }
  }
  const imgBgActive = (background) => {
    switch (background) {
      case 'green':
        return imgActive;
      case 'red':
        return imgActiveRed
      default:
        return imgActive;
    }
  }



  return (
    <div className={'rsp-button ' + className} onClick={(e) => onClick(e)}>
      <div className='caption-wrapper'>
        <img className='caption' src={imgText(caption)} alt={altText(caption)} />
      </div>
      <img className='rsp-button-default' src={imgBgDefault(background)} alt='' />
      <img className='rsp-button-active' src={imgBgHover(background)} alt='' />
      <img className='rsp-button-hover' src={imgBgActive(background)} alt='' />
    </div>
  )
}

export {
  RspButton
}
