/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { AssetsWidgets } from './AssetsWidgets'
import { ChooseSection } from './ChooseSection'
import { Footer } from './Footer'
import { RoundSection } from './RoundSection'


function GameScreen({
  gameStatus,
  setGameStatus,
  results, // ['win', 'lose', 'draw', undefined, indefinded]
  result, // result from fb (win, lose, draw)
  balances, // {energy: 10, diamonds: 55}
  turn, // () => {} when gamer select an arm
  isFinal, // show that it's the last round
}) {

  const [selectedArm, setSelectedArm] = useState('') // rock, scissor, paper
  const [retrievingResult, setRetrievingResult] = useState(false)
  const [delayedResults, setDelayedResults] = useState([...Array(results.length)]) // delayed result of `results`
  const [fbArm, setFbArm] = useState('') // arm as result from fb
  const [final, setFinal] = useState(false) // represent last round. If true, show final sreen

  const [timer, setTimer] = useState('')

  const resultsRef = useRef(results);
  resultsRef.current = results;
  const delResultsRef = useRef(delayedResults);
  delResultsRef.current = delayedResults;
  const isFinalRef = useRef(isFinal);
  isFinalRef.current = isFinal;



  const nextRound = () => resultsRef.current.filter(r => !!r).length > delResultsRef.current.filter(r => !!r).length

  const handleSelectArm = (arm) => {
    setSelectedArm(arm)
    // propogate the turn to up
    if (turn && typeof turn === 'function') {
      turn()
    }
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


  // set wait time before show results
  const waitTimer = () => {
    if (!retrievingResult) {
      if (timer) {
        clearTimeout(timer);
        setTimer('')
      }
      return
    };
    if (timer) return;
    const timerId = window.setTimeout(() => {
      const results = resultsRef.current;
      if (nextRound()) {
        setDelayedResults([...results]);
        setRetrievingResult(false);
        if (isFinalRef.current) setFinal(true)
      } else waitTimer();
    }, 3000)
    setTimer(timerId)
    return () => {
      clearTimeout(timerId);
      setTimer('')

    }
  }
  useEffect(waitTimer, [retrievingResult])

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
        <Footer backClick={handleBackClick} results={delayedResults} />
      </div>
    </div>
  )
}

export {
  GameScreen
}
