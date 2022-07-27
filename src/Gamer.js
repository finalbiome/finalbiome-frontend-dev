import { useSubstrateState } from './substrate-lib'

import {
  // eslint-disable-next-line no-unused-vars
  Table, Grid, Label, Button, Form, Input, Header, Menu, Icon, Segment,
  // eslint-disable-next-line no-unused-vars
  Dropdown, Tab, Checkbox, Accordion
} from 'semantic-ui-react'
import { FaBalance } from './FaBalance'

function Main(props) {
  return (
    <Grid.Column>
      <Header as="h1">Gamer</Header>
      <Grid>
        <Grid.Row stretched>
          <FaBalance />
          {/* Menu */}
          {/* <Grid.Column width={2}>
            <Menu icon='labeled' vertical>
              <Menu.Item
                name='orgs'
                active={menuActiveItem === 'orgs'}
                onClick={handleItemClick}
              >
                <Icon name='game' />
                Orgs
              </Menu.Item>

              <Menu.Item
                name='fa'
                active={menuActiveItem === 'fa'}
                onClick={handleItemClick}
              >
                <Icon name='sun' />
                FA
              </Menu.Item>

              <Menu.Item
                name='nfa'
                active={menuActiveItem === 'nfa'}
                onClick={handleItemClick}
              >
                <Icon name='diamond' />
                NFA
              </Menu.Item>
            </Menu>
          </Grid.Column> */}
          {/* Content */}
          {/* <Grid.Column width={14}>
            {menuActiveItem === 'orgs' ?
              <div>
                <OrganizationsList {...props} />
                <CreateOrganization {...props} />
                <ManageMembers {...props} />
              </div>
              : null}
            {menuActiveItem === 'fa' ?
              <div>
                <FA />
              </div>
              : null}
            {menuActiveItem === 'nfa' ?
              <div>
                <NFA />
              </div>
              : null}
          </Grid.Column> */}

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
