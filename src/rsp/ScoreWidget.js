import dotWinImg from './assets/dot-win.svg'
import dotLoseImg from './assets/dot-lose.svg'
import dotDrawImg from './assets/dot-draw.svg'
import dotUndefImg from './assets/dot-undef.svg'

function ScoreWidget({
  outcomes = ['win', 'lose', 'draw', undefined, undefined]
}) {
  return (
    <div className='score-widget-wrapper'>
      <div className='score-widget'>
        {outcomes.map(o => (
          <ScoreDot outcome={o} />
        ))}
      </div>
    </div>
  )
}

function ScoreDot({
  outcome
}) {

  const dImage = (outcome => {
    switch (outcome) {
      case 'win':
        return dotWinImg;
      case 'lose':
        return dotLoseImg;
      case 'draw':
        return dotDrawImg;
      default:
        return dotUndefImg;
    }
  })

  return (
    <div className='score-dot-wrapper'>
        <img className='asset-widget-image' src={dImage(outcome)} alt={`Round ${outcome}`} />
    </div>
  )
}

export {
  ScoreWidget
}
