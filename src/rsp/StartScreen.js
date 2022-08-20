import { AssetsWidgets } from './AssetsWidgets'
import { AssetWidget } from './AssetWidget'
import { Highscore } from './Highscore'
import { RspButton } from './RspButton'
import { Rules } from './Rules'


function StartScreen({
  setGameStatus,
  balances,
  price,
}) {

  const handlePlay = () => setGameStatus('playing')

  return (
    <div className='start-screen-wrapper screen-wrapper'>
      <AssetsWidgets value={balances} />
      <div className='start-screen-main-section-wrapper'>
        <Highscore value={balances.diamonds} />
        <div className='start-screen-btn-wrapper'>
          <RspButton type='play' onClick={handlePlay} />
          <AssetWidget type='energy' value={price} viewBox={"0 0 20 20"} x={9}/>
        </div>
        <Rules />
      </div>
    </div>
  )
}

export {
  StartScreen
}
