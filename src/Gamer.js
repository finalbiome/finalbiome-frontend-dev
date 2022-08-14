import { useSubstrateState } from './substrate-lib'

import {
  Grid, Header} from 'semantic-ui-react'
import { FaBalance } from './FaBalance'
import { NfaBalance } from './NfaBallance'
import { ExecuteMechanic } from './ExecuteMechanic'
import { UpgradeMechanic } from './UpgradeMechanic'

function Main(props) {
  return (
    <Grid.Column>
      <Header as="h1">Gamer</Header>
      <Grid stackable columns="equal">
        <Grid.Row >
          <FaBalance />
          <NfaBalance />
        </Grid.Row>
        <Grid.Row>
          <ExecuteMechanic />
        </Grid.Row>
        <Grid.Row>
          <UpgradeMechanic />
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
