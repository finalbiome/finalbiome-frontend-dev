/* eslint-disable no-unused-vars */
import imgPlayDefault from './assets/btn-play-default.png'
import imgPlayHover from './assets/btn-play-hover.png'
import imgPlayActive from './assets/btn-play-active.png'

import imgNextDefault from './assets/btn-next-default.png'
import imgNextHover from './assets/btn-next-hover.png'
import imgNextActive from './assets/btn-next-active.png'

import imgLbDefault from './assets/btn-lb-default.png'
import imgLbHover from './assets/btn-lb-hover.png'
import imgLbActive from './assets/btn-lb-active.png'

import imgBackDefault from './assets/btn-back-default.png'
import imgBackHover from './assets/btn-back-hover.png'
import imgBackActive from './assets/btn-back-active.png'

function RspButton({
  type = 'play',
  onClick,
  className =''
}) {
  const altText = (type) => {
    switch (type) {
      case 'play':
        return 'Play';
      case 'next':
        return 'Next'
      case 'lb':
        return "Leaderboard"
      case 'back':
        return 'Back'
      default:
        return 'Play';
    }
  }
  const imgBgDefault = (type) => {
    switch (type) {
      case 'play':
        return imgPlayDefault;
      case 'next':
        return imgNextDefault
      case 'lb':
        return imgLbDefault
      case 'back':
        return imgBackDefault
      default:
        return imgPlayDefault;
    }
  }
  const imgBgHover = (type) => {
    switch (type) {
      case 'play':
        return imgPlayHover;
      case 'next':
        return imgNextHover
      case 'lb':
        return imgLbHover
      case 'back':
        return imgBackHover
      default:
        return imgPlayHover;
    }
  }
  const imgBgActive = (type) => {
    switch (type) {
      case 'play':
        return imgPlayActive;
      case 'next':
        return imgNextActive
      case 'lb':
        return imgLbActive
      case 'back':
        return imgBackActive
      default:
        return imgPlayActive;
    }
  }

  return (
    <div className={'rsp-button ' + className} onClick={(e) => onClick(e)}>
      <img className='rsp-button-default' src={imgBgDefault(type)} alt={altText(type)} />
      <img className='rsp-button-hover' src={imgBgHover(type)} alt={altText(type)} />
      <img className='rsp-button-active' src={imgBgActive(type)} alt={altText(type)} />
    </div>
  )
}

export {
  RspButton
}
