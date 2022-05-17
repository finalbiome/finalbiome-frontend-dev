import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
// import { Card, Statistic } from 'semantic-ui-react'

// import { encodeAddress } from '@polkadot/util-crypto'
import { AccountView } from './AccountView'

import {
  Table, Grid, Label, Button, Form, Input, Header, Menu, Icon, Segment,
  Dropdown
} from 'semantic-ui-react'


import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

const acctAddr = acct => (acct ? acct.address : '')

function CreateOrganization(props) {
  const { api, currentAccount } = useSubstrateState()
  const [isOrganization, setIsOrganization] = useState(false)
  // The transaction submission status
  const [status, setStatus] = useState('')
  const [formValue, setFormValue] = useState('')

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe

    // If the user has selected an address, create a new subscription
    currentAccount &&
      api.query.organizationIdentity
        .organizations(acctAddr(currentAccount), val => {
          setIsOrganization(!val.isEmpty)
          currentAccount.setMeta({
            org: !val.isEmpty
          })
          // reset data in the form for creating organization
          setFormValue('')
        })
        .then(unsub => (unsubscribe = unsub))
        .catch(console.error)
  
      return () => unsubscribe && unsubscribe()
    }, [api, currentAccount])


  return currentAccount && !isOrganization ? (
    <Segment>
      <Header as="h3">Make {currentAccount.meta.name.toUpperCase()} an organization</Header>
      <Label pointing="left">
        {currentAccount.meta.name}
      </Label>
      <Form>
        <Form.Field>
          <Input
            label="Name of the organization"
            state="newValue"
            type="string"
            onChange={(_, { value }) => setFormValue(value)}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Create"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'organizationIdentity',
              callable: 'createOrganization',
              inputParams: [formValue],
              paramFields: [true],
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Segment> 
    ) : null
}

function OrganizationsList(props) {
  const { api, keyring } = useSubstrateState()
  const [organizations, setOrganizations] = useState([])

  useEffect(() => {
    const addresses = keyring.getPairs().map(account => account.address)
    const names = keyring.getPairs().map(account => account.meta.name)
    let unsubscribeAll = null

    // api.query.organizationIdentity.organizations.entries()
    //   .then(orgs => {
    //     console.log(orgs);
    //     orgs.forEach(org => {
    //       console.log(org[1].unwrap().name.toHuman())
    //     });
    //   });


    api.query.organizationIdentity.organizations
      .multi(addresses, organizations => {
        // console.log(organizations)
        const orgsMap = []
        addresses.forEach((address, idx) => {
          if (!organizations[idx].isEmpty) {
            orgsMap.push({
              address,
              accountName: names[idx],
              name: organizations[idx].unwrap().name.toHuman()
            })
          }
        });
        setOrganizations(orgsMap)
      })
      .then(unsub => {
        unsubscribeAll = unsub
      })
      .catch(console.error)

    return () => unsubscribeAll && unsubscribeAll()

  }, [api, keyring, setOrganizations])

  return (
    // <Grid.Column>
    <div>
      <Header as='h2'>Organizations</Header>
      {organizations.length === 0 ? (
        <Label basic color="yellow">
          No accounts to be shown
        </Label>
      ) : (
        <Table celled striped size="small">
          <Table.Body>
              <Table.Row>
              <Table.Cell width={10}>
                <strong>Address</strong>
              </Table.Cell>
                <Table.Cell width={6} textAlign="right">
                <strong>Organization Name</strong>
              </Table.Cell>
            </Table.Row>
            {organizations.map(org => (
              <Table.Row key={org.address}>
                <Table.Cell width={10}>
                  <AccountView address={org.address} />
                </Table.Cell>
                <Table.Cell width={6} textAlign="right">
                  {org.name}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
      {/* </Grid.Column> */}
    </div>
  )
}

function AccountSelector({
  selectedAccount,
  setSelectedAccount,
  onlyOrgs = false,
  placeholder = 'Select account...'
}) {
  const { api, keyring } = useSubstrateState()
  const [accountsOptions, setAccountsOptions] = useState([])

  const handleSearchChange = (e, { searchQuery }) => setSelectedAccount(searchQuery)
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
      allowAdditions
      search
      clearable
      options={accountsOptions}
      value={selectedAccount}
      onChange={handleChange}
      searchQuery={selectedAccount}
      onSearchChange={handleSearchChange}
    />
  )
}

function ManageMembers(props) {
  const { api, keyring } = useSubstrateState()

  const { currentAccount } = useSubstrateState()
  const [member, setMember] = useState('')
  // The transaction submission status
  const [status, setStatus] = useState('')
  const [isMember, setIsMember] = useState(false)

  useEffect(() => {
    let unsubscribeAll = null
    /**
     * Returns true if `accAddr` is member of `orgAddr`
     * @param {AccountId} orgAddr organisation address
     * @param {AccountId} accAddr Account to check on members
     * @returns bool
     */
    const isMemberOf = (orgAddr, accAddr) => {
      return new Promise((resolve, reject) => {
        if (!orgAddr || !accAddr) resolve(false)
        const rawKey = api.query.organizationIdentity.membersOf.key(orgAddr, accAddr)
        api.rpc.state.queryStorageAt([rawKey])
          .then(s => {
            resolve(s[0].isSome)
          })
          .catch(e => reject(e))
      })
    }

    isMemberOf(currentAccount.address, member)
      .then(isMember => {
        setIsMember(isMember)
      })
      .catch(e => {
        setIsMember(false)
        console.error(e)
      })

    return () => unsubscribeAll && unsubscribeAll()

  }, [api, keyring, member, currentAccount, status])

  return currentAccount && currentAccount.meta.org ? (
    <Segment>
      <Header as="h3">Manage Members of Organization</Header>
      <AccountSelector selectedAccount={member} setSelectedAccount={setMember} />
      <br />
      <Button.Group>
        <TxButton
          disabled={isMember}
          color="green"
          label="Add"
          type="SIGNED-TX"
          setStatus={setStatus}
          attrs={{
            palletRpc: 'organizationIdentity',
            callable: 'addMember',
            inputParams: [member],
            paramFields: [true],
          }}
        />
        <Button.Or />
        <TxButton
          disabled={!isMember}
          color="red"
          label="Remove"
          type="SIGNED-TX"
          setStatus={setStatus}
          attrs={{
            palletRpc: 'organizationIdentity',
            callable: 'removeMember',
            inputParams: [member],
            paramFields: [true],
          }}
        />
      </Button.Group>
      <div style={{ overflowWrap: 'break-word' }}>{status}</div>
    </Segment>
  ) : null
}

function FA(props) {
  return (
    <div>
      <Header as='h2'>Fungible Assets</Header>
      <FaList />
      <FaManage />
    </div>
  )
}

function FaList(props) {
  // eslint-disable-next-line no-unused-vars
  const { api, keyring, currentAccount } = useSubstrateState()
  // eslint-disable-next-line no-unused-vars
  const [org, setOrg] = useState('')
  const [assets, setAssets] = useState([])
  const [assetIds, setAssetIds] = useState([])

  const subscribeFAIdByOrg = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.fungibleAssets.assetsOf.keys(org,
        keys => {
          setAssetIds(keys.map(k => k.toHuman()))
        })
    }
    asyncFetch()
    return () => {unsub && unsub()}
  }
  useEffect(subscribeFAIdByOrg, [api, currentAccount, org])

  const subscribeFA = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.fungibleAssets.assets.multi(assetIds,
        entries => {
          const assets = entries.map((entry, idx) => {
            const data = entry.toJSON()
            const id = assetIds[idx]
            return { id, ...data }
          })
          setAssets(assets)
        }
      )
    }
    asyncFetch()
    return () => {unsub && unsub()}
  }
  useEffect(subscribeFA, [api, keyring, assetIds])

  return (
    <div>
      <AccountSelector selectedAccount={org} setSelectedAccount={setOrg} onlyOrgs={true} placeholder={'Select Organization Account...'}/>
      {assets.length === 0 ? (
        <Label basic color="yellow">
          No fungible assets to be shown
        </Label>
      ) : (
        <Table celled striped size="small">
          <Table.Body>
            <Table.Row>
              <Table.Cell width={2} textAlign="right">
                <strong>Asset Id</strong>
              </Table.Cell>
              <Table.Cell width={10}>
                <strong>Owner</strong>
              </Table.Cell>
              <Table.Cell width={4} textAlign="right">
                <strong>Supply</strong>
              </Table.Cell>
            </Table.Row>
            {assets.sort((a, b) => a.id[1] - b.id[1]).map(asset => (
              <Table.Row key={asset.id[1]}>
                <Table.Cell width={2} textAlign="right">
                  {asset.id[1]}
                </Table.Cell>
                <Table.Cell width={10}>
                  <AccountView address={asset.owner} />
                </Table.Cell>
                <Table.Cell width={4}>
                  {asset.supply}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  )
}

function FaManage(params) {

  return (
    <Segment>
      <Header as="h3">Manage of FA</Header>
      <FaCreate />
    </Segment>
  )
}

function FaCreate(props) {
  const [org, setOrg] = useState('')
  const [status, setStatus] = useState('')

  return (
    <Form>
      <Form.Field>
        <AccountSelector selectedAccount={org} setSelectedAccount={setOrg} onlyOrgs={true} placeholder={'Select Organization Account...'}/>
      </Form.Field>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          label="Create FA"
          type="SIGNED-TX"
          setStatus={setStatus}
          attrs={{
            palletRpc: 'fungibleAssets',
            callable: 'create',
            inputParams: [org],
            paramFields: [true],
          }}
        />
      </Form.Field>
      <div style={{ overflowWrap: 'break-word' }}>{status}</div>
    </Form>
  )
}

function Main(props) {
  const handleItemClick = (e, { name }) => setMenuActiveItem(name)

  const [menuActiveItem, setMenuActiveItem] = useState('orgs')

  return (
    <Grid.Column>
      <Header as="h1">Developer</Header>
      <Grid>
        <Grid.Row>
          {/* Menu */}
          <Grid.Column width={2}>
            <Menu icon='labeled' vertical>
              <Menu.Item
                name='orgs'
                active={menuActiveItem === 'orgs'}
                onClick={handleItemClick}
              >
                <Icon name='game' />
                Orgs
              </Menu.Item>

              <Menu.Item
                name='fa'
                active={menuActiveItem === 'fa'}
                onClick={handleItemClick}
              >
                <Icon name='sun' />
                FA
              </Menu.Item>

              <Menu.Item
                name='nfa'
                active={menuActiveItem === 'nfa'}
                onClick={handleItemClick}
              >
                <Icon name='diamond' />
                NFA
              </Menu.Item>
            </Menu>
          </Grid.Column>
          {/* Content */}
          <Grid.Column width={14}>
            {menuActiveItem === 'orgs' ?
              <div>
                <OrganizationsList {...props} />
                <CreateOrganization {...props} />
                <ManageMembers {...props} />
              </div>
              : null}
            {menuActiveItem === 'fa' ?
              <div>
                <FA />
              </div>
              : null}
          </Grid.Column>

        </Grid.Row>
      </Grid>
    </Grid.Column>
  )
}

export default function Organizations(props) {
  const { api, keyring } = useSubstrateState()
  return api && keyring.getPairs && api.query && api.query.organizationIdentity && api.query.organizationIdentity.organizations ? (
    <Main {...props} />
  ) : null
}
