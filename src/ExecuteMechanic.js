import React, { useState } from 'react'

import { Form, FormField, Grid, Header, } from 'semantic-ui-react'
import { AccountSelector } from './components/AccountSelector'
import { MechanicsDropdown } from './components/MechanicsDropdown'
import { NfaSelector } from './components/NfaSelector'
import { OfferSelector } from './components/OfferSelector'
import { TxStatusView } from './components/TxStatusView'
import { TxButton } from './substrate-lib/components'

function ExecuteMechanic(params) {
  const [selectedAccount, setSelectedAccount] = useState('')
  const [selectedMechanic, setSelectedMechanic] = useState('')
  // The transaction submission status
  const [status, setStatus] = useState('')

  const mechanicFinished = () => {
    setSelectedMechanic('')
  }

  return (
    <Grid.Column>
      <Header as='h2'>Execute Mechanic</Header>
      <Form>
        <FormField>
          <label>Game</label>
          <AccountSelector selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount} onlyOrgs={true} placeholder={'Select the game...'} />
        </FormField>
        <FormField>
          <label>Mechanic</label>
          <MechanicsDropdown selectedMechanic={selectedMechanic} setSelectedMechanic={setSelectedMechanic} />
        </FormField>
        {selectedMechanic === 'Purchased' ? (
          <PurchasedParams setStatus={setStatus} done={mechanicFinished} />
        ) : null}
        {selectedMechanic === 'Bettor' ? (
          <>Bettor Form</>
        ) : null}
      </Form>
      <TxStatusView status={status} setStatus={setStatus} />
    </Grid.Column>
  )
}

function PurchasedParams({
  setStatus,
  done
}) {
  const [selectedNfa, setSelectedNfa] = useState('')
  const [selectedOffer, setSelectedOffer] = useState('')

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
      <FormField>
        <label>NFA Class</label>
        <NfaSelector selectedNfa={selectedNfa} setSelectedNfa={(v) => {setSelectedNfa(v); setSelectedOffer('');}} />
      </FormField>
      <FormField>
        <label>Offer</label>
        <OfferSelector nfaClass={selectedNfa} selectedOffer={selectedOffer} setSelectedOffer={setSelectedOffer} />
      </FormField>
      <Form.Group>
        <TxButton
          label="Execute"
          type="SIGNED-TX"
          setStatus={setStatus}
          attrs={{
            palletRpc: 'mechanics',
            callable: 'execBuyNfa',
            inputParams: [selectedNfa, selectedOffer],
            paramFields: ['class_id', 'offer_id'],
          }}
          txOnClickHandler={handleTrx}
        />
        <Form.Button
          basic
          content='Cancel'
          onClick={handleTrx}
          type='button'
        />
      </Form.Group>
    </>
  )
}

export {
  ExecuteMechanic
}
