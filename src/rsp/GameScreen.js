/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { AssetsWidgets } from './AssetsWidgets'
import { ChooseSection } from './ChooseSection'
import { Footer } from './Footer'
import { RoundSection } from './RoundSection'


function GameScreen({
  setGameStatus,
  results, // ['win', 'lose', 'draw', undefined, indefinded]
  balances, // {energy: 10, diamonds: 55}
}) {

  const [selectedArm, setSelectedArm] = useState('') // new, ready, playing, finished
  const [retrievingResult, setRetrievingResult] = useState(false)
  const [result, setResult] = useState('win') // result from fb (win, lose, draw)
  const [fbArm, setFbArm] = useState('') // arm as result from fb
  const [final, setFinal] = useState(false) // represent last round. If true, show final sreen

  const [round, setRound] = useState(1) // temp


  const handleSelectArm = (arm) => {
    console.log(arm)
    setSelectedArm(arm)
    setRetrievingResult(true)
    waitTimer()
  }

  const handleNextRound = () => {
    setSelectedArm('')
    // setResult('') // clean wher results will be come form fb
  }

  const handleBackClick = () => setGameStatus('new')

  const resultToArm = () => {
    if (!selectedArm || !result) return;
    // Translate result to dropped arm
    const winingSequence = ['rock', 'scissor', 'paper']
    const getWinFrom = (arm) => {
      let i = winingSequence.findIndex(v => v === arm);
      if (i - 1 < 0) i = winingSequence.length;
      return winingSequence[i - 1]
    }
    const getLoseFrom = (arm) => {
      let i = winingSequence.findIndex(v => v === arm);
      if (i + 1 > winingSequence.length - 1) i = -1;
      return winingSequence[i + 1]
    }
    const getDrawFrom = (arm) => {
      return arm
    }
    switch (result) {
      case 'win':
        setFbArm(getLoseFrom(selectedArm))
        break;
      case 'lose':
        setFbArm(getWinFrom(selectedArm))
        break;
      case 'draw':
        setFbArm(getDrawFrom(selectedArm))
        break;
      default:
        setFbArm('');
    }
  }
  useEffect(resultToArm, [result, selectedArm])

  const finalize = () => {
    if (final) setGameStatus('finished');
  }
  useEffect(finalize, [final, setGameStatus])


  // set wait time before show result screen
  const waitTimer = () => {
    window.setTimeout(() => {
      if (result) {
        setRetrievingResult(false);
        setRound(round + 1)
        if (round === 2) setFinal(true)
      } else waitTimer();
    }, 3000)
  }

  return (
    <div className='game-screen-wrapper screen-wrapper'>
      <div className='game-screen-header'>
        <AssetsWidgets value={balances} />
      </div>
      <div className='game-screen-main'>
        {selectedArm ? (
          <RoundSection wait={retrievingResult} handPlayer={selectedArm} handFb={fbArm} result={result} onClick={handleNextRound} />
        ) : (
          <ChooseSection onClick={handleSelectArm} />
        )}
      </div>
      <div className='game-screen-footer'>
        <Footer backClick={handleBackClick} results={results} />
      </div>
    </div>
  )
}

export {
  GameScreen
}
