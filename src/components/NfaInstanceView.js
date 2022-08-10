import { useEffect, useState } from 'react'
import { Icon, Label } from 'semantic-ui-react'
import { useSubstrateState } from '../substrate-lib'
import { AttributesHint } from './AttributesHint'
import { BettorHint } from './BettorHint'
import { PurchasedHint } from './PurchasedHint'

function NfaInstanceView({
  nfaInstanceId
}) {
  const { api, } = useSubstrateState()
  const [classDetails, setClassDetails] = useState({})
  const [classAttributes, setClassAttributes] = useState([])
  const [attrCount, setAttrCount] = useState(0)
  const [instanceAttributes, setInstanceAttributes] = useState([])

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
            setAttrCount(details.attributes)
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

    let unsub = null
    const asyncFetch = async () => {
      // fetch attributes from the class
      let attrKeysClass = await api.query.nonFungibleAssets.classAttributes.keys(classId)
      let attrKeys = attrKeysClass.map(key => key.args.map(k => k.toHuman()));
      unsub = await api.query.nonFungibleAssets.classAttributes.multi(attrKeys, entities => {
        setClassAttributes(entities.filter(e => e.isSome).map((entry, idx) => {
            return {
              name: attrKeys[idx][1],
              value: entry.toHuman(),
              inInstance: false
            }
          })
        );
      })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(fetchClassAttributes, [api, nfaInstanceId, attrCount])

  const fetchInstanceAttributes = () => {
    if (!nfaInstanceId) return;
    const instanceId = nfaInstanceId[2]

    let unsub = null
    const asyncFetch = async () => {

      let attrKeysInstance = await api.query.nonFungibleAssets.attributes.keys(instanceId)
      let attrKeys = attrKeysInstance.map(key => key.args.map(k => k.toHuman()))

      unsub = await api.query.nonFungibleAssets.attributes.multi(attrKeys, entries => {
        setInstanceAttributes(entries.filter(e => e.isSome).map((entry, idx) => {
            return {
              name: attrKeys[idx][1],
              value: entry.toHuman(),
              inInstance: true
            }
          })
        );
      })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(fetchInstanceAttributes, [api, nfaInstanceId, classAttributes])

  return (
    <Label>
      <Icon name='diamond' />
      {classDetails.name}
      <Label.Detail><Details classDetails={classDetails} attributes={[...classAttributes, ...instanceAttributes]} /></Label.Detail>
    </Label>
  )
}

function Details({
  classDetails,
  attributes
}) {
  return (
    <>
      <AttributesHint attributes={attributes} />
      <PurchasedHint classDetails={classDetails} />
      <BettorHint classDetails={classDetails} />
    </>
  )
}

export {
  NfaInstanceView
}
