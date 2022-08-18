import { AssetWidget } from './AssetWidget'

function AssetsWidgets(props) {
  
  return (
    <div className='assets-widgets-wrapper'>
      <AssetWidget type='energy' value={10} />
      <AssetWidget type='diamond' value={55} />
    </div>
  )
}

export {
  AssetsWidgets
}
