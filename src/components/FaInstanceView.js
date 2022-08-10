import { useEffect, useState } from 'react';
import { Icon, Label } from 'semantic-ui-react';
import { useSubstrateState } from '../substrate-lib';
import { TopUppedHint } from './TopUppedHint';

function FaInstanceView({
  faId,
}) {
  const { api, } = useSubstrateState()
  const [details, setDetails] = useState({})

  const fetchDetails = () => {
    if (!faId) return;

    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.fungibleAssets.assets(faId,
        entity => {
          if (entity.isSome) {
            const details = entity.unwrap().toHuman()
            setDetails(details)
          } else {
            setDetails({})
          }
        })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(fetchDetails, [api, faId])

  return (
    <Label>
      <Icon name='sun' />
      {details.name}
      <Label.Detail><Details details={details} /></Label.Detail>
    </Label>
  )
}

function Details({
  details,
}) {
  return (
    <>
      <TopUppedHint details={details} />
    </>
  )
}

export {
  FaInstanceView
}
