import { Icon, Label, List, Popup } from 'semantic-ui-react'
import { AttributesHint } from './AttributesHint'

function PurchasedHint({
  classDetails
}) {
  const purchased = classDetails.purchased
  return (
    <>
      {purchased ? (
        <Popup trigger={<Icon name='tag' />} flowing hoverable
        >
          <Popup.Header>Purchased</Popup.Header>
          <Popup.Content>
            <List>
              {purchased.offers.map((o, i) => (
                <List.Item key={`attr-popup-${o.fa}-${o.price}-${i}`}>
                  <Label horizontal>
                    <Icon name='sun' />
                    {o.fa}
                  </Label>
                  <div style={{ display: 'inline-block' }}>
                    {o.price}
                    <AttributesHint attributes={o.attributes.map(a => { return { name: a.key, value: a.value, inInstance: true } })} />
                  </div>
                </List.Item>
              ))}
            </List>
          </Popup.Content>
        </Popup>
      ) : null}
    </>
  )
}

export {
  PurchasedHint
}
