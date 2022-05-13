import React, { useEffect, useState } from 'react'
// import { Form, Input, Card, Statistic } from 'semantic-ui-react'
import { Table, Grid, Label, Button } from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'


import { useSubstrateState } from './substrate-lib'
// import { TxButton } from './substrate-lib/components'

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
        console.log(organizations)
        const orgsMap = []
        addresses.forEach((address, idx) => {
          if (!organizations[idx].isEmpty) {
            orgsMap.push({
              address,
              accountName: names[idx],
              name: organizations[idx].unwrap().name.toHuman()
            })
            
            // orgsMap.set(address, {
            //   name: organizations[idx].unwrap().name.toHuman()
            // })
          }
        });
        // const balancesMap = addresses.reduce(
        //   (acc, address, index) => ({
        //     ...acc,
        //     [address]: balances[index].data.free.toHuman(),
        //   }),
        //   {}
        // )
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
    </Grid.Column>
  )
}

export default function Organizations(props) {
  const { api } = useSubstrateState()
  return api.query.organizationIdentity && api.query.organizationIdentity.organizations ? (
    <Main {...props} />
  ) : null
}
