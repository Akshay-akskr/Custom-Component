import { useState } from 'react'
import Welcome from './main/Welcome'
import CharacterSelect from './main/CharacterSelect'
import Tutorial from './main/Tutorial'
import StoryScene from './main/StoryScene'
import SummaryScreen from './main/SummaryScreen'

type Answered = {
  questionId: number;
  questionText: string;
  selectedOptions: string[];
};

const App = () => {
  const [step, setStep] = useState<'welcome' | 'select' | 'tutorial' | 'story' | 'summary'>('welcome')
  const [characterId, setCharacterId] = useState('')
  const [moveId, setMoveId] = useState('')
  const [answers, setAnswers] = useState<Answered[]>([])

   const doSelect = () => {
    setStep('select')
    console.info("moveid >>", moveId);
  }

  const startTutorial = (charId: string, moveId: string) => {
    setCharacterId(charId)
    setMoveId(moveId)
    setStep('tutorial')
  }

  const startStory = () => {
    setStep('story')
  }

  const completeStory = (ans: Answered[]) => {
    setAnswers(ans)
    setStep('summary')
  }

  const restart = () => {
    setStep('select')
    setCharacterId('')
    setMoveId('')
    setAnswers([])
  }

  const submit = () => {
    /*fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        characterId,
        answers: updatedAnswers.map((q) => q.selected),
      }),
    })*/

    restart();
  }

  return (
    <>
      {step === 'welcome' && <Welcome onSelect={doSelect} />}
      {step === 'select' && <CharacterSelect onSelect={startTutorial} />}
      {step === 'tutorial' && (
        <Tutorial 
          characterId={characterId}
          moveId={moveId}
          onStart={startStory} />
      )}
      {step === 'story' && (
        <StoryScene
          characterId={characterId}
          moveId={moveId}
          onComplete={completeStory}
        />
      )}
      {step === 'summary' && (
        <SummaryScreen
          answers={answers}
          onRestart={restart}
          onSubmit={submit}
        />
      )}
    </>
  )
}

export default App
