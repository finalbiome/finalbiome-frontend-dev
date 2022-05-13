import React, { useEffect, useState } from 'react'
// import { Card, Statistic } from 'semantic-ui-react'
import { Table, Grid, Label, Button, Form, Input } from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'


import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

const acctAddr = acct => (acct ? acct.address : '')

function CreateOrganization() {
  const { api, currentAccount } = useSubstrateState()
  const [isOrganization, setIsOrganization] = useState(false)
  // The transaction submission status
  const [status, setStatus] = useState('')
  // const [currentValue, setCurrentValue] = useState(0)
  const [formValue, setFormValue] = useState('')
  // currentAccount &&
  // api.query.organizationIdentity.organizations()

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe

    // If the user has selected an address, create a new subscription
    currentAccount &&
      api.query.organizationIdentity
        .organizations(acctAddr(currentAccount), val => {
          setIsOrganization(!val.isEmpty)
          // reset data in the form for creating organization
          setFormValue('')
        })
        .then(unsub => (unsubscribe = unsub))
        .catch(console.error)
  
      return () => unsubscribe && unsubscribe()
    }, [api, currentAccount])


  return currentAccount && !isOrganization ? (
    <div>
      <h2>Make {currentAccount.meta.name.toUpperCase()} an organization</h2>
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
    </div> 
    ) : null
}

function Main(props) {
  const { api, keyring } = useSubstrateState()
  // const accounts = keyring.getPairs()
  // const [balances, setBalances] = useState({})
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
    <Grid.Column>
      <h1>Organizations</h1>
      {organizations.length === 0 ? (
        <Label basic color="yellow">
          No accounts to be shown
        </Label>
      ) : (
        <Table celled striped size="small">
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3} textAlign="right">
                <strong>Account Name</strong>
              </Table.Cell>
              <Table.Cell width={10}>
                <strong>Address</strong>
              </Table.Cell>
              <Table.Cell width={3} textAlign="right">
                <strong>Organization Name</strong>
              </Table.Cell>
            </Table.Row>
            {organizations.map(org => (
              <Table.Row key={org.address}>
                <Table.Cell width={3} textAlign="right">
                  {org.accountName}
                </Table.Cell>
                <Table.Cell width={10}>
                  <span style={{ display: 'inline-block', minWidth: '31em' }}>
                    {org.address}
                  </span>
                  <CopyToClipboard text={org.address}>
                    <Button
                      basic
                      circular
                      compact
                      size="mini"
                      color="blue"
                      icon="copy outline"
                    />
                  </CopyToClipboard>
                </Table.Cell>
                <Table.Cell width={3} textAlign="right">
                  {org.name}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
      <CreateOrganization />
    </Grid.Column>
  )
}

export default function Organizations(props) {
  const { api, keyring } = useSubstrateState()
  return keyring.getPairs && api.query && api.query.organizationIdentity && api.query.organizationIdentity.organizations ? (
    <Main {...props} />
  ) : null
}
