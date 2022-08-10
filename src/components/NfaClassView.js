import { useEffect, useState } from 'react'
import { Icon, Label } from 'semantic-ui-react'
import { useSubstrateState } from '../substrate-lib'
import { AttributesHint } from './AttributesHint'
import { BettorHint } from './BettorHint'
import { PurchasedHint } from './PurchasedHint'

function NfaClassView({
  nfaClassId
}) {
  const { api, } = useSubstrateState()
  const [classDetails, setClassDetails] = useState({})
  const [classAttributes, setClassAttributes] = useState([])
  const [attrCount, setAttrCount] = useState(0)


  const fetchClassDetails = () => {
    if (!nfaClassId) return;

    const classId = nfaClassId

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
  useEffect(fetchClassDetails, [api, nfaClassId])

  const fetchClassAttributes = () => {
    if (!nfaClassId) return;

    const classId = nfaClassId

    let unsub = null
    const asyncFetch = async () => {
      // fetch attributes from the class
      let attrKeysClass = await api.query.nonFungibleAssets.classAttributes.keys(classId)
      let attrKeys = attrKeysClass.map(key => key.args.map(k => k.toHuman()));
      unsub = await api.query.nonFungibleAssets.classAttributes.multi(attrKeys, entries => {
        setClassAttributes(entries.filter(e => e.isSome).map((entry, idx) => {
            return {
              name: attrKeys[idx][1],
              value: entry.toHuman(),
              inInstance: false
            }
          })
        )
      });
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(fetchClassAttributes, [api, nfaClassId, attrCount])

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
      <AttributesHint attributes={classAttributes} />
      <PurchasedHint classDetails={classDetails} />
      <BettorHint classDetails={classDetails} />
    </>
  )
}

export {
  NfaClassView
}
