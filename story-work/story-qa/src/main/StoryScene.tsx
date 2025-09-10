import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import '../styles/shape.css';
import RampContainer from '../components/RampContainer';

type Question = {
  id: string
  instruction: string
  question: string
  background: string
  options: string[],
  style: string;
}

type Answered = {
  questionId: number;
  questionText: string;
  selectedOptions: string[];
};

type Props = {
  characterId: string
  moveId: string
  onComplete: (answers: { questionId: number; questionText: string; selectedOptions: string[] }[]) => void;
}

const StoryScene: React.FC<Props> = ({ characterId, moveId, onComplete }) => {
  const [isVideo, showVideo] = useState<boolean>(true)
  const [questionsData, setQuestionsData] = useState<Question[]>([])
  const [backgroundId, setBackGround] = useState<string>('')
  const [qustionText, setQuestionText] = useState<string>('')
  const [showOptions, setShowOptions] = useState<boolean>(false)
  const [showCharacter, setShowCharacter] = useState<boolean>(false)
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [answered, setAnswered] = useState<Answered[]>([]);
  
  /*const [position, setPosition] = useState({ top: '50%', right: '20%' })
  useEffect(() => {
    const moveInterval = setInterval(() => {
      const top = Math.floor(Math.random() * 60) + 30
      const left = Math.floor(Math.random() * 60) + 10
      setPosition({ top: `${top}%`, left: `${left}%` })
    }, 3000)
    return () => clearInterval(moveInterval)
  }, [])*/
  const position = { bottom: '45%', right: '0px' }

  // 🔊 Narrate each question
  const speakText = (text: string) => {
    const msg = new SpeechSynthesisUtterance(text)
    msg.lang = 'en-GB'
    msg.rate = 1
    msg.pitch = 1.2
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(msg)
  } 
  
  const setQuestionView = (quesObj:Question) => {
    setShowOptions(false)
    setShowCharacter(false)
    setBackGround(quesObj.background)
    setQuestionText(quesObj.instruction)
    speakText(quesObj.instruction)

    setTimeout(() => {
      setQuestionText(quesObj.question)
      speakText(quesObj.question)
      setShowOptions(true)
    }, 2000);
    setTimeout(() => {
      setShowCharacter(true)
    }, 4000);
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      fetch(`${import.meta.env.BASE_URL}questions.json`)
      .then((res) => res.json())
      .then((data) => {
        setQuestionsData(data)
        setQuestionView(data[0])
      })
      .catch(console.error)
    };

    const timer = setTimeout(() => {
      showVideo(false)
      fetchQuestions()
    }, 5000);
    return () => clearTimeout(timer);

  }, [])

  if(isVideo) {
    return(
      <div style={styles.videocontainer}>
        <video autoPlay loop muted playsInline
          src={`./backgrounds/background.mp4`}
          style={styles.video}
        />
      </div>
    )
  }

  if (!questionsData.length) return <div>Loading...</div>

  const question = questionsData[currentQIndex]

  const handleSelect = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((opt) => opt !== option) : [...prev, option]
    );
  };

  const getOptionStyle = (bgColor: string, textColor: string) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '125px',
    background: bgColor,
    color: textColor,
    fontWeight: 400,
    textAlign: 'center' as const,
    '--pseudo-color': bgColor,         
    filter: 'drop-shadow(0px 0px 10px rgba(0,0,255,.5))',                
    cursor: `url('${import.meta.env.BASE_URL}images/cursor.png'), auto`,
  });

  const getSelectedStyle = {
    border: '4px solid #ff9800',
    fontWeight: 700,
    transform: 'scale(1.05)',
  };

  const handlePrevious = () => {
    if (currentQIndex > 0) {
      const prevIndex = currentQIndex - 1;
      setCurrentQIndex(prevIndex);
      setQuestionView(questionsData[prevIndex])
  
      // Restore previous selected options
      const prevAnswer = answered.find(a => Number(a.questionId) === Number(questionsData[prevIndex].id));
      setSelectedOptions(prevAnswer ? prevAnswer.selectedOptions : []);
      
      // Optional: remove the last answer if you want to re-submit it later
      setAnswered(prev => prev.filter(a =>  Number(a.questionId) !==  Number(questionsData[currentQIndex].id)));
    }
  }

  const handleNext = () => {
    const currentQuestion = questionsData[currentQIndex];
    if (!currentQuestion) return;

    const newAnswer = {
      questionId: Number(question.id),
      questionText: question.question,
      selectedOptions: selectedOptions,
    };
    setAnswered((prev) => [...prev, newAnswer]);
    setSelectedOptions([]);
    
    if (currentQIndex + 1 < questionsData.length) {
      setCurrentQIndex((prev) => prev + 1);
      setQuestionView(questionsData[currentQIndex + 1])
    } else {
      onComplete([...answered, newAnswer]);
    }
  }

  const handleReplay = () => {
    const currentQuestion = questionsData[currentQIndex];
    if (!currentQuestion) return;

    setSelectedOptions([]);
    setQuestionView(currentQuestion)
  }

  return (
    <div style={{display:'flex', width:'100vw'}}>
      <div style={styles.scene}>
        <div style={styles.questionWrapper}>
          <motion.div style={styles.questionbubble} initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <p style={styles.question}>{qustionText}</p>
          </motion.div>
          {(showOptions && question.style === "ramp") &&
            <>
              <div style={styles.standdiv}></div>
              <RampContainer widValue='calc(88% - 40px)' items={question.options} onSelect={(opt) => handleSelect(opt)} />
            </>
          }
          {(showOptions && question.style !== "ramp") &&
            <div style={styles.options} >
              {question.options.map((opt, idx) => {
                const isSelected = selectedOptions.includes(opt);
                const bgColor = getRandomDarkColor();
                const textColor = getContrastingTextColor(bgColor);

                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className={question.style}
                    style={{
                      ...getOptionStyle(bgColor, textColor),
                      ...(isSelected ? getSelectedStyle : {}),
                    }}
                    onClick={() => handleSelect(opt)}
                  >              
                    {opt}
                  </motion.div>
                );
              })}
            </div>
          }
        </div>
        {!showCharacter && 
          <img src={`${import.meta.env.BASE_URL}backgrounds/${backgroundId}`} 
              alt="Background"
              style={styles.background}
          />
        }
        {showCharacter && 
          <button style={styles.replay} onClick={handleReplay} />
        }
        {(showCharacter && selectedOptions.length === 0) && 
          <motion.img
            src={`${import.meta.env.BASE_URL}characters/${characterId}`}
            alt={characterId}
            style={{
              ...styles.character,
              width: 145, height: 175,
              position: 'absolute',
              bottom: position.bottom,
              right: position.right,
              filter: 'drop-shadow(0px 0px 10px rgba(255,0,0,.5))',
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 5 }}
          />
        }
        {selectedOptions.length > 0 && 
          <img              
            src={`${import.meta.env.BASE_URL}characters/${characterId}.png`}
            alt={moveId}
            className={moveId}
            style={{
              position: 'absolute', bottom: '45%', right: '45%',
              width: 145, height: 175,
            }}
          />
        }
      
      </div>
      <div style={styles.navigation}>
        <button onClick={handlePrevious} style={{
          ...styles.prevButton,
          visibility: (currentQIndex > 0 ? 'visible' : 'hidden'),
        }}>
        </button>
        {(currentQIndex !== questionsData.length - 1) && 
          <button style={styles.nextButton} onClick={handleNext}>
          </button>
        }
        {(currentQIndex === questionsData.length - 1) && 
          <button style={styles.finishButton} onClick={handleNext}>
          </button>
        }
      </div>
      
    </div>
  )
}

function getRandomDarkColor(): string {
  const hue = Math.floor(Math.random() * 360); // 0–360: all hues
  const saturation = Math.floor(Math.random() * 30) + 70; // 70–100%
  const lightness = Math.floor(Math.random() * 20) + 30;  // 10–30%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
function getContrastingTextColor(bgColor: string): string {
  // Extract lightness from hsl and decide text color
  const match = bgColor.match(/hsl\(\d+,\s*\d+%,\s*(\d+)%\)/);
  const lightness = match ? parseInt(match[1]) : 50;
  return lightness > 70 ? "#000" : "#FFF";
}


const styles: { [key: string]: React.CSSProperties } = {
  videocontainer: {
    width: '560px',
    height: '50vh',
    position: 'absolute',
    top: '25%',
    right: '25%',
    zIndex: 0,
    background: 'lightblue'
  },
  video: {
    width: '480px',
    height: 'auto',
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    objectFit: 'cover',
    zIndex: -1,
  },
  scene: {
    width: 'calc(100% - 80px)',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
    margin: '0px 40px',
    background: 'linear-gradient(120deg, rgb(132, 250, 176) 0%, rgb(143, 211, 244) 100%) rgb(255, 255, 255)'  
  },
  background: {
    width: '40vw',
    height: '40vh',
    position: 'absolute',
    top: '50px',
    right: '50px',
    zIndex: 0,
  },
  bubble: {
    position: 'absolute',
    top: '10%',
    left: '20%',
    background: 'white',
    padding: '20px',
    borderRadius: '20px',
    zIndex: 3,
    maxWidth: '50vw',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
  },
  questionWrapper: {
    display:'grid', 
    gridTemplateRows:'1fr', 
    placeItems:'left', 
    height: '100vh'
  },
  question: {
    width: '60%',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  questionbubble: {
    position: 'relative',
    top: '10%',
    left: '10%',
    backgroundColor: 'pink',
    padding: '20px',
    borderRadius: '20px',
    zIndex: 3,
    width: '310px', 
    height: '200px',    
    background: `url('${import.meta.env.BASE_URL}images/cloud.png') center center / cover no-repeat`,
    filter: 'drop-shadow(0px 0px 10px rgba(0,0,255,.7))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1.2rem'
  },  
  standdiv: {
    position: 'absolute',
    right: 0, bottom: 0,
    width: '10vw', 
    height: '45%', 
    backgroundColor: 'black'
  },
  options: {
    width: '75vw',
    margin: '10px 20px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'left',
    gap: '12px',
    position: 'relative'
  },
  optionShape: {
    padding: '15px 25px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#fff',
    borderRadius: '20px',
    cursor: 'pointer',
    userSelect: 'none',
    position: 'relative',
  },
  replay : {
    cursor: `url('${import.meta.env.BASE_URL}images/cursor.png'), auto`,   
    background: `url('${import.meta.env.BASE_URL}images/replay.png') no-repeat center center`,
    backgroundSize: 'cover',
    position: 'fixed',
    top: 10, right: 40,
    height : 48
  },
  character: {
    height: '50vh',
    zIndex: 2,
    transition: 'top 0.5s ease, left 0.5s ease',
  },
  balloon: {
    borderRadius: '50%',
  },
  drum: {
    borderRadius: '15px',
  },
  hiddenCheckbox: {
    display: 'none',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: '50%',
    width: '100%',
    zIndex: 9999
  },  
  prevButton: {
    width: '32px',
    height: '36px',
    backgroundColor: '#fff',
    border: 'none',                
    cursor: `url('${import.meta.env.BASE_URL}images/cursor.png'), auto`,
    clipPath: 'polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%)',              
  },
  nextButton: {
    width: '32px',
    height: '36px',
    backgroundColor: '#fff',
    border: 'none',               
    cursor: `url('${import.meta.env.BASE_URL}images/cursor.png'), auto`,
    clipPath: 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
  },
  finishButton: {
    width: '32px',
    height: '36px',
    backgroundColor: '#28BA99',
    border: '10px solid #fff',               
    borderRadius: '10px',
    boxSizing: 'border-box',
    cursor: `url('${import.meta.env.BASE_URL}images/cursor.png'), auto`,
    clipPath: 'inset(inset(5% 5% 5% 5%))'
  }
}

export default StoryScene
