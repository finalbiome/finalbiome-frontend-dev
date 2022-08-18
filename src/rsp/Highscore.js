import diamondImg from './assets/score-diamond.svg'

import { RspButton } from './RspButton'

function Highscore(props) {
  return (
    <div className='highscore-wrapper'>
      <div className='highscore-header'>
        <svg viewBox="0 0 66 20">
          <text x="0" y="15">Highscore</text>
        </svg>
      </div>
      <div className='highscore-name'>
        <svg viewBox="0 0 390 40">
          <text x="195" y="15" text-anchor="middle">Your name:</text>
          <text x="195" y="35" text-anchor="middle">5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY</text>
        </svg>
      </div>
      <div className='highscore-score-wrapper'>
        <div className='highscore-image-wrapper'>
          <img className='highscore-image' src={diamondImg} alt='' />
        </div>
        <div className='highscore-score'>
          <svg viewBox="0 0 30 12">
            <text x="0" y="11">658</text>
          </svg>
        </div>
      </div>
      <div className='highscore-button-wrapper'>
        <RspButton type='lb' onClick={console.log} />
      </div>
    </div>
  )
}

export {
  Highscore
}
