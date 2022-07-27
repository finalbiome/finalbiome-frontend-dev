import React, { useState } from 'react'
import { TxButton } from './substrate-lib/components'

import { FaSelector } from './Organizations'

import {
  Table, Button, Form, Icon, Divider, Label, Header, List
} from 'semantic-ui-react'

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
              {JSON.stringify(a.value)}
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
              <Table.Cell>{o.fa}</Table.Cell>
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

function AttributeForm({
  attributes,
  setAttributes,
  setShowForm
}) {
  const [nameAttr, setNameAttr] = useState('')
  const [typeAttr, setTypeAttr] = useState('Text')
  const [numberValue, setNumberValue] = useState('')
  const [numberMax, setNumberMax] = useState('')
  const [textValue, setTextValue] = useState('')

  const options = [
    { key: 0, text: 'Number', value: 'Number' },
    { key: 1, text: 'Text', value: 'Text' },
  ]

  const handleChange = (e, { name, value }) => {
    switch (name) {
      case 'nameAttr':
        setNameAttr(value)
        break;
      case 'typeAttr':
        setTypeAttr(value)
        break;
      case 'numberValue':
        setNumberValue(value)
        break;
      case 'numberMax':
        setNumberMax(value)
        break;
      case 'textValue':
        setTextValue(value)
        break;
      default:
        break;
    }
  }

  const addAttribute = () => {
    const attr = {
      key: nameAttr,
      value: typeAttr === 'Text' ? {
        [typeAttr]: textValue
      } : {
        [typeAttr]: {
          numberValue: numberValue,
          numberMax: numberMax
        }
      }
    }
    const attrs = [...attributes, attr]
    setAttributes(attrs)
    clearForm()
    setShowForm(false)
  }

  const clearForm = () => {
    setNameAttr('')
    setTypeAttr('Text')
    setNumberValue('')
    setNumberMax('')
    setTextValue('')
  }

  return (
    <div>
      <Form.Group key='a0' >
        <Form.Input
          icon='tag'
          iconPosition='left'
          label='Attr Name'
          placeholder='Attr Name (text)'
          name='nameAttr'
          value={nameAttr}
          onChange={handleChange}
          id='nameAttr'
        />
        <Form.Dropdown
          label='Type'
          onChange={handleChange}
          fluid
          options={options}
          placeholder='Choose a type'
          selection
          name='typeAttr'
          value={typeAttr}
          id='typeAttr'
          style={{ width: '10em' }}
        />
        {typeAttr === 'Number' ?
          <Form.Group widths='equal'>
            <Form.Input
              icon='dollar'
              iconPosition='left'
              label='Value'
              placeholder='Value (number)'
              type="number"
              name='numberValue'
              value={numberValue}
              onChange={handleChange}
              id='numberValue'
              style={{ width: '10em' }}
            />
            <Form.Input
              icon='sun'
              iconPosition='left'
              label='Max Value'
              placeholder='Max Value (number)'
              type="number"
              name='numberMax'
              value={numberMax}
              onChange={handleChange}
              id='numberMax'
              style={{ width: '10em' }}
            />
          </Form.Group>
          : <Form.Input
            icon='dollar'
            iconPosition='left'
            label='Value'
            placeholder='Value (text)'
            name='textValue'
            value={textValue}
            onChange={handleChange}
            key='textValue'
          />
        }
        <Form.Button
          icon='add'
          label='Add'
          onClick={addAttribute}
          type='button'
        />
      </Form.Group>
    </div>
  )
}

function AttributeView({
  attributes
}) {
  if (attributes.length === 0) return null
  return (
    <Table style={{ marginBottom: '1em' }}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Attribute Key</Table.HeaderCell>
          <Table.HeaderCell>Value</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {attributes.map((a, i) => (
          <Table.Row key={'attr-f-' + i}>
            <Table.Cell>{a.key}</Table.Cell>
            <Table.Cell>{JSON.stringify(a.value)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
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
