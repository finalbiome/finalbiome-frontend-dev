import React, { useEffect, useState } from 'react'
import { Feed, Grid, Button, Icon, Dropdown } from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'

// Events to be filtered from feed
const FILTERED_EVENTS = [
  'system:ExtrinsicSuccess::(phase={"applyExtrinsic":0})',
]

const eventName = ev => `${ev.section}:${ev.method}`
// const eventParams = ev => JSON.stringify(ev.data)
const sectionToIconName = (section, method) => {
  switch (section) {
    case 'organizationIdentity':
      return 'game';
    case 'fungibleAssets':
      return 'sun';
    case 'nonFungibleAssets':
      return 'diamond';
    case 'mechanics':
      return 'cogs';
    case 'balances':
      return 'dollar';
    case 'system':
      switch (method) {
        case 'ExtrinsicSuccess':
          return 'check';
        default:
          break;
      }
      return 'microchip';

    default:
      return 'bell';
  }
}

function Main(props) {
  const { api, keyring } = useSubstrateState()
  const [eventFeed, setEventFeed] = useState([])
  const [filterOptions, setFilterOptions] = useState([])
  const [currentFilter, setCurrentFilter] = useState([])


  useEffect(() => {
    let unsub = null
    let keyNum = 0
    const allEvents = async () => {

      const eventToString = (event) => {
        if (api.events.system.ExtrinsicSuccess.is(event)) {
          // extract the data for this event
          // (In TS, because of the guard above, these will be typed)
          const [dispatchInfo] = event.data;

          console.debug(`ExtrinsicSuccess:: ${JSON.stringify(dispatchInfo.toHuman())}`);
          return JSON.stringify(event.data.toHuman());
        } else if (api.events.system.ExtrinsicFailed.is(event)) {
          // extract the data for this event
          // eslint-disable-next-line no-unused-vars
          const [dispatchError, dispatchInfo] = event.data;
          let errorInfo;

          // decode the error
          if (dispatchError.isModule) {
            // for module errors, we have the section indexed, lookup
            // (For specific known errors, we can also do a check against the
            // api.errors.<module>.<ErrorName>.is(dispatchError.asModule) guard)
            const decoded = api.registry.findMetaError(dispatchError.asModule.toU8a());

            errorInfo = `${decoded.section}.${decoded.name}`;
          } else {
            // Other, CannotLookup, BadOrigin, no extra info
            errorInfo = dispatchError.toString();
          }

          console.error(`ExtrinsicFailed: ${errorInfo}`);
          return errorInfo;
        }
        return JSON.stringify(event.data.toHuman());
      }

      const processEvent = (event) => {
        if (api.events.system.ExtrinsicSuccess.is(event)) {
          //
        } else if (api.events.system.ExtrinsicFailed.is(event)) {
          //
        } else {
          console.log(event.toHuman())
          const ev = event.toHuman();
          // Update account metadata with org name
          if (ev.method === 'CreatedOrganization' && ev.section === 'organizationIdentity') {
            const [orgName, org] = ev.data;
            const account = keyring.keyring.getPair(org);
            if (account) {
              account.setMeta({
                org:true,
                orgName,
              })
            }
          }
        }

      }

      unsub = await api.query.system.events(events => {
        // loop through the Vec<EventRecord>
        events.forEach(record => {
          // extract the phase, event and the event types
          const { event, phase } = record

          // show what we are busy with
          const evHuman = event.toHuman()
          const evName = eventName(evHuman)
          // const evParams = eventParams(evHuman)
          const evNamePhase = `${evName}::(phase=${phase.toString()})`

          if (FILTERED_EVENTS.includes(evNamePhase)) return

          const content = eventToString(event);
          const isError = api.events.system.ExtrinsicFailed.is(event);

          processEvent(event);

          setEventFeed(e => [
            {
              key: keyNum + Math.random().toString(),
              icon: sectionToIconName(evHuman.section, evHuman.method),
              summary: evName,
              content,
              isError,
              section: evHuman.section,
            },
            ...e,
          ])

          keyNum += 1
        })
      })
    }

    allEvents()
    return () => unsub && unsub()
  }, [api.query.system, api.events.system, api.registry])


  const fillOptions = () => {
    const sections = new Set()
    eventFeed.forEach(e => {
      sections.add(e.section);
    });
    setFilterOptions([...sections].map((s, i) => {
      return {
        key: s,
        text: s,
        value: s,
        icon: sectionToIconName(s),
      }
    }))
  }
  useEffect(fillOptions, [eventFeed])

  const { feedMaxHeight = 200 } = props

  return (
    <Grid.Column width={16}>
      <div style={{display: 'flex', alignItems: 'center'}}>
      <h1 style={{ float: 'left' }}>Events</h1>
        <Dropdown
          // placeholder='Pallet'
          // fluid
          multiple
          // selection
          icon={'filter'}
          style={{ marginBottom: '1rem', marginLeft: 'auto', marginRight: '1rem', paddingRight: 0 }}
          options={filterOptions}
          onChange={(e, data) => setCurrentFilter(data.value)}
        ></Dropdown>
      <Button
        basic
        circular
        size="mini"
        color="grey"
        floated="right"
        icon="erase"
        style={{ marginBottom: '1rem' }}
        onClick={_ => setEventFeed([])}
      />
      </div>
      <Feed
        style={{ clear: 'both', overflow: 'auto', maxHeight: feedMaxHeight }}
      // events={eventFeed}
      >
        {eventFeed.filter(e => currentFilter.length === 0 || currentFilter.includes(e.section)).map((e, i) =>
        (
          <Feed.Event key={`fe-${i}`}>
            <Feed.Label>
              <Icon name={e.icon} color={e.isError ? 'red' : 'black'} />
            </Feed.Label>
            <Feed.Content>
              {/* <Feed.Date>Today</Feed.Date> */}
              <Feed.Summary>
                {e.summary}
              </Feed.Summary>
              <Feed.Extra>
                {e.content}
              </Feed.Extra>
            </Feed.Content>
          </Feed.Event>
        )
        )}
      </Feed>
    </Grid.Column>
  )
}

export default function Events(props) {
  const { api } = useSubstrateState()
  return api.query && api.query.system && api.query.system.events ? (
    <Main {...props} />
  ) : null
}
