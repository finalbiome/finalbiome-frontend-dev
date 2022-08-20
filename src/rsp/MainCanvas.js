/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import backgroundImg from './assets/background.jpg'
import { ChooseButton } from './ChooseButton'
import { ChooseSection } from './ChooseSection'
import { FinalScreen } from './FinalScreen'
import { Footer } from './Footer'
import { GameScreen } from './GameScreen'
import { RspButton } from './RspButton'
import { SplashScreen } from './SplashScreen'
import { StartScreen } from './StartScreen'

const NUMBER_OF_ROUNDS = 5;

function MainCanvas(params) {


  const [gameStatus, setGameStatus] = useState('new') // new, ready, playing, finished
  // consists of rounds results
  const [roundsResults, setRoundsResults] = useState([...Array(NUMBER_OF_ROUNDS).map(() => undefined)])

  const handleBackClick = () => setGameStatus('ready')

  const resetGameState = () => {
    if (gameStatus === 'new') {
      setRoundsResults([...Array(NUMBER_OF_ROUNDS).map(() => undefined)])
    }
  }
  useEffect(resetGameState, [gameStatus])


  return (
    <div style={{
      width: '100%',
      position: 'relative',
      paddingTop: '56.25%',
      backgroundImage: `url(${backgroundImg})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      overflow: 'hidden',
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
        {gameStatus === 'new' ? (
          <SplashScreen setGameStatus={setGameStatus} />
        ) : null}
        {gameStatus === 'ready' ? (
          <StartScreen setGameStatus={setGameStatus} />
        ) : null}
        {gameStatus === 'playing' || gameStatus === 'finished' ? (
          <>
            <GameScreen setGameStatus={setGameStatus} />
            {gameStatus === 'finished' ? (
              <FinalScreen backClick={handleBackClick} />
            ) : null}
          </>
        ) : null}

        </div>
    </div>
  )
}

export {
  MainCanvas
}
