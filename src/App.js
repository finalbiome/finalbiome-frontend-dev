import React, { createRef, useState } from 'react'
import {
  Container,
  Dimmer,
  Loader,
  Grid,
  Sticky,
  Message,
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import { SubstrateContextProvider, useSubstrateState } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'

import AccountSelector from './AccountSelector'
import Balances from './Balances'
import BlockNumber from './BlockNumber'
import Events from './Events'
import Interactor from './Interactor'
import Metadata from './Metadata'
import NodeInfo from './NodeInfo'
import TemplateModule from './TemplateModule'
import Transfer from './Transfer'
import Upgrade from './Upgrade'
import Organizations from './Organizations'
import Gamer from './Gamer'

function Main() {
  const { apiState, apiError, keyringState } = useSubstrateState()
  const [menuActiveItem, setMenuActiveItem] = useState('home')

  const loader = text => (
    <Dimmer active>
      <Loader size="small">{text}</Loader>
    </Dimmer>
  )

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to Substrate"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
  )

  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') return loader('Connecting to FinalBiome')

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    )
  }

  const contextRef = createRef()

  return (
    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <Container>
          <AccountSelector changeMenuItem={(name) => setMenuActiveItem(name)} currentMenuItem={menuActiveItem} />
        </Container>
      </Sticky>
      <Container>
        <Grid stackable columns="equal">
          <Grid.Row stretched>
            <NodeInfo />
            <Metadata />
            <BlockNumber />
            <BlockNumber finalized />
          </Grid.Row>
          <Grid.Row>
            <Events />
          </Grid.Row>
          {menuActiveItem === 'home' ?
            <div>
              <Grid.Row stretched>
                <Balances />
              </Grid.Row>
              <Grid.Row>
                <Transfer />
                <Upgrade />
              </Grid.Row>
              <Grid.Row>
                <Interactor />
                <Events />
              </Grid.Row>
              <Grid.Row>
                <TemplateModule />
              </Grid.Row>
            </div> : null
          }
          {menuActiveItem === 'developer' ?
            <Grid.Row>
              <Organizations />
            </Grid.Row>
            : null
          }
          {menuActiveItem === 'gamer' ?
            <Grid.Row>
              <Gamer />
            </Grid.Row>
            : null
          }
        </Grid>
      </Container>
      <DeveloperConsole />
    </div>
  )
}

export default function App() {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  )
}
