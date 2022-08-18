import titleImg from './assets/title.svg'
import scissorImg from './assets/scissors.svg'
import paperImg from './assets/paper.svg'
import { RspButton } from './RspButton'

function SplashScreen(props) {
  return (
    <div className='splash-wrapper screen-wrapper'>
      <div className='hands-wrapper'>
        <div className='left-hand-wrapper'>
          <img className='scissor' src={scissorImg} alt='' />
        </div>
        <div className='right-hand-wrapper'>
          <img className='paper' src={paperImg} alt='' />
        </div>
      </div>
      <img className='game-title' src={titleImg} alt='' />
      <RspButton className='start-button' onClick={console.log} />
    </div>
  )
}

export {
  SplashScreen
}
