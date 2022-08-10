import { Icon, List, Popup } from 'semantic-ui-react'

function AttributesHint({
  attributes
}) {
  return (
    <>
      {attributes && attributes.length > 0 ? (
        <Popup trigger={<Icon name='th list' />} flowing hoverable
        >
          <Popup.Header>Attributes</Popup.Header>
          <Popup.Content>
            <List>
              {attributes.map((a, i) => (
                <List.Item key={`attr-popup-${a.name}-${a.value}-${i}`}>
                  <List.Icon color={a.inInstance ? 'blue' : 'grey'} name='tag' />
                  <List.Content>
                    <AttributeView name={a.name} value={a.value} />
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </Popup.Content>
        </Popup>
      ) : null}
    </>
  )
}

function AttributeView({
  name,
  value
}) {
  const val = formatAttribute(value)
  return (
    <>
      <span style={{ fontWeight: 'bold', marginRight: '1em' }}>{name}</span>{val}
    </>
  )
}

function formatAttribute(value) {
  if (!value) return ''
  return 'Text' in value ? `"${value['Text']}"` : (value['Number'].numberValue + (value['Number'].numberMax ? '/' + value['Number'].numberMax : ''))
}

export {
  AttributesHint,
  formatAttribute,
}
