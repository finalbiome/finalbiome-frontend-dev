import React, { useState, useEffect } from 'react'
import { useSubstrateState } from '../substrate-lib'

import { AccountView } from '../AccountView'
import { Dropdown } from 'semantic-ui-react'

function AccountSelector({
  selectedAccount,
  setSelectedAccount,
  onlyOrgs = false,
  placeholder = 'Select account...'
}) {
  const { api, keyring } = useSubstrateState()
  const [accountsOptions, setAccountsOptions] = useState([])

  // const handleSearchChange = (e, { searchQuery }) => setSelectedAccount(searchQuery)
  const handleChange = (e, { value }) => setSelectedAccount(value)

  useEffect(() => {
    const addresses = keyring.getPairs().filter(a => !onlyOrgs || a.meta.org).map(account => {
      return {
        key: account.address,
        value: account.address,
        text: account.meta.name,
        // icon: account.meta.org ? 'game' : 'user',
        content: (
          <AccountView address={account.address} />
        )
      }
    })
    setAccountsOptions(addresses)

  }, [api, keyring, onlyOrgs])

  return (
    <Dropdown
      placeholder={placeholder}
      fluid
      selection
      // allowAdditions
      // search
      // clearable
      options={accountsOptions}
      // value={"selectedAccount"}
      onChange={handleChange}
      // searchQuery={selectedAccount}
      // onSearchChange={handleSearchChange}
    />
  )
}

export {
  AccountSelector
}
