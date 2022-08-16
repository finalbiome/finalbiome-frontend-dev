import { useState } from 'react'
import { Form, FormField, Grid, Header } from 'semantic-ui-react'
import { AccountSelector } from './components/AccountSelector'
import { TxStatusView } from './components/TxStatusView'
import { TxButton } from './substrate-lib/components'


function OnboardGame({
  organizationId,
  done,
}) {
  const [selectedAccount, setSelectedAccount] = useState('')
  const [status, setStatus] = useState('')

  const handleTrx = (unsub => {
    // setSelectedNfa('')
    // setSelectedOffer('')

    if (unsub && typeof unsub === 'function') {
      unsub()
    }

    if (done && typeof done === 'function') {
      done()
    }
  })

  return (
    <>
      <Grid.Column>
        <Header as="h2">Onboard to the Game</Header>
        <Form>
          <FormField>
            <label>Game</label>
            <AccountSelector selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} onlyOrgs={true} placeholder={'Select the game...'} />
          </FormField>
          <Form.Group>
            <FormField>
              <TxButton
                label="Onboard"
                type="SIGNED-TX"
                setStatus={setStatus}
                attrs={{
                  palletRpc: 'organizationIdentity',
                  callable: 'onboarding',
                  inputParams: [selectedAccount],
                  paramFields: ['organizationId'],
                }}
                txOnClickHandler={handleTrx}
              />
            </FormField>
          </Form.Group>
        </Form>
        <TxStatusView status={status} setStatus={setStatus} />
      </Grid.Column>
    </>
  )
}

export {
  OnboardGame
}
