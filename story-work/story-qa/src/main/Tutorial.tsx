import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/shape.css';
import RampContainer from '../components/RampContainer';

type Props = {
  characterId: string
  moveId: string
  onStart: () => void
}

const Tutorial: React.FC<Props> = ({ characterId, moveId, onStart }) => {
  const [index, setIndex] = useState(0);
  const [messages, setMessages] = useState<string[]>([])
  const [labels, setLabels] = useState<string[]>([])
  const [enable, setEnable] = useState(false);
  const [error, showError] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string>("");
  
  console.info(characterId, moveId);
  
  const position = { bottom: '44%', right: '0px' }

  useEffect(() => {
    const fetchTutorial = async () => {
      // Simulate API call
      fetch(`${import.meta.env.BASE_URL}tutorial.json`)
        .then((res) => res.json())
        .then((data) => {
          const _messages = data[0].messages;
          setMessages(_messages)
          speakMessage(_messages[0])
          const _labels = data[1].labels;
          setLabels(_labels)
        })
        .catch(console.error)
    };

    fetchTutorial()
  }, []) 

  useEffect(() => {
    if (messages.length === 0) return;
    if (index >= messages.length - 1){
      setEnable(true)
      return;
    }

    const timer = setTimeout(() => {
      speakMessage(messages[index+1])
      setIndex((prev) => prev + 1);
    }, 5000);

    return () => clearTimeout(timer);
  }, [messages, index]);


  // 🔊 Narrate each question
  const speakMessage = (text: string) => {
    const msg = new SpeechSynthesisUtterance(text)
    msg.lang = 'en-GB'
    msg.rate = 1
    msg.pitch = 1.2
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(msg)
  }
  const handleSelect = (option: string) => {
    console.info(enable, ".... onSelectBlock >>> ", option);
    if(enable){
      if(option !== "Never"){
        showError(true)
      }else{
        setSelectedOptions(option)
        speakMessage("Great Job")
        setEnable(false)
      }
    }
  };
  

  return (
    <div style={styles.scene}>
      {!selectedOptions && 
        <img alt="Character" 
          src={`${import.meta.env.BASE_URL}characters/${characterId}`}          
          style={{
            ...styles.character,          
            bottom: position.bottom,
            right: position.right,
          }}
        />
      }
      <div style={styles.standdiv}></div>
      <div style={styles.questionWrapper}>
        {!selectedOptions && 
          <div style={styles.bubble}>
            <AnimatePresence mode="wait">
              {messages.length > 0 && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.3 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    width: '60%',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold'
                  }}
                >
                  {messages[index]}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        }
        {selectedOptions && 
          <>
            <div className='speech-bubble' style={{ height: 20, left: '33%', fontWeight: 700 }} >
              Great Job !
            </div>
            <img              
              src={`${import.meta.env.BASE_URL}characters/${characterId}`}
              alt={moveId}
              className={moveId}
              style={{
                position: 'absolute', bottom: '45%', right: '45%',
                width: 145, height: 175,
              }}
            />
          </>
        }
        <RampContainer widValue='86vw' items={labels} onSelect={handleSelect} />
      </div>

      {selectedOptions && 
        <div style={styles.navigation}>        
          <button className='start'                    
                  style={{
                    ...styles.nextButton
                  }}
                  onClick={() => onStart()}
          >
            Start
          </button>
        </div>
      }
      {error &&
        <div style={{
                      position: 'absolute', top: 0, left: 0,
                      width: '100%', height: '100%',
                      backgroundColor: 'rgba(255,255,255,0.4)', 
                      zIndex: 999999
                    }}
        >
          <div className='speech-bubble'
                    style={{
                      top: '33%', left: '33%',
                      padding: 20
                    }} 
          >
            Please choose 'Never'
            <button style={{
                      background: 'darkgrey', color: 'white', 
                      padding:'8px', margin:'0px 20px'
                    }} 
                    onClick={() =>showError(false)}
            >
              OK
            </button>
          </div>
        </div>
      }     
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  scene: {
    width: '100vw',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(120deg, rgb(132, 250, 176) 0%, rgb(143, 211, 244) 100%) rgb(255, 255, 255)'  
  },
  character: {    
    position: 'absolute',
    width:133, height:180,
    zIndex: 2,
    filter: 'drop-shadow(0px 0px 10px rgba(255,0,0,.5))',
    transition: 'top 0.5s ease, left 0.5s ease',
  },  
  standdiv: {
    position: 'absolute',
    right: 0, bottom: 0,
    width: '10vw', 
    height: '45%', 
    backgroundColor: 'black'
  },
  questionWrapper: {
    display:'grid', 
    gridTemplateRows:'2fr', 
    placeItems:'left', 
    height: '100vh'
  },
  bubble: {
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
  question: {
    position: 'relative',
    display: 'inline-block',
    marginTop: '20px',
    alignSelf: 'start'
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
    position: 'absolute',
    top: '20px',
    right: '10px',
    padding: '0px 20px'
  },
  nextButton: {
    padding: '12px 30px',
    fontSize: '1.2rem',
    backgroundColor: '#4CAF50',
    color: '#fff',               
    cursor: `url('${import.meta.env.BASE_URL}images/cursor.png'), auto`,
    clipPath: 'polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)'
  } 
}

export default Tutorial
