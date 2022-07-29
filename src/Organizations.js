import React, { useEffect, useState } from 'react'
// import PropTypes from 'prop-types'
// import { Card, Statistic } from 'semantic-ui-react'

// import { encodeAddress } from '@polkadot/util-crypto'
import { AccountView } from './AccountView'

import {
  Table, Grid, Label, Button, Form, Input, Header, Menu, Icon, Segment,
  Dropdown, Tab, Checkbox, Accordion
} from 'semantic-ui-react'


import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'
import { BettorView } from './NfaBettor'
import { PurchasedView } from './NfaPurchased'
import { TxStatusView } from './components/TxStatusView'
import { NfaSelector } from './components/NfaSelector'

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
        <TxStatusView status={status} setStatus={setStatus} />
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
      <TxStatusView status={status} setStatus={setStatus} />
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
  useEffect(subscribeFAIdByOrg, [api, keyring, currentAccount, org])

  const subscribeFA = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.fungibleAssets.assets.multi(assetIds,
        entries => {
          const assets = entries.map((entry, idx) => {
            const data = entry.toJSON()
            const human = entry.toHuman()
            const id = assetIds[idx]
            return { id, human, ...data }
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
          <Table celled striped size="small" fixed singleLine>
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
                <Table.Cell width={4} textAlign="right">
                  <strong>Raw</strong>
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
                <Table.Cell width={3}>
                  {asset.supply}
                </Table.Cell>
                <Table.Cell width={1}
                  title={JSON.stringify(asset.human, null, 2)}>
                  {JSON.stringify(asset.human)}
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
  const panes = [
    {
      menuItem: 'Create FA',
      render: () => <Tab.Pane attached={false}><FaCreate /></Tab.Pane>,
    },
    {
      menuItem: 'Remove FA',
      render: () => <Tab.Pane attached={false}><FaRemove /></Tab.Pane>,
    },
  ]

  return (
    <Segment>
      <Header as="h3">Manage of FA</Header>
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </Segment>
  )
}

function FaCreate(props) {
  const [org, setOrg] = useState('')
  const [faName, setFaName] = useState('')
  const [faTopUpped, setFaTopUpped] = useState('')
  const [faTopUppedSpeed, setFaTopUppedSpeed] = useState('')
  const [status, setStatus] = useState('')

  const topUppedStruct = (faTopUpped, faTopUppedSpeed) => {
    if (!faTopUpped || !parseInt(faTopUppedSpeed)) return undefined
    return {
      speed: faTopUppedSpeed
    }
  }

  return (
    <Form>
      <Form.Field>
        <AccountSelector selectedAccount={org} setSelectedAccount={setOrg} onlyOrgs={true} placeholder={'Select Organization Account...'}/>
      </Form.Field>
      <Form.Field>
        <Input
          label="Name of the asset"
          state="newValue"
          type="string"
          onChange={(_, { value }) => setFaName(value)}
        />
      </Form.Field>
      <Form.Field>
        <Checkbox
          label='Asset is Top Upped'
          onChange={(_, { checked }) => setFaTopUpped(checked)}
          // required={false}
          defaultChecked={false}
        />
      </Form.Field>
      {faTopUpped ?
        <Form.Field>
          <Input
            label="Speed of recovery"
            state="newValue"
            type="number"
            onChange={(_, { value }) => setFaTopUppedSpeed(value)}
          />
        </Form.Field>
        : null
      }
      <Form.Field>
        <TxButton
          label="Create FA"
          type="SIGNED-TX"
          setStatus={setStatus}
          attrs={{
            palletRpc: 'fungibleAssets',
            callable: 'create',
            inputParams: [org, faName, topUppedStruct(faTopUpped, faTopUppedSpeed)],
            paramFields: ['organization_id', 'name', { value: 'top_upped', optional: !faTopUpped }],

          }}
        />
      </Form.Field>
      <TxStatusView status={status} setStatus={setStatus} />
    </Form>
  )
}

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
        icon: 'sun',
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

function FaRemove(props) {
  const [org, setOrg] = useState('')
  const [selectedAsset, setSelectedAsset] = useState('')
  const [status, setStatus] = useState('')

  return (
    <Form>
      <Form.Field>
        <AccountSelector selectedAccount={org} setSelectedAccount={setOrg} onlyOrgs={true} placeholder={'Select Organization Account...'}/>
      </Form.Field>
      <Form.Field>
        <FaSelector selectedFa={selectedAsset} setSelectedFa={setSelectedAsset} />
      </Form.Field>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          label="Remove FA"
          type="SIGNED-TX"
          color='red'
          setStatus={setStatus}
          attrs={{
            palletRpc: 'fungibleAssets',
            callable: 'destroy',
            inputParams: [org, selectedAsset],
            paramFields: ['organization_id', 'asset_id'],
          }}
        />
      </Form.Field>
      <TxStatusView status={status} setStatus={setStatus} />
    </Form>
  )
}

function NFA(props) {
  return (
    <div>
      <Header as='h2'>Non Fungible Assets</Header>
      <NfaList />
      <NfaManage />
    </div>
  )
}


function NfaList(props) {
  // eslint-disable-next-line no-unused-vars
  const { api, keyring, currentAccount } = useSubstrateState()
  // eslint-disable-next-line no-unused-vars
  const [org, setOrg] = useState('')
  const [classes, setClasses] = useState([])
  const [classIds, setClassIds] = useState([])

  const subscribeNFAIdByOrg = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.nonFungibleAssets.classAccounts.keys(org,
        keys => {
          setClassIds(keys.map(k => k.toHuman()))
        })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(subscribeNFAIdByOrg, [api, keyring, currentAccount, org])

  const subscribeNFA = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.nonFungibleAssets.classes.multi(classIds,
        entries => {
          const classes = entries.map((entry, idx) => {
            const data = entry.toJSON()
            const human = entry.toHuman()
            const id = classIds[idx]
            return { id, human, ...data }
          })
          setClasses(classes)
        }
      )
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(subscribeNFA, [api, keyring, classIds])

  return (
    <div>
      <AccountSelector selectedAccount={org} setSelectedAccount={setOrg} onlyOrgs={true} placeholder={'Select Organization Account...'} />
      {classes.length === 0 ? (
        <Label basic color="yellow">
          No non-fungible asset classes to be shown
        </Label>
      ) : (
        <Table celled striped size="small" fixed singleLine>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={2} textAlign="right">
                <strong>Class Id</strong>
              </Table.Cell>
              <Table.Cell width={10}>
                <strong>Owner</strong>
              </Table.Cell>
              <Table.Cell width={4} textAlign="right">
                <strong>Instances</strong>
              </Table.Cell>
              <Table.Cell width={4} textAlign="right">
                <strong>Raw</strong>
              </Table.Cell>
            </Table.Row>
            {classes.sort((a, b) => a.id[1] - b.id[1]).map(asset => (
              <Table.Row key={asset.id[1]}>
                <Table.Cell width={2} textAlign="right">
                  {asset.id[1]}
                </Table.Cell>
                <Table.Cell width={10}>
                  <AccountView address={asset.owner} />
                </Table.Cell>
                <Table.Cell width={3}>
                  {asset.instances}
                </Table.Cell>
                <Table.Cell width={1}
                  title={JSON.stringify(asset.human, null, 2)}>
                  {JSON.stringify(asset.human)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  )
}

function NfaManage(params) {
  const panes = [
    {
      menuItem: 'Create NFA',
      render: () => <Tab.Pane attached={false}><NfaCreate /></Tab.Pane>,
    },
    {
      menuItem: 'Edit NFA',
      render: () => <Tab.Pane attached={false}><NfaEdit /></Tab.Pane>,
    },
    {
      menuItem: 'Remove NFA',
      render: () => <Tab.Pane attached={false}><NfaRemove /></Tab.Pane>,
    },
  ]

  return (
    <Segment>
      <Header as="h3">Manage of NFA</Header>
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </Segment>
  )
}

function NfaCreate(props) {
  const [org, setOrg] = useState('')
  const [nfaName, setNfaName] = useState('')
  const [status, setStatus] = useState('')

  return (
    <Form>
      <Form.Field>
        <AccountSelector selectedAccount={org} setSelectedAccount={setOrg} onlyOrgs={true} placeholder={'Select Organization Account...'} />
      </Form.Field>
      <Form.Field>
        <Input
          label="Name of the asset class"
          state="newValue"
          type="string"
          onChange={(_, { value }) => setNfaName(value)}
        />
      </Form.Field>
      <Form.Field>
        <TxButton
          label="Create FA"
          type="SIGNED-TX"
          setStatus={setStatus}
          attrs={{
            palletRpc: 'nonFungibleAssets',
            callable: 'create',
            inputParams: [org, nfaName,],
            paramFields: ['organization_id', 'name',],

          }}
        />
      </Form.Field>
      <TxStatusView status={status} setStatus={setStatus} />
    </Form>
  )
}

function NfaRemove(props) {
  const [org, setOrg] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [status, setStatus] = useState('')

  return (
    <Form>
      <Form.Field>
        <AccountSelector selectedAccount={org} setSelectedAccount={setOrg} onlyOrgs={true} placeholder={'Select Organization Account...'} />
      </Form.Field>
      <Form.Field>
        <NfaSelector selectedNfa={selectedClass} setSelectedNfa={setSelectedClass} />
      </Form.Field>
      <Form.Field style={{ textAlign: 'center' }}>
        <TxButton
          label="Remove FA"
          type="SIGNED-TX"
          color='red'
          setStatus={setStatus}
          attrs={{
            palletRpc: 'nonFungibleAssets',
            callable: 'destroy',
            inputParams: [org, selectedClass],
            paramFields: ['organization_id', 'class_id'],
          }}
        />
      </Form.Field>
      <TxStatusView status={status} setStatus={setStatus} />
    </Form>
  )
}

/**
 * Returns a list of all available mechanics
 */
function getMechanicsList() {
  return [
    'Purchased',
    'Bettor',
  ]
}

/**
 * Returns attribute of Some(value).
 * If None, return ''
 * @param {*} value 
 * @param {*} attr 
 * @returns 
 */
// function attrFromSome(value, attr) {
//   return value && attr && value.isSome ? value.unwrapOr({})[attr].toHuman() : ''
// }

function NfaEdit(props) {
  const { api, } = useSubstrateState()

  const [org, setOrg] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedMechanic, setSelectedMechanic] = useState('')
  // nfa details //
  const [nfaName, setNfaName] = useState('')
  const [nfaInstances, setNfaInstances] = useState('')
  const [nfaAttributes, setNfaAttributes] = useState('')
  const [nfaOwner, setNfaOwner] = useState('')
  const [nfaPurchased, setNfaPurchased] = useState('')
  const [nfaBettor, setNfaBettor] = useState('')

  const [status, setStatus] = useState('')

  const mechanicNames = getMechanicsList().map(m => {
    return {
      key: m,
      value: m,
      text: m,
      icon: 'settings',
    }
  })

  const fetchNfaDetails = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.nonFungibleAssets.classes(selectedClass,
        detail => {
          const d = detail.toHuman()
          setNfaName(d.name)
          setNfaInstances(d.instances)
          setNfaAttributes(d.attributes)
          setNfaOwner(d.owner)
          setNfaPurchased(d.purchased)
          setNfaBettor(d.bettor)
        })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(fetchNfaDetails, [api, selectedClass])

  const FormMechnicPurchased = (
    <div>
      <PurchasedView nfaPurchased={nfaPurchased} nfaClass={selectedClass} nfaOwner={nfaOwner} setStatus={setStatus} />
    </div>
  );
  const FormMechnicBettor = (
    <div>
      <BettorView nfaBettor={nfaBettor} nfaClass={selectedClass} nfaOwner={nfaOwner} setStatus={setStatus} />
    </div>
  );

  const mechanicsUI = [
    {
      key: 'Purchased',
      title: { content: nfaPurchased ? 'Purchased Mechanic *' : 'Purchased Mechanic' },
      content: { content: FormMechnicPurchased },
    },
    {
      key: 'Bettor',
      title: { content: nfaBettor ? 'Bettor Mechanic *' : 'Bettor Mechanic' },
      content: { content: FormMechnicBettor },
    },
  ]

  return (
    <div>
      <Form>
        <Form.Field>
          <label>Organization</label>
          <AccountSelector selectedAccount={org} setSelectedAccount={setOrg} onlyOrgs={true} placeholder={'Select Organization Account...'} />
        </Form.Field>
        <Form.Field>
          <label>NFA id</label>
          <NfaSelector selectedNfa={selectedClass} setSelectedNfa={setSelectedClass} />
        </Form.Field>
        <Form.Input label='Name' readOnly placeholder='Name of NFT' value={nfaName} />
        <Form.Group widths='equal'>
          <Form.Input label='Instances' readOnly placeholder='Number of instances' value={nfaInstances} />
          <Form.Input label='Attributes' readOnly placeholder='Number of attributes' value={nfaAttributes} />
        </Form.Group>
        <Accordion as={Form.Field} panels={mechanicsUI} styled fluid />
        <Form.Field>
          <label>Mechanic</label>
          <Dropdown
            placeholder={"Select mechanics"}
            fluid
            selection
            search
            clearable
            options={mechanicNames}
            value={selectedMechanic}
            onChange={(e, { name }) => setSelectedMechanic(name)}
          />
        </Form.Field>
        <Form.Field>
          <TxButton
            label="Update FA"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'nonFungibleAssets',
              callable: 'destroy',
              inputParams: [org, selectedClass],
              paramFields: ['organization_id', 'class_id'],
            }}
          />
        </Form.Field>
        <TxStatusView status={status} setStatus={setStatus} />
      </Form>
    </div>

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
            {menuActiveItem === 'nfa' ?
              <div>
                <NFA />
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

export { FaSelector }
