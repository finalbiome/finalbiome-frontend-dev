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
    const acc = keyring.getPair(address)
    if (acc) setAccount(acc)
    else setAccount({address: address, meta: {name: 'Unknown'}})
    // setWellKnown(keyring.getPairs())
    
    // const finded = wellKnown.find(a => a.address === address)
    // if (finded) setAccount(finded)
    // else setAccount({address: address, name: 'Unknown'})
  }, [keyring, address, wellKnown])

  // const pretty = (account) => account ? `${account.meta.name} (${shortAddress})` : ''
  const shortAddress = (address) => `${address.slice(0, 6)}...${address.slice(-6)}`

  return account ? (
    <div>
      <CopyToClipboard text={account.address}>
        <Label as="a">
          <Icon name={account.meta.org ? "game" : "user"} />
          {account.meta.name.toUpperCase()}
          <Label.Detail>{shortAddress(account.address)}</Label.Detail>
        </Label>
      </CopyToClipboard>
    </div>
  ) : null
}

export { AccountView }
