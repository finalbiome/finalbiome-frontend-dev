import React, { useState } from 'react'
import { Form, Input, Grid } from 'semantic-ui-react'
import { TxStatusView } from './components/TxStatusView'
import { TxButton } from './substrate-lib/components'

export default function Main(props) {
  const [status, setStatus] = useState('')
  const [proposal, setProposal] = useState({})

  const bufferToHex = buffer => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const handleFileChosen = file => {
    const fileReader = new FileReader()
    fileReader.onloadend = e => {
      const content = bufferToHex(fileReader.result)
      setProposal(`0x${content}`)
    }

    fileReader.readAsArrayBuffer(file)
  }

  return (
    <Grid.Column width={8}>
      <h1>Upgrade Runtime</h1>
      <Form>
        <Form.Field>
          <Input
            type="file"
            id="file"
            label="Wasm File"
            accept=".wasm"
            onChange={e => handleFileChosen(e.target.files[0])}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Upgrade"
            type="UNCHECKED-SUDO-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'system',
              callable: 'setCode',
              inputParams: [proposal],
              paramFields: [true],
            }}
          />
        </Form.Field>
        <TxStatusView status={status} setStatus={setStatus} />
      </Form>
    </Grid.Column>
  )
}
