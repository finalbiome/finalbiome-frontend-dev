/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { useSubstrateState } from './substrate-lib'

import {
  // eslint-disable-next-line no-unused-vars
  Table, Grid, Label, Button, Form, Input, Header, Menu, Icon, Segment,
  // eslint-disable-next-line no-unused-vars
  Dropdown, Tab, Checkbox, Accordion
} from 'semantic-ui-react'

function FaBalance(params) {
  const { api, currentAccount, keyring } = useSubstrateState()
  const [balances, setBalances] = useState([])
  const [faIds, setFaIds] = useState([])

  const getFaIds = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.fungibleAssets.accounts.keys(currentAccount.address,
        keys => {
          const ids = keys.map(key => key.args[1].toJSON());
          setFaIds(ids)
        })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(getFaIds, [api, currentAccount])

  const subscribeFaByAcc = () => {
    const faIdsToKeys = () => {
      return faIds.map(k => [currentAccount.address, k])
    }
    let unsub = null
    const asyncFetch = async () => {
      if (faIds.length === 0) return
      unsub = await api.query.fungibleAssets.accounts.multi(faIdsToKeys(),
        entries => {
          const balances = entries
            .filter(entry => entry.isSome)
            .map((entry, idx) => {
            return {
              id: faIds[idx],
              balance: entry.unwrap().balance.toJSON(),
            }
          });
          setBalances(balances)
        })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(subscribeFaByAcc, [api, faIds, currentAccount.address])

  return (
    <Grid.Column>
      <Header as="h2">Balance of FA</Header>
      {balances.length === 0 ? (
        <Label basic color="yellow">
          No FA to be shown
        </Label>
      ) : (
        <Table celled striped size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>FA</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">Balance</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {balances.map(balance => (
              <Table.Row key={'fa-blns-' + balance.id}>
                <Table.Cell>
                  {balance.id}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {balance.balance}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Grid.Column>
  )
}

export {
  FaBalance
}
