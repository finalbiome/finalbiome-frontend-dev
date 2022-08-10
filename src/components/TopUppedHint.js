import { Icon, Label, Popup } from 'semantic-ui-react'


function TopUppedHint({
  details
}) {
  const topUpped = details.topUpped

  return (
    <>
    {topUpped ? (
      <Popup trigger={<Icon name='sync alternate' />} flowing hoverable
      >
        <Popup.Header>Top-up</Popup.Header>
        <Popup.Content>
          <Label>{topUpped.speed}</Label>
        </Popup.Content>
      </Popup>
    ) : null}
    </>
  )
  
}

export {
  TopUppedHint
}
