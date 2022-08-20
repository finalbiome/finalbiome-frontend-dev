import { ChooseButton } from './ChooseButton'


function ChooseSection({
  onClick
}) {
  return (
    <div className='choose-section-wrapper'>
      <div className='choose-section-header'>
        <svg viewBox="0 0 49 12">
          <text x="0" y="11">Choose</text>
        </svg>
      </div>
      <div className='choose-section-chooser'>
        <ChooseButton choseType='scissor' onClick={() => onClick('scissor')}/>
        <ChooseButton choseType='paper' onClick={() => onClick('paper')}/>
        <ChooseButton choseType='rock' onClick={() => onClick('rock')}/>
      </div>
    </div>
  )
}

export {
  ChooseSection
}
