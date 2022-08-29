/* eslint-disable no-unused-vars */
import { web3FromSource } from '@polkadot/extension-dapp'
import { useEffect, useState } from 'react'
import { useSubstrateState } from '../substrate-lib'
import backgroundImg from './assets/background.jpg'
import { FinalScreen } from './FinalScreen'
import { GameScreen } from './GameScreen'
import { SplashScreen } from './SplashScreen'
import { StartScreen } from './StartScreen'

const GAME_ACCOUNT = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'
const FA_ID_ENERGY = 2;
const FA_ID_DIAMOND = 3;
const NFA_BET = 2;
const OFFER_ID = 0;

function MainCanvas(params) {
  const [gameStatus, setGameStatus] = useState('new') // new, ready, playing, finished
  const [numberOfRounds, setNumberOfRounds] = useState(0)
  // consists of rounds results
  const [roundsResults, setRoundsResults] = useState([...Array(numberOfRounds)])
  const [roundResult, setRoundResult] = useState('')
  const [gameResult, setGameResult] = useState('')
  // gamer already onboarded?
  const [onboarded, setOnboarded] = useState(false)
  // number of energy
  const [energy, setEnergy] = useState(0)
  // number of diamond
  const [diamonds, setDiamonds] = useState(0)
  // price of the game in the energy
  const [gamePrice, setGamePrice] = useState(10)
  // game score (array of [FA name, amount] )
  const [gameScore, setGameScore] = useState([['energy', 0], ['diamond', 0],])
  // represent final round - need for show game
  const [finalRound, setFinalRound] = useState(false)

  const handleBackClick = () => {
    setGameStatus('ready');
  }

  const balances = () => {
    return {
      energy,
      diamonds,
    }
  }

  const cleanGameState = () => {
    // clean old results
    setRoundsResults([...Array(numberOfRounds)])
    setRoundResult('')
    setGameResult('')
    setBetAssetId('')
    setMechanicId('')
    setMechanic('')
    setFinalRound(false)
  }

  const onGameStateChange = () => {
    if (gameStatus === 'ready') {
      cleanGameState()
      // try to onboart into the game
      if (!onboarded) {
        makeTransaction(onboardToGame);
        setOnboarded(true)
      }
      // reset previuos game status
      setRoundsResults([...Array(numberOfRounds)])
    } if (gameStatus === 'playing') {
      // purchase an bet asset
      if (!betAssetId) {
        makeTransaction(purchaseAsset);
      }
    }
  }
  useEffect(onGameStateChange, [gameStatus])

  /* FiinalBiome Logic */
  const { api, currentAccount } = useSubstrateState()
  const [accountNonce, setAccountNonce] = useState(0)
  const [unsub, setUnsub] = useState(null)
  const [betAssetId, setBetAssetId] = useState('')
  const [mechanicId, setMechanicId] = useState('')
  const [mechanic, setMechanic] = useState('')
  // details of Bet Nfa
  const [betNfaDetails, setBetNfaDetails] = useState('')

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

  const getBalances = () => {
    const faIds = [FA_ID_ENERGY, FA_ID_DIAMOND];
    const faIdsToKeys = () => {
      return faIds.map(k => [currentAccount.address, k])
    }
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.fungibleAssets.accounts.multi(faIdsToKeys(),
        entries => {
          const balances = entries
            .forEach((entry, idx) => {
              const balance = entry.isSome ? entry.unwrap().balance.toJSON() : 0;
              if (idx === 0) {
                setEnergy(balance)
              } else if (idx === 1) {
                setDiamonds(balance)
              } else console.error(`Unrecognized FA ${(entry, idx)}`)
            });
        })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(getBalances, [api, currentAccount.address])

  const getBetNfaDetails = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.nonFungibleAssets.classes(NFA_BET, entity => {
        if (entity.isNone) {
          console.error(`NFA with id ${NFA_BET} is not found. Configure game assets.`)
          return
        }
        let details = entity.unwrap().toJSON();
        setBetNfaDetails(details)
        setGamePrice(details.purchased.offers[OFFER_ID].price)
        setNumberOfRounds(details.bettor.rounds)
      })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(getBetNfaDetails, [api, currentAccount.address])

  const makeTransaction = async (asyncFunc) => {
    // if we was subscribed, unsubscribe before send new request
    if (typeof unsub === 'function') {
      unsub()
      setUnsub(null)
    }
    console.debug('Sending...')
    await asyncFunc()
  }

  const onboardToGame = async () => {
    let unsub = null
    const asyncFunc = async () => {
      const fromAcct = await getFromAcct(currentAccount)
      let txExecute
      try {
        txExecute = api.tx['organizationIdentity']['onboarding'](GAME_ACCOUNT);
      } catch (error) {
        console.error(error)
        return
      }
      unsub = await txExecute
        .signAndSend(...fromAcct, txResHandler)
        .catch(txErrHandler)
    }
    await asyncFunc()
    // return () => { unsub && unsub() }
    setUnsub(() => unsub)
  }

  const purchaseAsset = async () => {
    let unsub = null
    const asyncFunc = async () => {
      const fromAcct = await getFromAcct(currentAccount)
      let txExecute
      try {
        txExecute = api.tx['mechanics']['execBuyNfa'](NFA_BET, OFFER_ID);
      } catch (error) {
        console.error(error)
        return
      }
      unsub = await txExecute
        .signAndSend(...fromAcct, txResHandler)
        .catch(txErrHandler)
    }
    await asyncFunc()
    setUnsub(() => unsub)
  }

  const runBetMechanic = async () => {
    let unsub = null
    const asyncFunc = async () => {
      const fromAcct = await getFromAcct(currentAccount)
      let txExecute
      try {
        txExecute = api.tx['mechanics']['execBet'](NFA_BET, betAssetId);
      } catch (error) {
        console.error(error)
        return
      }
      unsub = await txExecute
        .signAndSend(...fromAcct, txResHandler)
        .catch(txErrHandler)
    }
    await asyncFunc()
    setUnsub(() => unsub)
  }

  const upgradeBetMechanic = async () => {
    let unsub = null
    const asyncFunc = async () => {
      const fromAcct = await getFromAcct(currentAccount)
      let txExecute
      try {
        const upgradeData = {
          mechanic_id: {
            account_id: mechanicId[0],
            nonce: mechanicId[1],
          },
          payload: 'Bet',
        }
        txExecute = api.tx['mechanics']['upgrade'](upgradeData);
      } catch (error) {
        console.error(error)
        return
      }
      unsub = await txExecute
        .signAndSend(...fromAcct, txResHandler)
        .catch(txErrHandler)
    }
    await asyncFunc()
    setUnsub(() => unsub)
  }

  const listenEvents = () => {
    let unsub = null
    const asyncFetch = async () => {
      unsub = await api.query.system.events(events => {
        events.forEach(record => {
          // extract the phase, event and the event types
          const { event, phase } = record
          // if error, ignore
          if (api.events.system.ExtrinsicFailed.is(event)) return;
          // console.log(event.toHuman())

          const data = event.data.toJSON();

          switch (event.section) {
            case 'nonFungibleAssets':
              switch (event.method) {
                case 'Issued': {
                  const [classId, assetId, account] = data;
                  // ignore all unnessesary event
                  if (account !== currentAccount.address || classId !== NFA_BET) return;
                  // if we here, thats mean that we bougth an bet asset
                  setBetAssetId(assetId);
                  break;
                }
                default:
                  break;
              }

              break;

            case 'mechanics': {
              if (data[0] !== currentAccount.address) return;
              switch (event.method) {
                case 'Finished': {
                  // this mean that mechanic is done and destroyed.
                  // fill intermadiate `results` and set `GameResult`
                  const [account, nonce, result] = data;
                  if (!(account === mechanicId[0], nonce === mechanicId[1])) return;

                  const rounds = betNfaDetails.bettor.rounds;
                  const betOutcomes = betNfaDetails.bettor.outcomes;
                  const newResults = [...Array(rounds)]
                  const mechanicOutcomes = result.bet.outcomes;
                  for (let idx = 0; idx < mechanicOutcomes.length; idx++) {
                    const outcomeIdx = mechanicOutcomes[idx];
                    newResults[idx] = betOutcomes[outcomeIdx].result.toLowerCase()
                  }
                  setRoundsResults(newResults)
                  console.log('fb:', newResults)
                  setRoundResult(newResults[rounds - 1])

                  // set final result
                  let res = result.bet.result;
                  const newGameResult = res === 'Won' ? 'win' : (res === 'Lost' ? 'lose' : 'draw')
                  setGameResult(newGameResult)
                  setFinalRound(true)
                  setMechanicId('')
                  setMechanic('')
                  if (newGameResult !== 'draw') {
                    setBetAssetId('')
                  }
                  // set game score
                  if (newGameResult === 'win') {
                    setGameScore([
                      ['energy', betNfaDetails.bettor.winnings.find(w => w.fa[0] === FA_ID_ENERGY).fa[1]],
                      ['diamond', betNfaDetails.bettor.winnings.find(w => w.fa[0] === FA_ID_DIAMOND).fa[1]],
                    ]) // [['energy', 0], ['diamond', 0],]
                  } else if (newGameResult === 'lose') {
                    setGameScore([
                      ['energy', -betNfaDetails.purchased.offers[OFFER_ID].price],
                    ])
                  } else { // draw
                    setGameScore([
                      ['energy', 0],
                      ['diamond', 0],
                    ])
                  }
                  break;
                }
                default:
                  break;
              }
              break;
            }
            default:
              break;
          }
        })
      })
    }
    asyncFetch()
    return () => unsub && unsub()
  }
  useEffect(listenEvents, [api, currentAccount.address, mechanicId, betNfaDetails])

  const fetchBetAsset = () => {
    // subscribe on existanse of the bet asset
    let unsub = null
    const asyncFetch = async () => {
      if (betAssetId) return;
      unsub = await api.query.nonFungibleAssets.accounts.keys(currentAccount.address, keys => {
        const ids = keys.map(key => key.args.map(k => k.toJSON()));
        // get the first asset
        if (ids.length > 0) setBetAssetId(ids[0][2])
      })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(fetchBetAsset, [api, currentAccount.address, betAssetId])

  const getMechanic = () => {
    let unsub = null
    const asyncFetch = async () => {
      if (!mechanicId) return;
      unsub = await api.query.mechanics.mechanics(mechanicId[0], mechanicId[1], details => {
        if (details.isSome) {
          /// fill results
          setMechanic(details.unwrap().toJSON())
        }
      })
    }
    asyncFetch()
    return () => { unsub && unsub() }
  }
  useEffect(getMechanic, [api, mechanicId])

  // Calls when a gamer make the turn
  const makedTurn = () => {
    // if gamer makes first turn,
    // we should create a machanic,
    // save mechanic id and subscribe to it.
    if (!mechanicId) {
      const newMechanicId = [currentAccount.address, accountNonce + 1];
      makeTransaction(runBetMechanic);
      setMechanicId(newMechanicId);
    } else {
      // else upgrade an existing mechanic
      makeTransaction(upgradeBetMechanic);
    }
  }

  // set `results` by details in mechanic
  const setResultsFromMechanicDetails = () => {
    if (!(betNfaDetails && mechanic)) return;
    const betOutcomes = betNfaDetails.bettor.outcomes;
    const rounds = betNfaDetails.bettor.rounds;
    const mechanicOutcomes = mechanic.data.bet.outcomes;
    // if length if mechanicOutcomes the same as length of roundsResults
    // this mean that mechanic is done and destroyed.
    // we need to calculate the last turn by self.
    // ... ... TODO
    const newResults = [...Array(rounds)]
    for (let idx = 0; idx < mechanicOutcomes.length; idx++) {
      const outcomeIdx = mechanicOutcomes[idx];
      newResults[idx] = betOutcomes[outcomeIdx].result.toLowerCase()
    }
    setRoundsResults(newResults)
    setRoundResult(newResults[mechanicOutcomes.length - 1])
    console.log('fb:', newResults)
  }
  useEffect(setResultsFromMechanicDetails, [api, betNfaDetails, mechanic])

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
              gameStatus={gameStatus}
              setGameStatus={setGameStatus}
              results={[...roundsResults]}
              result={roundResult}
              balances={balances()}
              turn={makedTurn}
              isFinal={finalRound}
            />
            {gameStatus === 'finished' ? (
              <FinalScreen
                backClick={handleBackClick}
                results={[...roundsResults]}
                gameResult={gameResult}
                score={gameScore}
                balances={balances()}
              />
            ) : null}
          </>
        ) : null}

        </div>
    </div>
  )
}

const getFromAcct = async (currentAccount) => {
  const {
    address,
    meta: { source, isInjected },
  } = currentAccount

  if (!isInjected) {
    return [currentAccount]
  }

  // currentAccount is injected from polkadot-JS extension, need to return the addr and signer object.
  // ref: https://polkadot.js.org/docs/extension/cookbook#sign-and-send-a-transaction
  const injector = await web3FromSource(source)
  return [address, { signer: injector.signer }]
}

const txResHandler = ({ status }) =>
  status.isFinalized
    ? console.debug(`Finalized. Block hash: ${status.asFinalized.toString()}`)
    : console.debug(`Current transaction status: ${status.type}`)

const txErrHandler = err => console.error(`Transaction Failed: ${err.toString()}`)

export {
  MainCanvas,
}
