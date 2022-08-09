import { Icon, Popup } from 'semantic-ui-react'

function BettorHint({
  classDetails
}) {
  return (
    <>
      {classDetails.bettor ? (
        <Popup
          header={'Bettor'}
          trigger={<Icon name='gift' />}
          flowing hoverable
        />
      ) : null}
    </>
  )
}

export {
  BettorHint
}
