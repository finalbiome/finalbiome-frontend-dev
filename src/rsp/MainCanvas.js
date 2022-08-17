import backgroundImg from './assets/background.jpg'
import { RspButton } from './RspButton'

function MainCanvas(params) {
  
  return (
    <div style={{
      width: '100%',
      position: 'relative',
      paddingTop: '56.25%',
      backgroundImage: `url(${backgroundImg})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
    }}>
        <div
          style={{
            width: '100%',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <RspButton onClick={(e) => console.log(e)}/>
        </div>
    </div>
  )
}

export {
  MainCanvas
}
