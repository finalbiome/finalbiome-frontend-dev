import {
  Dropdown
} from 'semantic-ui-react'

/**
 * Returns a list of all available mechanics
 */
const MECHANICS_LIST = [
  'Purchased',
  'Bettor',
]

function MechanicsDropdown({
  selectedMechanic,
  setSelectedMechanic
}) {
  const mechanicsOptions = MECHANICS_LIST.map(m => {
    return {
      key: m,
      value: m,
      text: m,
      icon: 'settings',
    }
  })
  return (
    <Dropdown
      placeholder={"Select mechanic"}
      fluid
      selection
      // search
      // clearable
      options={mechanicsOptions}
      value={selectedMechanic}
      onChange={(e, { value }) => setSelectedMechanic(value)}
    />
  )
}

export {
  MechanicsDropdown
}
