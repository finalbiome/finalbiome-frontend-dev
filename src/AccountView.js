import React, { useState, useEffect } from 'react'

import { Icon, Label } from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSubstrateState } from './substrate-lib'



function AccountView(props) {
  const { address } = props
  const { keyring } = useSubstrateState()

  // eslint-disable-next-line no-unused-vars
  const [wellKnown, setWellKnown] = useState([])
  const [account, setAccount] = useState('')

  
  useEffect(() => {
    if (!address) return
    let acc = {}
    try {
      // getPair rise an error if an address is not found
      acc = keyring.getPair(address)
    } catch (error) {
      console.log(error)
      return
    }
    if (acc) setAccount(acc)
    else setAccount({address: address, meta: {name: 'Unknown'}})
    // setWellKnown(keyring.getPairs())
    
    // const finded = wellKnown.find(a => a.address === address)
    // if (finded) setAccount(finded)
    // else setAccount({address: address, name: 'Unknown'})
  }, [keyring, address, wellKnown])

  // const pretty = (account) => account ? `${account.meta.name} (${shortAddress})` : ''
  const shortAddress = (address) => `${address.slice(0, 6)}...${address.slice(-6)}`;
  const getName = () => account.meta.orgName ? `${account.meta.orgName} (${account.meta.name.toLowerCase()})` : account.meta.name.toUpperCase();

  return account ? (
    <div>
      <CopyToClipboard text={account.address}>
        <Label as="a">
          <Icon name={account.meta.org ? 'game' : (account.meta.member ? 'address card' : 'user')} />
          {getName()}
          <Label.Detail>{shortAddress(account.address)}</Label.Detail>
        </Label>
      </CopyToClipboard>
    </div>
  ) : null
}

export { AccountView }
