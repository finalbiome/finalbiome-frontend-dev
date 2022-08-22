/* eslint-disable no-unused-vars */
import handRockImg from './assets/hand-rock.svg'
import handPaperImg from './assets/hand-paper.svg'
import handScissorImg from './assets/hand-scissor.svg'
import { RspButton } from './RspButton';

function RoundSection({
  handPlayer = 'scissor',
  handFb = 'paper',
  wait = false,
  result = 'win',
  onClick,
}) {

  const getImg = (hand) => {
    if (wait) return handRockImg;
    switch (hand) {
      case 'rock':
        return handRockImg;
      case 'paper':
        return handPaperImg;
      case 'scissor':
        return handScissorImg;
      default:
        return handRockImg;
    }
  }

  const textResult = (result) => {
    switch (result) {
      case 'win':
        return 'You win!'
      case 'lose':
        return 'You lose!'
      case 'draw':
        return 'Draw!'

      default:
        return ''
    }
  }

  return (
    <div className='round-section-wrapper'>
      <div className='game-hands-wrapper'>
        <div className='left-hand-wrapper'>
          <img className={`game-shake game-${wait ? 'rock' : handPlayer}-left`} src={getImg(handPlayer)} alt=''
            style={{
              animationName: wait ? 'shake-left' : 'none',
              marginLeft: wait ? '-115%' : '-18%',
            }}
          />
        </div>
        <div className='right-hand-wrapper'>
          <img className={`game-shake game-${wait ? 'rock' : handFb}-right`} src={getImg(handFb)} alt=''
            style={{
              animationName: wait ? 'shake-right' : 'none',
            }}
          />
        </div>
      </div>
      <>
        {!wait ? (
          <div className='round-section-result-wrapper'>
            <div className='round-section-result-intermediate'>
              <div className='round-section-result-intermediate-header'>
                <svg viewBox="0 0 60 12">
                  <text x="30" y="11" textAnchor="middle">{textResult(result)}</text>
                </svg>
              </div>
              <div className='round-section-result-intermediate-button'>
                <RspButton type='next' onClick={onClick} />
              </div>
            </div>
            <div className='round-section-result-final'></div>
          </div>
        ) : null
        }
      </>

    </div>
  )
}

export {
  RoundSection
}
