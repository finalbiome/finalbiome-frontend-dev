import diamondImg from './assets/score-diamond.svg'

import { RspButton } from './RspButton'

function Highscore({
  value = 658
}) {
  return (
    <div className='highscore-wrapper'>
      <div className='highscore-header'>
        <svg viewBox="0 0 66 20">
          <text x="0" y="15">Highscore</text>
        </svg>
      </div>
      <div className='highscore-name'>
        <svg viewBox="0 0 390 40">
          <text x="195" y="15" textAnchor="middle">Your name:</text>
          <text x="195" y="35" textAnchor="middle">5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY</text>
        </svg>
      </div>
      <div className='highscore-score-wrapper'>
        {/* <div className='highscore-image-wrapper'> */}
          {/* <img className='highscore-image' src={diamondImg} alt='' /> */}
        {/* </div> */}
        <div className='highscore-score'>
          {/* <svg viewBox="0 0 30 12">
            <text x="0" y="11">{value}</text>
          </svg> */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 20" version="1.1">
            <image x="0" y="0" width="20" height="20" href={diamondImg} />
            <text x="25" y="15">{value}</text>
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
