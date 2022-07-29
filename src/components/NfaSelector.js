import { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { useSubstrateState } from '../substrate-lib'

function NfaSelector({
  selectedNfa,
  setSelectedNfa,
  placeholder = 'Select NFA'
}) {
  const { api, } = useSubstrateState()
  const [classOptions, setClassOptions] = useState([])

  const handleChange = (e, { value }) => setSelectedNfa(value)

  const fetchAllFaIds = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.nonFungibleAssets.classes.keys(
        keys => {
          setClassOptions(keys
            .map(k => k.toHuman()[0])
            .map(a => {
              return {
                key: a,
                value: a,
                text: a,
                icon: 'diamond',
              }
            })
          )
        })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(fetchAllFaIds, [api])

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
