import rulesImg from './assets/rules.svg'

function Rules(params) {
  return (
    <div className='rules-wrapper'>
      <div className='rules-header'>
        <svg viewBox="0 0 36.5 20">
          <text x="0" y="15">Rules</text>
        </svg>
      </div>
      <div className='rules-image-wrapper'>
        <img className='rules-image' src={rulesImg} alt={'Rules'} />
      </div>
    </div>
  )
}

export {
  Rules
}
