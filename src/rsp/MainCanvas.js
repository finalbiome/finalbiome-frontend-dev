/* eslint-disable no-unused-vars */
import backgroundImg from './assets/background.jpg'
import { ChooseButton } from './ChooseButton'
import { ChooseSection } from './ChooseSection'
import { FinalScreen } from './FinalScreen'
import { Footer } from './Footer'
import { GameScreen } from './GameScreen'
import { RspButton } from './RspButton'
import { SplashScreen } from './SplashScreen'
import { StartScreen } from './StartScreen'

function MainCanvas(params) {
  
  return (
    <div style={{
      width: '100%',
      position: 'relative',
      paddingTop: '56.25%',
      backgroundImage: `url(${backgroundImg})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      overflow: 'hidden',
    }}>
        <div
          style={{
            width: '100%',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          {/* <SplashScreen /> */}
          {/* <StartScreen /> */}
          <GameScreen />
          <FinalScreen />
        </div>
    </div>
  )
}

export {
  MainCanvas
}
