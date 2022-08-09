import { useEffect, useState } from 'react'
import { Icon, Label } from 'semantic-ui-react'
import { useSubstrateState } from '../substrate-lib'
import { AttributesView } from './AttributesView'
import { BettorHint } from './BettorHint'
import { PurchasedHint } from './PurchasedHint'

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
      const attributes = []
      // fetch attributes from the class
      let attrKeysClass = await api.query.nonFungibleAssets.classAttributes.keys(classId)
      let attrKeys = attrKeysClass.map(key => key.args.map(k => k.toHuman()));
      let classAttrs = await api.query.nonFungibleAssets.classAttributes.multi(attrKeys);
      classAttrs.forEach((entry, idx) => {
        const attr = {
          name: attrKeys[idx][1],
          value: entry.toHuman(),
          inInstance: false
        }
        attributes.push(attr)
      })

      let attrKeysInstance = await api.query.nonFungibleAssets.attributes.keys(instanceId)
      attrKeys = attrKeysInstance.map(key => key.args.map(k => k.toHuman()))

      unsub = await api.query.nonFungibleAssets.attributes.multi(attrKeys,
        entries => {
          entries.forEach((entry, idx) => {
            const attr = {
              name: attrKeys[idx][1],
              value: entry.toHuman(),
              inInstance: true
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
      <AttributesView attributes={classAttributes} />
      <PurchasedHint classDetails={classDetails} />
      <BettorHint classDetails={classDetails} />
    </>
  )
}

export {
  NfaInstanceView
}
