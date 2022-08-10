import React, { useState } from 'react'
import { TxButton } from './substrate-lib/components'

import { FaSelector } from './components/FaSelector'

import {
  Table, Button, Form, Icon, Divider, Label, Header, List
} from 'semantic-ui-react'
import { AttributeForm, AttributeView } from './components/Attributes'
import { formatAttribute } from './components/AttributesHint'
import { FaInstanceView } from './components/FaInstanceView'

function PurchasedEditor({
  nfaPurchased,
  nfaOwner,
  nfaClass,
  setStatus,
  done,
}) {
  const [showNewOfferForm, setShowNewOfferForm] = useState(false)
  const [offers, setOffers] = useState(false)

  const handleTrx = (unsub => {
    setShowNewOfferForm(false)
    setOffers([])

    if (unsub && typeof unsub === 'function') {
      unsub()
    }

    if (done && typeof done === 'function') {
      done()
    }
  })

  return (
    <div>
      <Header as='h4'>Offers</Header>
      <OffersView offers={offers} />
      {showNewOfferForm ? (
        <OffersForm offers={offers} setOffers={setOffers} setShowForm={setShowNewOfferForm} />
      ) : (
        <Form.Button
          icon
          labelPosition='left'
          // primary
          size='small'
          onClick={() => setShowNewOfferForm(true)}
        >
          <Icon name='add' /> Add Offer
        </Form.Button>
      )}
      <Button
        basic
        content='Cancel'
        onClick={handleTrx}
        type='button'
      />
      <TxButton
        label="Update Purchased"
        type="SIGNED-TX"
        setStatus={setStatus}
        attrs={{
          palletRpc: 'nonFungibleAssets',
          callable: 'setCharacteristic',
          inputParams: [nfaOwner, nfaClass, {
            Purchased: {
              offers,
            }
          }],
          paramFields: ['organization_id', 'class_id', 'characteristic'],
        }}
        txOnClickHandler={handleTrx}
      />
      <TxButton
        label="Remove Purchased"
        type="SIGNED-TX"
        setStatus={setStatus}
        color='red'
        attrs={{
          palletRpc: 'nonFungibleAssets',
          callable: 'setCharacteristic',
          inputParams: [nfaOwner, nfaClass, { Purchased: null }],
          paramFields: ['organization_id', 'class_id', 'characteristic'],
        }}
        txOnClickHandler={handleTrx}
      />
    </div>
  )

}

function PurchasedSummary({
  nfaPurchased
}) {
  return (
    <>
      {nfaPurchased && nfaPurchased.offers ? (
        <div>
          <Header as='h4'>Offers</Header>
          <OffersView offers={nfaPurchased.offers} />
        </div >
      ) : null
      }
    </>
  )
}

function OffersView({
  offers
}) {
  if (!offers) return null
  const FormatedAttributes = ({ attrs }) => {
    return (
      <div>
        <List>
          {attrs && attrs.map((a, i) => (
            <List.Item key={'fattr-' + i}>
              <Label horizontal>{a.key}</Label>
              {formatAttribute(a.value)}
            </List.Item>
          ))}
        </List>
      </div>
    )
  }
  return (
    <div style={{ marginBottom: '1em' }}>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>FA</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Attributes</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {offers.map((o, i) => (
            <Table.Row key={'offr-t-' + i}>
              <Table.Cell><FaInstanceView faId={o.fa} /></Table.Cell>
              <Table.Cell>{o.price}</Table.Cell>
              <Table.Cell><FormatedAttributes attrs={o.attributes} /></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

function OffersForm({
  offers,
  setOffers,
  setShowForm
}) {
  const [fa, setFa] = useState('')
  const [price, setPrice] = useState('')
  const [attributes, setAttributes] = useState([])
  const [showNewAttributeForm, setShowNewAttributeForm] = useState(false)

  const addOffer = (e) => {
    e.preventDefault();
    const existingOffers = [...offers || []]
    const newOffer = {
      fa,
      price,
      attributes,
    }
    existingOffers.push(newOffer)
    setOffers(existingOffers)
    setShowForm(false)
    clearForm()
  }

  const clearForm = () => {
    setFa('')
    setPrice('')
    setAttributes([])
    setShowNewAttributeForm(false)
  }

  const handleChange = (e, { name, value }) => {
    switch (name) {
      case 'fa':
        setFa(value)
        break;
      case 'price':
        setPrice(value)
        break;
      default:
        break;
    }
  }
  return (
    <div>
      <Form.Group key='o0' widths='equal'>
        <Form.Field>
          <label>FA id</label>
          <FaSelector selectedFa={fa} setSelectedFa={(v) => handleChange(null, { name: 'fa', value: v })} />
        </Form.Field>
        <Form.Input
          icon='dollar'
          iconPosition='left'
          label='Price'
          placeholder='Price (number)'
          name='price'
          value={price}
          onChange={handleChange}
          key='o2'
          type="number"
        />
      </Form.Group>
      {attributes.length > 0 ? (
        <AttributeView attributes={attributes} />
      ) : null}
      {showNewAttributeForm ? (
        <AttributeForm attributes={attributes} setAttributes={setAttributes} setShowForm={setShowNewAttributeForm} />
      ) : (
        <Form.Button
          icon
          labelPosition='left'
          size='small'
          onClick={() => setShowNewAttributeForm(true)}
        >
          <Icon name='add' /> Add Attribute
        </Form.Button>
      )}
      <Form.Group>
        <Form.Button
          icon='add'
          label='Add'
          onClick={addOffer}
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

function PurchasedView({
  nfaPurchased,
  nfaOwner,
  nfaClass,
  setStatus,
}) {
  const [showNewPurchasedForm, setShowNewPurchasedForm] = useState(false)

  const handleEditorDone = () => {
    setShowNewPurchasedForm(false)
  }

  return (
    <div>
      <PurchasedSummary nfaPurchased={nfaPurchased} />
      {showNewPurchasedForm ? (
        <>
          <Divider />
          <Header as="h4">New Purchased</Header>
          <PurchasedEditor nfaPurchased={nfaPurchased} nfaClass={nfaClass} nfaOwner={nfaOwner} setStatus={setStatus} done={handleEditorDone} />
        </>
      ) : (
        <Button
          icon
          labelPosition='left'
          // primary
          size='small'
          onClick={() => setShowNewPurchasedForm(true)}
          style={{ marginTop: '1em' }}
        >
          <Icon name={nfaPurchased ? "edit" : "add"} /> {nfaPurchased ? "Replace" : "Add"} Purchased
        </Button>
      )}
    </div>
  )
}

export {
  PurchasedView,
}
