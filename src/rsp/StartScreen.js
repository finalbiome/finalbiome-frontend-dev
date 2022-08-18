import { AssetsWidgets } from './AssetsWidgets'
import { AssetWidget } from './AssetWidget'
import { Highscore } from './Highscore'
import { RspButton } from './RspButton'
import { Rules } from './Rules'


function StartScreen(props) {
  return (
    <div className='start-screen-wrapper screen-wrapper'>
      <AssetsWidgets />
      <div className='start-screen-main-section-wrapper'>
        <Highscore />
        <div className='start-screen-btn-wrapper'>
          <RspButton type='play' onClick={console.log} />
          <AssetWidget type='energy' value={99} viewBox={"0 0 20 20"} x={9}/>
        </div>
        <Rules />
      </div>
    </div>
  )
}

export {
  StartScreen
}
