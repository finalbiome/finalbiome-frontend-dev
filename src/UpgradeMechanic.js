import { useEffect, useState } from 'react'
import { Dropdown, Form, FormField, Grid, Header, Icon, Label } from 'semantic-ui-react'
import { AccountSelector } from './components/AccountSelector'
import { TxStatusView } from './components/TxStatusView'
import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'


function UpgradeMechanic(props) {
  const [selectedMechanic, setSelectedMechanic] = useState('')
  const [status, setStatus] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [data, setData] = useState('')

  const handleTrx = (unsub => {
    if (unsub && typeof unsub === 'function') {
      unsub()
    }
    clearForm()
  })

  const clearForm = () => {
    setSelectedMechanic('')
    setSelectedAccount('')
  }

  const createData = () => {
    if (!selectedMechanic) {
      setData('')
      return
    }
    const constructMechanicUpgradeData = () => {
      const mech = selectedMechanic.split('#')
      return {
        mechanic_id: {
          account_id: mech[0],
          nonce: mech[1],
        },
        payload: 'Bet',
      }
    }
    setData(constructMechanicUpgradeData())
  }
  useEffect(createData, [selectedMechanic, selectedAccount])

  return (
    <Grid.Column>
      <Header as='h2'>Upgrade Mechanic</Header>
      <Form>
        <FormField>
          <label>Game</label>
          <AccountSelector selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} onlyOrgs={true} placeholder={'Select the game...'} />
        </FormField>
        <FormField>
          <label>Mechanic</label>
          <ActiveMechanicsDropdown selectedMechanicId={selectedMechanic} setSelectedMechanicId={setSelectedMechanic} accountNonce={props.accountNonce} />
        </FormField>
        <Form.Group>
          <FormField>
            <TxButton
              label="Upgrade"
              type="SIGNED-TX"
              setStatus={setStatus}
              attrs={{
                palletRpc: 'mechanics',
                callable: 'upgrade',
                inputParams: [data],
                paramFields: ['upgrage_data'],
              }}
              txOnClickHandler={handleTrx}
            />
          </FormField>
          <Form.Button
            basic
            content='Cancel'
            onClick={handleTrx}
            type='button'
          />
        </Form.Group>
      </Form>
      <TxStatusView status={status} setStatus={setStatus} />
    </Grid.Column>
  )
}

function ActiveMechanicsDropdown({
  selectedMechanicId,
  setSelectedMechanicId, // returns as joined via # string
  accountNonce, // for update options
}) {
  const { api, currentAccount } = useSubstrateState()
  const [mechanicsIds, setMechanicsIds] = useState([])
  const [mechanicsOptions, setMechanicsOptions] = useState([])

  const handleChange = (e, { value }) => { setSelectedMechanicId(value) }

  const getActiveMechnics = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.mechanics.mechanics.keys(currentAccount.address,
        keys => {
          const ids = keys.map(key => key.args.map(k => k.toJSON()));
          setMechanicsIds(ids)
        })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(getActiveMechnics, [api, currentAccount, accountNonce])

  const fillOptions = () => {
    let options = mechanicsIds.map((id, idx) => {
      return {
        key: JSON.stringify(id),
        text: JSON.stringify(id),
        value: mechanicsIds[idx].join('#'),
        content: (
          <Label>
            <Icon name='cogs' />
            {JSON.stringify(id)}
          </Label>
        ),
      }
    });
    setMechanicsOptions(options)
  }
  useEffect(fillOptions, [mechanicsIds])

  const handleRefresh = () => getActiveMechnics()

  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <Dropdown
        placeholder={'Select Mechanic...'}
        fluid
        selection
        search
        clearable
        options={mechanicsOptions}
        value={selectedMechanicId}
        onChange={handleChange}
      />
      <Icon link name='refresh' style={{ marginLeft: '1rem', marginBottom: '0.5rem' }} color='grey' onClick={handleRefresh} />
    </div>
  )
}

export {
  UpgradeMechanic
}
