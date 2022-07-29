import { useEffect, useState } from 'react'
import { Icon, Label, List, Popup } from 'semantic-ui-react'
import { useSubstrateState } from '../substrate-lib'

function NfaInstanceView({
  nfaInstanceId
}) {
  const { api, } = useSubstrateState()
  const [classDetails, setClassDetails] = useState({})
  const [classAttributes, setClassAttributes] = useState([])

  const fetchClassDetails = () => {
    if (!nfaInstanceId) return;

    const classId = nfaInstanceId[1]

    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.nonFungibleAssets.classes(classId,
        entity => {
          if (entity.isSome) {
            const details = entity.unwrap().toHuman()
            setClassDetails(details)
          } else {
            setClassDetails({})
          }
        })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(fetchClassDetails, [api, nfaInstanceId])

  const fetchClassAttributes = () => {
    if (!nfaInstanceId) return;

    const classId = nfaInstanceId[1]
    const instanceId = nfaInstanceId[2]

    let unsub = null
    const asyncFetch = async () => {
      let attrKeysClass = await api.query.nonFungibleAssets.attributes.keys(classId, null)
      let attrKeys = attrKeysClass.map(key => key.args.map(k => k.toHuman()));
      let attrKeysInstance = await api.query.nonFungibleAssets.attributes.keys(classId, instanceId)
      attrKeys = [...attrKeys, ...attrKeysInstance.map(key => key.args.map(k => k.toHuman()))]
      const attributes = []

      unsub = await api.query.nonFungibleAssets.attributes.multi(attrKeys,
        entries => {
          entries.forEach((entry, idx) => {
            const attr = {
              name: attrKeys[idx][2],
              value: entry.toHuman(),
              inInstance: !!attrKeys[idx][1]
            }
            attributes.push(attr)
          })
          setClassAttributes(attributes)
        })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(fetchClassAttributes, [api, nfaInstanceId])

  return (
    <Label>
      <Icon name='diamond' />
      {classDetails.name}
      <Label.Detail><Details classDetails={classDetails} classAttributes={classAttributes} /></Label.Detail>
    </Label>
  )
}

function Details({
  classDetails,
  classAttributes
}) {
  return (
    <>
      <Attributes attributes={classAttributes} />
      <PurchasedHint classDetails={classDetails} />
      <BettorHint classDetails={classDetails} />
    </>
  )
}

function Attributes({
  attributes
}) {
  return (
    <>
      {attributes ? (
        <Popup
          trigger={<Icon name='th list' />}
        >
          <Popup.Header>Attributes</Popup.Header>
          <Popup.Content>
            <List>
              {attributes.map(a => (
                  <List.Item key={`attr-popup-${a.name}-${a.value}`}>
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
  const val = 'Text' in value ? value['Text'] : (value['Number'].numberValue + (value['Number'].numberMax ? '/' + value['Number'].numberMax : ''))
  return (
    <>
      <span style={{ fontWeight: 'bold', marginRight: '1em' }}>{name}</span>{val}
    </>
  )
}

function BettorHint({
  classDetails
}) {
  return (
    <>
      {classDetails.bettor ? (
        <Popup
          header={'Bettor'}
          trigger={<Icon name='gift' />}
        />
      ) : null}
    </>
  )
}
function PurchasedHint({
  classDetails
}) {
  return (
    <>
      {classDetails.purchased ? (
        <Popup
          header={'Purchased'}
          trigger={<Icon name='tag' />}
        />
      ) : null}
    </>
  )
}

export {
  NfaInstanceView
}
