import { AssetWidget } from './AssetWidget'

function AssetsWidgets({
  value = {
    energy: 10,
    diamonds: 55,
  }
}) {
  
  return (
    <div className='assets-widgets-wrapper'>
      <AssetWidget type='energy' value={value.energy} />
      <AssetWidget type='diamond' value={value.diamonds} />
    </div>
  )
}

export {
  AssetsWidgets
}
