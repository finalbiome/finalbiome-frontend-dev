import { AssetsWidgets } from './AssetsWidgets'
import { RspButton } from './RspButton'

import winImg from './assets/final-win.png'
import loseImg from './assets/final-lose.png'

import diamondImg from './assets/widget-diamond.png'
import energyImg from './assets/widget-energy.png'


function FinalScreen({
  result = 'win',
  score = [
    ['energy', 300],
    ['diamond', -40],
  ]
}) {

  const fImg = (result) => {
    switch (result) {
      case 'win':
        return winImg;
      case 'lose':
        return loseImg;
      case 'draw':
        return loseImg;
      default:
        return '';
    }
  }
  const sImg = (type) => {
    switch (type) {
      case 'diamond':
        return diamondImg;
      case 'energy':
        return energyImg;
      default:
        return '';
    }
  }
  const caption = (result) => {
    switch (result) {
      case 'win':
        return 'Greate! You win'
      case 'lose':
        return 'Oops! You lose'
      case 'draw':
        return 'Wow! Draw'
    
      default:
        return '';
    }
  }

  return (
    <div className='final-screen-wrapper screen-wrapper'>
      <div className='game-screen-header'>
        <AssetsWidgets />
      </div>
      <div className='final-screen-dialog-wrapper'>
        <div className='final-screen-dialog'>
          <div className='final-screen-dialog-icon'>
            <img className='final-screen-dialog-image' src={fImg(result)} alt='' />
          </div>
          <div className='final-screen-dialog-body'>
            <div className='final-screen-dialog-header'>
              <svg viewBox="0 0 120 20">
                <text x="60" y="15" text-anchor="middle">{caption(result)}</text>
              </svg>
            </div>
            <div className='final-screen-dialog-score'>
              {score.map(e => (
                <div className='final-screen-dialog-score-entity'>
                  <div className='final-screen-dialog-score-entity-image'>
                    <img className='entity-image' src={sImg(e[0])} alt='' />

                  </div>
                  <div className='final-screen-dialog-score-entity-text'>
                    <svg viewBox="0 0 35 20">
                      <text x="18" y="15" text-anchor="middle">{(e[1] > 0 ? '+' : '') + e[1].toString()}</text>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='final-screen-dialog-button'>
            <RspButton type='back' onClick={console.log} />
          </div>
        </div>
      </div>
    </div>
  )

}

export {
  FinalScreen
}