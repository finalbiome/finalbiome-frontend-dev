/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useSubstrateState } from '../substrate-lib'
import backgroundImg from './assets/background.jpg'
import { ChooseButton } from './ChooseButton'
import { ChooseSection } from './ChooseSection'
import { FinalScreen } from './FinalScreen'
import { Footer } from './Footer'
import { GameScreen } from './GameScreen'
import { RspButton } from './RspButton'
import { SplashScreen } from './SplashScreen'
import { StartScreen } from './StartScreen'

const GAME_ACCOUNT = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
const NUMBER_OF_ROUNDS = 5;
const FA_ID_ENERGY = 2;
const FA_ID_DIAMOND = 3;
const NFA_BET = 2;

function MainCanvas(params) {


  const [gameStatus, setGameStatus] = useState('new') // new, ready, playing, finished
  // consists of rounds results
  const [roundsResults, setRoundsResults] = useState([...Array(NUMBER_OF_ROUNDS).map(() => undefined)])
  // number of energy
  const [energy, setEnergy] = useState(0)
  // number of diamond
  const [diamonds, setDiamonda] = useState(0)
  // price of the game in the energy
  const [gamePrice, setGamePrice] = useState(10)
  // game score (array of [FA name, amount] )
  const [gameScore, setGameScore] = useState([['energy', 350],['diamond', -50],])

  const handleBackClick = () => setGameStatus('ready')

  const balances = () => {
    return {
      energy,
      diamonds,
    }
  }

  const resetGameState = () => {
    if (gameStatus === 'ready') {
      setRoundsResults([...Array(NUMBER_OF_ROUNDS).map(() => undefined)])
    }
  }
  useEffect(resetGameState, [gameStatus])

  /* FiinalBiome Logic */
  const { api, currentAccount } = useSubstrateState()
  const [accountNonce, setAccountNonce] = useState(0)

  const getAccountNonce = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.system.account(currentAccount.address, entity => {
        const nonce = entity.nonce.isEmpty ? 0 : entity.nonce.toNumber()
        setAccountNonce(nonce);
      })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(getAccountNonce, [api, currentAccount])


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
          <StartScreen
            setGameStatus={setGameStatus}
            balances={balances()}
            price={gamePrice}
          />
        ) : null}
        {gameStatus === 'playing' || gameStatus === 'finished' ? (
          <>
            <GameScreen
              setGameStatus={setGameStatus}
              results={roundsResults}
              balances={balances()}
            />
            {gameStatus === 'finished' ? (
              <FinalScreen
                backClick={handleBackClick}
                results={roundsResults}
                score={gameScore}
              />
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
