import { RspButton } from './RspButton'
import { ScoreWidget } from './ScoreWidget'


function Footer({
  backClick = () => {},
  results, // ['win', 'lose', 'draw', undefined, indefinde]
}) {

  const invertResults = (results) => {
    return results.map(r => !r ? undefined : (r === 'win' ? 'lose' : (r === 'lose' ? 'win' : 'draw')))
  }

  return (
    <div className='footer-wrapper'>
      <div className='footer-btn-wrapper'>
        <div className='footer-btn'>
          <RspButton type='back' onClick={backClick} />
        </div>
      </div>
      <div className='footer-score-wrapper'>
        <div className='footer-score'>
          <div className='footer-score-title'>
            <svg viewBox="0 0 58 12">
              <text x="29" y="11" textAnchor="middle">You:</text>
            </svg>
          </div>
          <ScoreWidget outcomes={results} />
        </div>
        <div className='footer-score'>
          <div className='footer-score-title'>
            <svg viewBox="0 0 58 12">
              <text x="29" y="11" textAnchor="middle">Enemy:</text>
            </svg>
          </div>
          <ScoreWidget outcomes={invertResults(results)} />
        </div>
      </div>
    </div>
  )
}

export {
  Footer
}
