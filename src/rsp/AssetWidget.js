import energyImg from './assets/widget-energy.png'
import diamondImg from './assets/widget-diamond.png'

function AssetWidget({
  type = 'diamonda',
  value,
}) {

  const wImage = (type) => {
    return type === 'diamond' ? diamondImg : energyImg
  }

  return (
    <div className='asset-widget-wrapper'>
      <div className='asset-widget-shadow asset-widget'>
      </div>
      <div className='asset-widget'>
        <div className='asset-widget-image-container' >
          <img className='asset-widget-image' src={wImage(type)} alt='' />
        </div>
        <div className='asset-widget-text-container'>
          <svg viewBox="0 0 35 20">
            <text x="17" y="15" text-anchor="middle">{value}</text>
          </svg>
        </div>
      </div>
    </div>
  )
}

export {
  AssetWidget
}
