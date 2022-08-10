import { useEffect, useState } from 'react'
import { Form, Table } from 'semantic-ui-react'
import { TxButton } from '../substrate-lib/components'
import { formatAttribute } from './AttributesHint'

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
          width={4}
          icon='tag'
          iconPosition='left'
          label='Attr Name'
          placeholder='Name'
          name='nameAttr'
          value={nameAttr}
          onChange={handleChange}
          id='nameAttr'
        />
        <Form.Dropdown
          width={4}
          label='Type'
          onChange={handleChange}
          fluid
          options={options}
          placeholder='Choose a type'
          selection
          name='typeAttr'
          value={typeAttr}
          id='typeAttr'
        />
        {typeAttr === 'Number' ?
          <>
            <Form.Input
              width={4}
              icon='dollar'
              iconPosition='left'
              label='Value'
              placeholder='0'
              type="number"
              name='numberValue'
              value={numberValue}
              onChange={handleChange}
              id='numberValue'
            />
            <Form.Input
              width={4}
              icon='dollar'
              iconPosition='left'
              label='Max Value'
              placeholder='Max Value'
              type="number"
              name='numberMax'
              value={numberMax}
              onChange={handleChange}
              id='numberMax'
            />
          </>
          : <Form.Input
            width={8}
            icon='text cursor'
            iconPosition='left'
            label='Value'
            placeholder='Text'
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

function AttributeFormAddToClass({
  organizationId,
  classId,
  setStatus,
  done,
}) {
  const [nameAttr, setNameAttr] = useState('')
  const [typeAttr, setTypeAttr] = useState('Text')
  const [numberValue, setNumberValue] = useState('')
  const [numberMax, setNumberMax] = useState('')
  const [textValue, setTextValue] = useState('')
  const [attribute, setAttribute] = useState('')

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
        setNumberValue('')
        setNumberMax('')
        setTextValue('')
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

  const setAttributeFromData = () => {
    if (!(nameAttr && typeAttr)) {
      setAttribute('')
      return
    }
    if (typeAttr === 'Text' && !textValue) {
      setAttribute('')
      return
    }
    if (typeAttr === 'Number' && !numberValue) {
      setAttribute('')
      return
    }


    setAttribute({
      key: nameAttr,
      value: typeAttr === 'Text' ? {
        [typeAttr]: textValue
      } : {
        [typeAttr]: {
          numberValue: numberValue,
          numberMax: numberMax || null,
        }
      }
    })
  }
  useEffect(setAttributeFromData, [nameAttr, typeAttr, numberValue, numberMax, textValue])

  const handleTrx = (unsub => {
    clearForm()
    if (done && typeof done === 'function') {
      done()
    }
  })

  const clearForm = () => {
    setNameAttr('')
    setTypeAttr('Text')
    setNumberValue('')
    setNumberMax('')
    setTextValue('')
  }

  return (
    <>
      <Form.Group key='a0' >
        <Form.Input
          width={4}
          icon='tag'
          iconPosition='left'
          label='Attr Name'
          placeholder='Name'
          name='nameAttr'
          value={nameAttr}
          onChange={handleChange}
          id='nameAttr'
        />
        <Form.Dropdown
          width={4}
          label='Type'
          onChange={handleChange}
          fluid
          options={options}
          placeholder='Choose a type'
          selection
          name='typeAttr'
          value={typeAttr}
          id='typeAttr'
        />
        {typeAttr === 'Number' ?
          <>
            <Form.Input
              width={4}
              icon='dollar'
              iconPosition='left'
              label='Value'
              placeholder='0'
              type="number"
              name='numberValue'
              value={numberValue}
              onChange={handleChange}
              id='numberValue'
            />
            <Form.Input
              width={4}
              icon='dollar'
              iconPosition='left'
              label='Max Value'
              placeholder='Max Value'
              type="number"
              name='numberMax'
              value={numberMax}
              onChange={handleChange}
              id='numberMax'
            />
          </>
          : <Form.Input
            width={8}
            icon='text cursor'
            iconPosition='left'
            label='Value'
            placeholder='Text'
            name='textValue'
            value={textValue}
            onChange={handleChange}
            key='textValue'
          />
        }
        <Form.Field>
          <label><br></br></label>
          <TxButton
            icon='add'
            // label='Add'
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'nonFungibleAssets',
              callable: 'createAttribute',
              inputParams: [organizationId, classId, attribute],
              paramFields: ['organization_id', 'class_id', 'attribute'],
            }}
            txOnClickHandler={handleTrx}
          color='green'
          />
        </Form.Field>
      </Form.Group>
    </>
  )
}

function AttributeView({
  attributes,
  doRemove = false, // if true, attributes can be removed
  classId,
  organizationId,
  setStatus,
  done,
}) {
  if (!attributes || attributes.length === 0) return null

  const handleTrx = (unsub => {
    // if (unsub && typeof unsub === 'function') {
    //   unsub()
    // }

    if (done && typeof done === 'function') {
      done()
    }
  })

  return (
    <Table style={{ marginBottom: '1em' }}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Attribute Key</Table.HeaderCell>
          <Table.HeaderCell>Value</Table.HeaderCell>
          {doRemove ? (
            <Table.HeaderCell></Table.HeaderCell>
          ) : null}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {attributes.map((a, i) => (
          <Table.Row key={'attr-f-' + a.key}>
            <Table.Cell>{a.key}</Table.Cell>
            <Table.Cell>{formatAttribute(a.value)}</Table.Cell>
            {doRemove ? (
              <Table.Cell collapsing>
                <TxButton
                  label='Remove Attribute'
                  type="SIGNED-TX"
                  setStatus={setStatus}
                  attrs={{
                    palletRpc: 'nonFungibleAssets',
                    callable: 'removeAttribute',
                    inputParams: [organizationId, classId, a.key],
                    paramFields: ['organization_id', 'class_id', 'attribute_name'],
                  }}
                  txOnClickHandler={handleTrx}
                  icon='minus'
                  color='red'
                  buttonType='icon'
                />
              </Table.Cell>
            ) : null}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export {
  AttributeForm,
  AttributeView,
  AttributeFormAddToClass,
}
