/* eslint-disable no-unused-vars */
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
import RspGameMain from './RspGameMain'

function Main() {
  const { apiState, apiError, keyringState } = useSubstrateState()
  const [menuActiveItem, setMenuActiveItem] = useState('home')
  const [splash, setSplash] = useState(false)
  const [splashText, setSplashText] = useState('')
  
  if (keyringState !== 'READY') return (
    <div></div>
  );

  const loader = (text) => {
    if (splashText === text) return;
    setSplashText(text)
    setSplash(!!text)
  }

  const Splash = ({
    text
  }) => {
    return (
      <Dimmer active={splash}>
        <Loader size="small">{text}</Loader>
      </Dimmer>
    )
  }

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to FinalBiome"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
  )

  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') loader('Connecting to FinalBiome')
  else if (keyringState !== 'READY') {
    loader(
      "Loading accounts (please review any extension's authorization)"
    )
  }
  if (keyringState === 'READY') {
    loader('')
  }

  const contextRef = createRef()

  return (
    <div>
      {!splash ? (
        <div ref={contextRef}>
          <Sticky context={contextRef}>
            <Container>
              <AccountSelector changeMenuItem={(name) => setMenuActiveItem(name)} currentMenuItem={menuActiveItem} />
            </Container>
          </Sticky>
          <Container>
            <Grid stackable columns="equal">
              {menuActiveItem === 'home' ?
                <>
                  <Grid.Row stretched>
                    <NodeInfo />
                    <Metadata />
                    <BlockNumber />
                    <BlockNumber finalized />
                  </Grid.Row>
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
                  </div>
                </> : null

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
              {menuActiveItem === 'rsp-game' ?
                <Grid.Row>
                  <RspGameMain />
                </Grid.Row>
                : null
              }
              <Grid.Row>
                <Events />
              </Grid.Row>
            </Grid>
          </Container>
        </div>
      ) : <Splash text={splashText} />}
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
