
import React, { useEffect, useState } from 'react'
import { useSubstrateState } from './substrate-lib'

import {
  Table, Grid, Label, Header, Icon} from 'semantic-ui-react'
import { NfaInstanceView } from './components/NfaInstanceView'

function NfaBalance(params) {
  const { api, currentAccount } = useSubstrateState()
  const [nfaIds, setNfaIds] = useState([])

  const getNfaIds = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.nonFungibleAssets.accounts.keys(currentAccount.address,
        keys => {
          const ids = keys.map(key => key.args.map(k => k.toJSON()));
          setNfaIds(ids)
        })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(getNfaIds, [api, currentAccount])

  const handleRefresh = () => {
    getNfaIds()()
  }

  return (
    <Grid.Column>
      <Header as="h2">Balance of NFA</Header>
      {nfaIds.length === 0 ? (
        <Label basic color="yellow">
          No NFA to be shown
          <Icon link name='refresh' style={{ marginLeft: 'auto' }} color='grey' onClick={handleRefresh} />
        </Label>
      ) : (
          <div style={{ clear: 'both', overflow: 'auto', maxHeight: 200 }}>
            <Table celled striped size="small"
            >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{display: 'flex'}}>NFA <Icon link name='refresh' style={{marginLeft: 'auto'}} color='grey' onClick={handleRefresh} /></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {nfaIds.map(id => (
              <Table.Row key={'nfa-blns-' + id}>
                <Table.Cell>
                  <NfaInstanceView nfaInstanceId={id} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
          </div>
      )}
    </Grid.Column>
  )
}

export {
  NfaBalance
}
