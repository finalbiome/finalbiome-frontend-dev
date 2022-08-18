import { AssetsWidgets } from './AssetsWidgets'
import { Highscore } from './Highscore'


function StartScreen(props) {
  return (
    <div className='start-screen-wrapper screen-wrapper'>
      <AssetsWidgets />
      <Highscore />
    </div>
  )
}

export {
  StartScreen
}
