import { useEffect, useState } from 'react'
import { Button, Divider, Form, Header, Icon, Table } from 'semantic-ui-react'
import { AccountSelector } from './components/AccountSelector'
import { AttributeForm, AttributeView } from './components/Attributes'
import { AttributesHint } from './components/AttributesHint'
import { FaInstanceView } from './components/FaInstanceView'
import { FaSelector } from './components/FaSelector'
import { NfaClassView } from './components/NfaClassView'
import { NfaSelector } from './components/NfaSelector'
import { TxStatusView } from './components/TxStatusView'
import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

function OnboardAssetsView(props) {
  const { api } = useSubstrateState()

  const [org, setOrg] = useState('')
  const [onboardingAssets, setOnboardingAssets] = useState([])
  const [showEditorForm, setShowEditorForm] = useState(false)
  const [status, setStatus] = useState('')

  const fetchOrgDetails = () => {
    let unsub = null
    const asyncFetch = async () => {
      if (!org) return null
      unsub = await api.query.organizationIdentity.organizations(org, detail => {
        if (detail.isSome) {
          const d = detail.toHuman()
          setOnboardingAssets(d.onboardingAssets || [])
        } else {
          setOnboardingAssets([])
        }
      })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(fetchOrgDetails, [api, org])

  return (
    <>
      <Header as='h3'>Onboard Assets</Header>
      <Form>
        <Form.Field>
          <label>Game</label>
          <AccountSelector selectedAccount={org} setSelectedAccount={setOrg} onlyOrgs={true} placeholder={'Select Game...'} />
        </Form.Field>
        {org ? (
          <div>
            <OnboardAssetsSummary assets={onboardingAssets} />
            {showEditorForm ? (
              <>
                <Divider />
                <Header as="h4">New Onboard Assets</Header>
                <OnboardAssetsEditor organizationId={org} setShowForm={setShowEditorForm} setStatus={setStatus} />
              </>
            ) : (
              <Button
                icon
                labelPosition='left'
                // primary
                size='small'
                onClick={() => setShowEditorForm(true)}
                style={{ marginTop: '1em' }}
              >
                <Icon name={onboardingAssets.length > 0 ? "edit" : "add"} /> {onboardingAssets.length > 0 ? "Replace" : "Add"} Assets
              </Button>
            )}
            <TxStatusView status={status} setStatus={setStatus} />
          </div>
        ) : null}
      </Form>
    </>
  )
}

function OnboardAssetsSummary({
  assets
}) {

  return (
    <div style={{ marginBottom: '1em' }}>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Assets</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {assets.map((a, i) => (
            <Table.Row key={'airassets-t-' + i}>
              <Table.Cell><AssetFormater asset={a} /></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

function AssetFormater({
  asset
}) {
  if (!asset) return null
  const assetType = 'Fa' in asset ? 'Fa' : 'Nfa'
  return (
    <>
      {assetType === 'Fa' ? (
        <>
          <FaInstanceView faId={asset[assetType][0]} />
          <span style={{ marginLeft: '1em' }}>{asset[assetType][1]}</span>
        </>
      ) : (
        <>
          <NfaClassView nfaClassId={asset[assetType][0]} />
          <span style={{ marginLeft: '1em' }}><AttributesHint attributes={asset[assetType][1].map(a => { return { name: a.key, value: a.value, inInstance: true } })} /></span>
        </>
      )}
    </>
  )
}

function OnboardAssetsEditor({
  organizationId,
  setShowForm,
  setStatus,
  done,
}) {

  const [wType, setWType] = useState('')
  const [nfaClassId, setNfaClassId] = useState('')
  const [faAssetId, setFaAssetId] = useState('')
  const [faAmount, setAmount] = useState('')
  const [attributes, setAttributes] = useState([])
  const [showNewAttributeForm, setShowNewAttributeForm] = useState(false)
  const [newAssets, setNewAssets] = useState([])

  const options = [
    { key: 0, text: 'FA', value: 'Fa', icon: 'sun' },
    { key: 1, text: 'NFA', value: 'Nfa', icon: 'diamond' },
  ]

  const clearForm = () => {
    setWType('')
    setNfaClassId('')
    setFaAssetId('')
    setAmount('')
    setAttributes([])
    setShowNewAttributeForm(false)
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

  const addAsset = (e) => {
    e.preventDefault();
    const existingAssets = [...newAssets]
    if (wType === 'Fa') {
      const newAsset = {
        [wType]: [faAssetId, faAmount]
      }
      existingAssets.push(newAsset)
    } else {
      const newAsset = {
        [wType]: [nfaClassId, attributes]
      }
      existingAssets.push(newAsset)
    }
    setNewAssets(existingAssets)
    setShowNewAttributeForm(false)
    clearForm()
  }

  const handleTrx = (unsub => {
    setShowForm(false)
    setNewAssets([])
    clearForm()

    if (unsub && typeof unsub === 'function') {
      unsub()
    }

    if (done && typeof done === 'function') {
      done()
    }
  })

  return (
    <>
      <OnboardAssetsSummary assets={newAssets} />
      <Divider />
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
      {wType ? (
        <>
          {wType === 'Nfa' ? (
            <>
              <Form.Field>
                <label>NFA id</label>
                <NfaSelector selectedNfa={nfaClassId} setSelectedNfa={setNfaClassId} style={{ width: '10em', marginBottom: '1rem' }} />
              </Form.Field>
              <Form.Field>
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
              </Form.Field>
            </>
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
                />
              </Form.Field>
            </div>
          )}
          <Form.Group>
            <Form.Button
              icon='add'
              label='Add'
              onClick={addAsset}
              type='button'
            />
            <Form.Button
              icon='close'
              label='Cancel'
              onClick={() => { setShowNewAttributeForm(false); clearForm(); }}
              type='button'
            />
          </Form.Group>
        </>
      ) : null}
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
          palletRpc: 'organizationIdentity',
          callable: 'setOnboardingAssets',
          inputParams: [organizationId, newAssets],
          paramFields: ['organization_id', 'assets'],
        }}
        txOnClickHandler={handleTrx}
      />
      <TxButton
        label="Remove Purchased"
        type="SIGNED-TX"
        setStatus={setStatus}
        color='red'
        attrs={{
          palletRpc: 'organizationIdentity',
          callable: 'setOnboardingAssets',
          inputParams: [organizationId, null],
          paramFields: ['organization_id', { value: 'assets', optional: true }],
        }}
        txOnClickHandler={handleTrx}
      />
    </>
  )
}

export {
  OnboardAssetsView
}
