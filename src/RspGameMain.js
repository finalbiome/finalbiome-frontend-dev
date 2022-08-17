import { MainCanvas } from './rsp/MainCanvas'
import { useSubstrateState } from './substrate-lib'


function Main(props) {
  
  return (
    <div style={{position: 'relative', width: '100%'}}>
      <MainCanvas />
    </div>
  )
}

export default function RspGameMain(props) {
  const { api, keyring } = useSubstrateState()
  return api && keyring.getPairs && api.query ? (
    <Main {...props} />
  ) : null
}
