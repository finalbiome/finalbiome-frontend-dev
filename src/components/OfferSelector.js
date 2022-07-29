import { useEffect, useState } from 'react'
import { useSubstrateState } from '../substrate-lib'
import { Dropdown, Label } from 'semantic-ui-react'


function OfferSelector({
  nfaClass,
  selectedOffer,
  setSelectedOffer,
}) {
  const { api, } = useSubstrateState()
  const [offerOptions, setOfferOptions] = useState([])

  const handleChange = (e, { value }) => setSelectedOffer(value)

  const fetchClassOfffers = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.nonFungibleAssets.classes(nfaClass,
        entity => {
          const details = entity.unwrap().toJSON()

          const offers = []
          if (details.purchased?.offers) {
            details.purchased?.offers.forEach((element, idx) => {
              offers.push({
                key: idx,
                value: idx,
                text: 'fa:' + element.fa + ', price:' + element.price,
                icon: 'tag',
              })
            });
          } 
          setOfferOptions(offers)
        })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(fetchClassOfffers, [api, nfaClass])

  return (
    <>
      {offerOptions.length > 0 ? (
        <Dropdown
          placeholder={'Select an offer...'}
          fluid
          selection
          clearable
          options={offerOptions}
          // value={selectedOffer}
          onChange={handleChange}
        />
      ) : (
        <Label basic color="yellow">
          No offers found for this NFA
        </Label>
      )}
    </>
  )
}

export {
  OfferSelector
}
