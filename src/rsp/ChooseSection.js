import { ChooseButton } from './ChooseButton'


function ChooseSection(params) {
  return (
    <div className='choose-section-wrapper'>
      <div className='choose-section-header'>
        <svg viewBox="0 0 49 12">
          <text x="0" y="11">Choose</text>
        </svg>
      </div>
      <div className='choose-section-chooser'>
        <ChooseButton choseType='scissor' />
        <ChooseButton choseType='paper' />
        <ChooseButton choseType='rock' />
      </div>
    </div>
  )
}

export {
  ChooseSection
}
