import React, { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import {
  Menu,
  Button,
  Dropdown,
  Icon,
  Image,
  Label,
} from 'semantic-ui-react'

import { useSubstrate, useSubstrateState } from './substrate-lib'

const CHROME_EXT_URL =
  'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd'
const FIREFOX_ADDON_URL =
  'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/'

const acctAddr = acct => (acct ? acct.address : '')

function Main(props) {
  const {
    setCurrentAccount,
    state: { keyring, currentAccount },
  } = useSubstrate()
  const { api } = useSubstrateState()
  const [accountNonce, setAccountNonce] = useState(0)
  const [keyringOptions, setKeyringOptions] = useState([])


  const handleItemClick = (e, { name }) => props.changeMenuItem(name);

  // Get the list of accounts we possess the private key for
  const fillKeyringOptions = () => {
    const options = keyring.getPairs().map(account => ({
      key: account.address,
      value: account.address,
      text: account.meta.name.toUpperCase(),
      icon: account.meta.org ? 'game' : (account.meta.member ? 'address card' : 'user'),
    }))
    setKeyringOptions(options)
  }
  useEffect(fillKeyringOptions, [keyring])


  const initialAddress =
    keyringOptions.length > 0 ? keyringOptions[0].value : ''

  function getAllOrganizations() {
    if (!api) return
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.organizationIdentity.organizations.keys(
        keys => {
          keys.forEach(key => {
            const address = key.toHuman()[0];
            const pair = keyring.keyring.getPair(address)
            pair.setMeta({org: !!pair})
          })
          fillKeyringOptions()
        })
    }
    asyncFetch()
    return () => {unsub && unsub()}
  }
  useEffect(getAllOrganizations, [api, accountNonce, keyring])

  // Set the initial address
  useEffect(() => {
    // `setCurrentAccount()` is called only when currentAccount is null (uninitialized)
    !currentAccount &&
      initialAddress.length > 0 &&
      setCurrentAccount(keyring.getPair(initialAddress))
  }, [currentAccount, setCurrentAccount, keyring, initialAddress])

  const getAccountNonce = () => {
    if (!currentAccount || !api) return
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.system.account(currentAccount.address, entity => {
        const nonce = entity.nonce.isEmpty ? 0 : entity.nonce.toNumber()
        setAccountNonce(nonce);
      })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(getAccountNonce, [api, currentAccount])

  const onChange = addr => {
    setCurrentAccount(keyring.getPair(addr))
  }

  return (
    <Menu
      attached="top"
      tabular
      style={{
        backgroundColor: '#fff',
        borderColor: '#fff',
        paddingTop: '1em',
        paddingBottom: '1em',
      }}
      pointing secondary stackable>
        <Menu.Menu>
          <Image
            src={`${process.env.PUBLIC_URL}/assets/finalbiome-logo.svg`}
            size="mini"
            spaced="right"
          />
          <Menu.Item
            name='home'
            active={props.currentMenuItem === 'home'}
            onClick={handleItemClick}
          />
          <Menu.Item
            name='developer'
            active={props.currentMenuItem === 'developer'}
            onClick={handleItemClick}
          />
          <Menu.Item
            name='gamer'
            active={props.currentMenuItem === 'gamer'}
            onClick={handleItemClick}
          />
          <Menu.Item
            name='rsp-game'
            active={props.currentMenuItem === 'rsp-game'}
            onClick={handleItemClick}
          />
        </Menu.Menu>
        <Menu.Menu position="right" style={{ alignItems: 'center' }}>
          {!currentAccount ? (
            <span>
              Create an account with Polkadot-JS Extension (
              <a target="_blank" rel="noreferrer" href={CHROME_EXT_URL}>
                Chrome
              </a>
              ,&nbsp;
              <a target="_blank" rel="noreferrer" href={FIREFOX_ADDON_URL}>
                Firefox
              </a>
              )&nbsp;
            </span>
          ) : null}
          <CopyToClipboard text={acctAddr(currentAccount)}>
            <Button
              basic
              circular
              size="large"
              icon={currentAccount?.meta.org ? "game" : (currentAccount?.meta.member ? 'address card' : "user")}
              color={currentAccount ? 'green' : 'red'}
            />
          </CopyToClipboard>
          <Dropdown
            search
            selection
            placeholder="Select an account"
            options={keyringOptions}
            onChange={(_, dropdown) => {
              onChange(dropdown.value)
            }}
            value={acctAddr(currentAccount)}
          />
          <BalanceAnnotation />
        </Menu.Menu>
    </Menu>
  )
}

function BalanceAnnotation(props) {
  const { api, currentAccount } = useSubstrateState()
  const [accountBalance, setAccountBalance] = useState(0)

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe

    // If the user has selected an address, create a new subscription
    currentAccount &&
      api.query.system
        .account(acctAddr(currentAccount), balance =>
          setAccountBalance(balance.data.free.toHuman())
        )
        .then(unsub => (unsubscribe = unsub))
        .catch(console.error)

    return () => unsubscribe && unsubscribe()
  }, [api, currentAccount])

  return currentAccount ? (
    <Label pointing="left">
      <Icon name="money" color="green" />
      {accountBalance}
    </Label>
  ) : null
}

export default function AccountSelector(props) {
  const { api, keyring } = useSubstrateState()
  return keyring.getPairs && api.query ? <Main {...props} /> : null
}
