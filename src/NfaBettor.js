/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { TxButton } from './substrate-lib/components'

import { NfaSelector, FaSelector } from './Organizations'

import {
  Table, Button, Form, Input, Icon, Dropdown, Divider, Label, Header
} from 'semantic-ui-react'

function BettorEditor({
  nfaBettor,
  nfaOwner,
  nfaClass,
  setStatus,
  done,
}) {
  const [showNewOutcomsForm, setShowNewOutcomsForm] = useState(false)
  const [showNewWinningForm, setShowNewWinningForm] = useState(false)
  const [outcomes, setOutcomes] = useState([])
  const [winnings, setWinnings] = useState([])
  const [rounds, setRounds] = useState('')
  const [drawOutcome, setDrawOutcome] = useState('')

  const options = [
    { key: 0, text: 'Win', value: 'Win', icon: 'beer' },
    { key: 1, text: 'Keep', value: 'Keep', icon: 'minus' },
    { key: 2, text: 'Lose', value: 'Lose', icon: 'trash' },
  ]

  const handleChange = (e, { name, value }) => {
    switch (name) {
      case 'rounds':
        setRounds(value)
        break;
      case 'drawOutcome':
        setDrawOutcome(value)
        break;
      default:
        break;
    }
  }

  const handleTrx = (unsub => {
    setShowNewOutcomsForm(false)
    setShowNewWinningForm(false)
    setOutcomes([])
    setWinnings([])
    setRounds('')
    setDrawOutcome('')

    if (unsub && typeof unsub === 'function') {
      unsub()
    }

    if (done && typeof done === 'function') {
      done()
    }
  })

  return (
    <div>
      <OutcomesView nfaBettorOutcomes={outcomes} />
      {showNewOutcomsForm ?
        <OutcomesForm outcomes={outcomes} setOutcomes={setOutcomes} setShowForm={setShowNewOutcomsForm} />
        :
        <Form.Button
          icon
          labelPosition='left'
          // primary
          size='small'
          onClick={() => setShowNewOutcomsForm(true)}
        >
          <Icon name='add' /> Add Outcome
        </Form.Button>
      }
      <WinningsView nfaBettorWinnings={winnings} />
      {showNewWinningForm ?
        <WinningForm winnings={winnings} setWinnings={setWinnings} setShowForm={setShowNewWinningForm} />
        :
        <Form.Button
          icon
          labelPosition='left'
          // primary
          size='small'
          onClick={() => setShowNewWinningForm(true)}
        >
          <Icon name='add' /> Add Winning
        </Form.Button>
      }
      <Form.Input
        label='Rounds'
        value={rounds}
        onChange={handleChange}
        placeholder='Set number of rounds'
        name='rounds'
        id='rounds'
        type='number'
      />
      <Form.Dropdown
        label='Draw outcome'
        onChange={handleChange}
        fluid
        options={options}
        placeholder='Win'
        selection
        name='drawOutcome'
        value={drawOutcome}
        id='drawOutcome'
        style={{ width: '10em' }}
      />
      <Button
        basic
        content='Cancel'
        onClick={handleTrx}
        type='button'
      />
      <TxButton
        label="Update Bettor"
        type="SIGNED-TX"
        setStatus={setStatus}
        attrs={{
          palletRpc: 'nonFungibleAssets',
          callable: 'setCharacteristic',
          inputParams: [nfaOwner, nfaClass, {
            Bettor: {
              outcomes, winnings, rounds, drawOutcome,
            }
          }],
          paramFields: ['organization_id', 'class_id', 'characteristic'],
        }}
        txOnClickHandler={handleTrx}
      />
      <TxButton
        label="Remove Bettor"
        type="SIGNED-TX"
        setStatus={setStatus}
        color='red'
        attrs={{
          palletRpc: 'nonFungibleAssets',
          callable: 'setCharacteristic',
          inputParams: [nfaOwner, nfaClass, { Bettor: null }],
          paramFields: ['organization_id', 'class_id', 'characteristic'],
        }}
        txOnClickHandler={handleTrx}
      />
    </div>
  )
}

/**
 * Show current bettor config
 * @param {*} param0 
 */
function BettorSummary({
  nfaBettor
}) {
  return (
    <>
      {nfaBettor ? (
        <div>
          <OutcomesView nfaBettorOutcomes={nfaBettor.outcomes} />
          <WinningsView nfaBettorWinnings={nfaBettor.winnings} />
          <Form.Input label='Rounds' placeholder='0' readOnly value={nfaBettor.rounds} />
          <Form.Input label='Draw outcome' placeholder='Win' readOnly value={nfaBettor.drawOutcome} />
        </div >
      ) : null
      }
    </>
  )
}

function OutcomesView({
  nfaBettorOutcomes
}) {
  const outcomes = nfaBettorOutcomes || []

  return (
    <div style={{ marginBottom: '1em' }}>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Outcomes</Table.HeaderCell>
            <Table.HeaderCell>Probability</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {outcomes.map((o, i) => (
            <Table.Row key={'outcms-t-' + i}>
              <Table.Cell>{o.name}</Table.Cell>
              <Table.Cell>{o.probability}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

function WinningsView({
  nfaBettorWinnings
}) {
  const winnings = nfaBettorWinnings || []

  const WininngsFormater = ({ winning }) => {
    const asset = 'Fa' in winning ? 'Fa' : 'Nfa'
    return (
      <div>
        {asset === 'Fa' ? (
          <div>
            <Label>
              <Icon name='sun' />{winning[asset][0]}
            </Label>
            <span style={{ marginLeft: '1em' }}>Amount {winning[asset][1]}</span>
          </div>
        ) : (
          <div>
            <Label>
              <Icon name='diamond' />{winning[asset]}
            </Label>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '1em' }}>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Winnings</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {winnings.map((w, i) => (
            <Table.Row key={'winnings-t-' + i}>
              <Table.Cell><WininngsFormater winning={w} /></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

function OutcomesForm({
  outcomes,
  setOutcomes,
  setShowForm,
}) {
  const [name, setName] = useState('')
  const [probability, setProbability] = useState(0)

  const handleChange = (e, { name, value }) => {
    switch (name) {
      case 'name':
        setName(value)
        break;
      case 'probability':
        setProbability(value)
        break;
      default:
        break;
    }
  }

  const addOutcome = () => {
    const outcome = {
      name,
      probability
    }
    const newOucomes = [...outcomes, outcome]
    setOutcomes(newOucomes)
    clearForm()
    setShowForm(false)
  }

  const clearForm = () => {
    setName('')
    setProbability(0)
  }

  return (
    <div>
      <Form.Input
        icon='tag'
        iconPosition='left'
        label='Name'
        placeholder='Outcome Name (text)'
        name='name'
        value={name}
        onChange={handleChange}
        id='name'
      />
      <Form.Input
        icon='tag'
        iconPosition='left'
        label='Probability'
        placeholder='Outcome Probability (number)'
        name='probability'
        type="number"
        value={probability}
        onChange={handleChange}
        id='probability'
      />
      <Form.Group>
        <Form.Button
          icon='add'
          label='Add'
          onClick={addOutcome}
          type='button'
        />
        <Form.Button
          icon='close'
          label='Cancel'
          onClick={() => { setShowForm(false); clearForm(); }}
          type='button'
        />
      </Form.Group>
    </div>
  )
}

function WinningForm({
  winnings,
  setWinnings,
  setShowForm,
}) {
  const [wType, setWType] = useState('')
  const [nfaClassId, setNfaClassId] = useState('')
  const [faAssetId, setFaAssetId] = useState('')
  const [faAmount, setAmount] = useState('')

  const options = [
    { key: 0, text: 'FA', value: 'Fa', icon: 'sun' },
    { key: 1, text: 'NFA', value: 'Nfa', icon: 'diamond' },
  ]

  const addOutcome = () => {
    const val = wType === 'Fa' ? [faAssetId, faAmount] : nfaClassId
    const winning = {
      [wType]: val
    }
    const newWinnings = [...winnings, winning]
    setWinnings(newWinnings)
    clearForm()
    setShowForm(false)
  }

  const handleChange = (e, { name, value }) => {
    switch (name) {
      case 'wType':
        setWType(value)
        setNfaClassId('')
        setFaAssetId('')
        setAmount('')
        break;
      case 'amount':
        setAmount(value)
        break;
      default:
        break;
    }
  }

  const clearForm = () => {
    setWType('')
    setNfaClassId('')
    setFaAssetId('')
    setAmount('')
  }

  return (
    <div>
      {/* <Form> */}
      <Form.Dropdown
        label='Type'
        onChange={handleChange}
        fluid
        options={options}
        placeholder='Type'
        selection
        name='wType'
        value={wType}
        id='wType'
        style={{ width: '10em' }}
      />
      {wType === 'Nfa' ? (
        <Form.Field>
          <label>NFA id</label>
          <NfaSelector selectedNfa={nfaClassId} setSelectedNfa={setNfaClassId} />
        </Form.Field>
      ) : (
        <div>
          <Form.Field>
            <label>FA id</label>
            <FaSelector selectedFa={faAssetId} setSelectedFa={setFaAssetId} />
          </Form.Field>
          <Form.Field>
            <Form.Input
              icon='tag'
              iconPosition='left'
              label='Amount'
              placeholder='Amount of Fa (number)'
              name='amount'
              type="number"
              value={faAmount}
              onChange={handleChange}
              id='probability'
            />
          </Form.Field>
        </div>
      )}
      <Form.Group>
        <Form.Button
          icon='add'
          label='Add'
          onClick={addOutcome}
          type='button'
        />
        <Form.Button
          icon='close'
          label='Cancel'
          onClick={() => { setShowForm(false); clearForm(); }}
          type='button'
        />
      </Form.Group>
      {/* </Form > */}
    </div>
  )
}

function BettorView({
  nfaBettor,
  nfaOwner,
  nfaClass,
  setStatus,
}) {
  const [showNewBettorForm, setShowNewBettorForm] = useState(false)

  const handleEditorDone = () => {
    setShowNewBettorForm(false)
  }

  return (
    <div>
      <BettorSummary nfaBettor={nfaBettor} />
      {showNewBettorForm ? (
        <>
          <Divider />
          <Header as="h4">New Bettor</Header>
          <BettorEditor nfaBettor={nfaBettor} nfaClass={nfaClass} nfaOwner={nfaOwner} setStatus={setStatus} done={handleEditorDone} />
        </>
      ) : (
        <Button
          icon
          labelPosition='left'
          // primary
          size='small'
          onClick={() => setShowNewBettorForm(true)}
          style={{ marginTop: '1em' }}
        >
          <Icon name={nfaBettor ? "edit" : "add"} /> {nfaBettor ? "Replace" : "Add"} Bettor
        </Button>
      )}
    </div>
  )
}

export {
  BettorEditor,
  BettorView,
}
