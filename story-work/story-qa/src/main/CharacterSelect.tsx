import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion";
import '../styles/animation.css';

type Props = {
  onSelect: (character: string, move: string) => void
}

type Character = {
  id: string
  text: string
}
type Move = {
  id: string
  text: string
  animation: string
}

const CharacterSelect: React.FC<Props> = ({ onSelect }) => {
  const [characters, setCharacters] = useState<Character[]>([])
  const [charactermoves, setCharacterMoves] = useState<Move[]>([])
  const [selectedChar, setSelectedChar] = useState<string | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState('');

  useEffect(() => {
    const fetchCharacters = async () => {
      fetch(`${import.meta.env.BASE_URL}characters.json`)
        .then((res) => res.json())
        .then((data) => {
          setCharacters(data[0].characters)
          setCharacterMoves(data[1].charactermoves)
        })
        .catch(console.error)
    };

    fetchCharacters()
    speakText("First, to make fun, let's find a character to help you - which one do you want to choose ? Point to one now")
  }, []) 

  const showCharTooltip = (c:Character) => {
    setHoveredIndex(c.id)
    speakText(c.text)
  }

  const speakText = (text: string) => {
    const msg = new SpeechSynthesisUtterance(text)
    msg.lang = 'en-GB'
    msg.rate = 1
    msg.pitch = 1.2
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(msg)
  } 

  const onSelectCharacter = (c: string) => {
    setSelectedChar(c)
    speakText("Now choose your move")
  }
  const onSelectMove = (m: string) => {
    onSelect(selectedChar!, m)
  }

  return (
    <div style={styles.container}>
      {(!selectedChar) && 
        <>
          <div style={styles.notediv} >
            First, to make fun, let's find a character to help you - which one do you want to choose ? Point to one now...
          </div>
          <div style={styles.grid}>
            {characters.map((c) => (
              <motion.div
                key={c.id}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  cursor: "pointer",
                  display: "inline-flex",
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: "12px",
                  overflow: "hidden",
                  padding: '2px',
                  marginTop: '20px'
                }}
                onMouseEnter={() => showCharTooltip(c)}
                onMouseLeave={() => setHoveredIndex('')}
              >
                <p style={{
                  ...styles.tooltiptext,
                  visibility: hoveredIndex === (c.id) ? "visible" : "hidden",
                }}>
                  {c.text}
                </p>
                <img              
                  src={`${import.meta.env.BASE_URL}characters/${c.id}`}
                  alt={c.id}
                  style={{
                    width: 200, height: 250,
                    //border: selectedChar === c ? '3px solid green' : '2px solid gray',
                    borderRadius: 8,
                    boxSizing: 'border-box',                
                    cursor: `url('${import.meta.env.BASE_URL}images/cursor.png'), auto`,
                    filter: selectedChar === (c.id) ? 'drop-shadow(0px 0px 10px rgba(255,0,0,.7))' : '',
                  }}
                  onClick={() => onSelectCharacter((c.id)!)}
                />
              </motion.div>
            ))}
          </div>
        </>
      }
      {selectedChar &&
        <>
          <div style={{ ...styles.notediv, height:60 }} >
           Now choose your move...
          </div>
          <div style={styles.gridmoves}>
            {charactermoves.map((m) => (
              <div
                key={m.id}
                style={{
                  cursor: "pointer",
                  display: "inline-flex",
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: "12px",
                  padding: '2px',
                }}
              >
                <div className="pink-glow-hover"
                    style={{
                      width: 200, height: 200,
                      border: '6px groove black',
                      borderRadius: 8,
                      boxSizing: 'border-box',                
                      cursor: `url('${import.meta.env.BASE_URL}images/cursor.png'), auto`,
                    }}
                    onClick={() => onSelectMove((m.id)!)}
                >
                  <img              
                    src={`${import.meta.env.BASE_URL}characters/${selectedChar}`}
                    alt={m.id}
                    className={m.animation}
                    style={{
                      width: 145, height: 175,
                    }}
                  />
                </div>
                <span style={{fontWeight:700}}>{m.text}</span>
              </div>
            ))}
          </div>

          
        </>
      }
      
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100vw',
    height: '90vh',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#23E6A7'
  },
  grid: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },  
  notediv: {
    height: '80px',
    width: '80vw',
    fontSize: '1.5rem',
    textAlign: 'center',
    padding: '0px 40px',
    position: 'fixed',
    top: '50px',
    right: '0px',
    background :'#87ABF5',
    color: 'white',
  },
  tooltiptext: {
    width: 200, height: 100,
    position: 'relative',
    margin: '2px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '700',   
    background: `url('${import.meta.env.BASE_URL}images/speech-bubble.png') center center / cover no-repeat`,
  },
  gridmoves: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '40px',
    width: '480px', 
    marginTop: '80px',
    overflow: "hidden",
  },
  start: {
    width: 116,
    height: 108,
    padding: '12px 24px',
    marginTop: '24px',
    color: 'white',
    fontSize: '1.2em',                
    cursor: `url('${import.meta.env.BASE_URL}images/cursor.png'), auto`,   
    background: `url('${import.meta.env.BASE_URL}images/arrow.png') no-repeat center center`,
    backgroundSize: 'cover',
    transition: 'transform .2s'
  }
}

export default CharacterSelect
