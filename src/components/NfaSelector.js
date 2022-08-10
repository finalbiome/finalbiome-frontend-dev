import { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { useSubstrateState } from '../substrate-lib'
import { NfaClassView } from './NfaClassView'

function NfaSelector({
  selectedNfa,
  setSelectedNfa,
  placeholder = 'Select NFA',
}) {
  const { api, } = useSubstrateState()
  const [classIds, setClassIds] = useState([])
  const [classOptions, setClassOptions] = useState([])

  const handleChange = (e, { value }) => setSelectedNfa(value)

  const fetchAllNfaIds = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.nonFungibleAssets.classes.keys(
        keys => {
          setClassIds(keys.map(k => k.toHuman()[0]))
        })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(fetchAllNfaIds, [api])

  const fillOptions = () => {
    let options = classIds.map(id => {
      return {
        key: id,
        text: id,
        value: id,
        content: (
          <NfaClassView nfaClassId={id} />
        ),
      }
    });
    setClassOptions(options)
  }
  useEffect(fillOptions, [classIds])

  return (
    <Dropdown
      placeholder={placeholder}
      fluid
      selection
      search
      clearable
      options={classOptions}
      value={selectedNfa}
      onChange={handleChange}
    />
  )
}

export {
  NfaSelector
}
