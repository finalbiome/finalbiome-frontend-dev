import { AssetsWidgets } from './AssetsWidgets'
import { ChooseSection } from './ChooseSection'
import { Footer } from './Footer'


function GameScreen(params) {
  return (
    <div className='game-screen-wrapper screen-wrapper'>
      <div className='game-screen-header'>
        <AssetsWidgets />
      </div>
      <div className='game-screen-main'>
        <ChooseSection />
      </div>
      <div className='game-screen-footer'>
        <Footer />
      </div>
    </div>
  )
}

export {
  GameScreen
}
