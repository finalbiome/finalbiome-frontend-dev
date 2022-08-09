import { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { useSubstrateState } from '../substrate-lib'
import { NfaInstanceView } from './NfaInstanceView'

function NfaInstanceSelector({
  selectedNfaInstance,
  setSelectedNfaInstance,
  placeholder = 'Select NFA'
}) {
  const { api, currentAccount } = useSubstrateState()
  const [assetsIds, setAssetsIds] = useState([])
  const [instanceOptions, setInstanceOptions] = useState([])

  const handleChange = (e, { value }) => {setSelectedNfaInstance(assetsIds[value])}

  const getNfaIds = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.nonFungibleAssets.accounts.keys(currentAccount.address,
        keys => {
          const ids = keys.map(key => key.args.map(k => k.toJSON()));
          setAssetsIds(ids)
        })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(getNfaIds, [api, currentAccount])

  const fillOptions = () => {
    let options = assetsIds.map((id, idx) => {
      return {
        key: id,
        text: JSON.stringify([id[1], id[2]]),
        value: idx,
        content: (
          <NfaInstanceView nfaInstanceId={id} />
        ),
      }
    });
    setInstanceOptions(options)
  }
  useEffect(fillOptions, [assetsIds])

  return (
    <Dropdown
      placeholder={placeholder}
      fluid
      selection
      search
      clearable
      options={instanceOptions}
      // value={selectedNfaInstance}
      onChange={handleChange}
    />
  )
}

export {
  NfaInstanceSelector
}
