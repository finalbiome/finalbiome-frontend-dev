import { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { useSubstrateState } from '../substrate-lib'
import { FaInstanceView } from './FaInstanceView'

function FaSelector({
  selectedFa,
  setSelectedFa,
  placeholder='Select FA'
}) {
  const { api, } = useSubstrateState()
  const [assetOptions, setAssetOptions] = useState([])
  const [assetIds, setAssetIds] = useState([])

  const handleChange = (e, { value }) => setSelectedFa(value)

  const fetchAllFaIds =() => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.fungibleAssets.assets.keys(
        keys => {
          setAssetIds(keys.map(k => k.toHuman()[0]))
        })
    }
    asyncFetch()
    return () => {unsub && unsub()}
  }
  useEffect(fetchAllFaIds, [api])

  const fillOptions = () => {
    setAssetOptions(assetIds.map(a => {
      return {
        key: a,
        value: a,
        text: a,
        content: (
          <FaInstanceView faId={a} />
        ),
      }
    }))
  }
  useEffect(fillOptions, [assetIds])

  return (
    <Dropdown
      placeholder={placeholder}
      // fluid
      selection
      search
      clearable
      options={assetOptions}
      value={selectedFa}
      onChange={handleChange}
    />
  )
}

export {
  FaSelector
}
