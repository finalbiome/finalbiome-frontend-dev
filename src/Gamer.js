import { useSubstrateState } from './substrate-lib'

import {
  Grid, Header} from 'semantic-ui-react'
import { FaBalance } from './FaBalance'
import { NfaBalance } from './NfaBallance'
import { ExecuteMechanic } from './ExecuteMechanic'
import { UpgradeMechanic } from './UpgradeMechanic'
import { OnboardGame } from './OnboardGame'
import { useEffect, useState } from 'react'

function Main(props) {
  const { api, currentAccount } = useSubstrateState()
  const [accountNonce, setAccountNonce] = useState(0)

  const getAccountNonce = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.system.account(currentAccount.address, entity => {
        const nonce = entity.nonce.isEmpty ? 0 : entity.nonce.toNumber()
        setAccountNonce(nonce);
      })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(getAccountNonce, [api, currentAccount])


  return (
    <Grid.Column>
      <Header as="h1">Gamer</Header>
      <Grid stackable columns="equal">
        <Grid.Row >
          <FaBalance {...props} accountNonce={accountNonce} />
          <NfaBalance {...props} accountNonce={accountNonce} />
        </Grid.Row>
        <Grid.Row>
          <OnboardGame />
        </Grid.Row>
        <Grid.Row>
          <ExecuteMechanic />
        </Grid.Row>
        <Grid.Row>
          <UpgradeMechanic {...props} accountNonce={accountNonce} />
        </Grid.Row>
      </Grid>
    </Grid.Column>
  )
}

export default function Gamer(props) {
  const { api, keyring } = useSubstrateState()
  return api && keyring.getPairs && api.query ? (
    <Main {...props} />
  ) : null
}
