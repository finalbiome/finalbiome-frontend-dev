import chooseImgDefault from './assets/btn-choose-default.svg'
import chooseImgHover from './assets/btn-choose-hover.svg'
import chooseImgActive from './assets/btn-choose-active.svg'

import rockImg from './assets/btn-choose-rock.svg'
import paperImg from './assets/btn-choose-paper.svg'
import scissorImg from './assets/btn-choose-scissor.svg'

function ChooseButton({
  choseType = 'scissor'
}) {

  const tImage = (choseType) => {
    switch (choseType) {
      case 'rock':
        return rockImg;
      case 'paper':
        return paperImg;
      case 'scissor':
        return scissorImg;
    
      default:
        return scissorImg;
    }
  }
  return (
    <div className='choose-button-wrapper'>
      <div className='choose-button'>
        <img className='choose-button-type' src={tImage(choseType)} alt='' />
        <img className='choose-button-default' src={chooseImgDefault} alt='' />
        <img className='choose-button-hover' src={chooseImgHover} alt='' />
        <img className='choose-button-active' src={chooseImgActive} alt='' />
      </div>
    </div>

  )
}

export {
  ChooseButton
}
