import React, { useState } from 'react'
import { useEffect } from 'react';
import { motion , useCycle } from 'framer-motion';
import Lottie from "lottie-react";
import '../styles/animation.css';
import ProgressBar from '../components/ProgressBar';
import animationData from "../assets/circlejson.json";

type Props = {
  onSelect: () => void
}

type Character = {
  id: string
  text: string
}

const Welcome: React.FC<Props> = ({ onSelect }) => {  
  const [characters, setCharacters] = useState<Character[]>([])
  const [showBegin, setBegin] = useState<boolean>(false)
  const [showWelcome, setWelcome] = useState<boolean>(false)

  useEffect(() => {
    const fetchCharacters = async () => {
      fetch(`${import.meta.env.BASE_URL}characters.json`)
        .then((res) => res.json())
        .then((data) => {
          setCharacters(data[0].characters)
        })
        .catch(console.error)
    };
    fetchCharacters()

    const timer = setTimeout(() => {
      setBegin(true)
    }, 5000);
    return () => clearTimeout(timer);

  }, [showBegin]) 

  const [animation, cycleAnimation] = useCycle(
    { y: 0, scale: 1 },
    { y: -2, scale: 1.01 },
    { y: 0, scale: 1 }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      cycleAnimation();
    }, 1000); // change every 1 second

    return () => clearInterval(interval); // cleanup
  }, [cycleAnimation]);
  

  if(!showWelcome){
    return (
      <div style={styles.container}>
        <Lottie animationData={animationData} loop={true} style={{ width: 360, height: 'auto', display:'none' }} />;
        <div style={styles.grid}>
          {characters.map((c) => (
            <div
              key={c.id}
              style={{
                display: "inline-flex",
                borderRadius: "12px",
                overflow: "hidden",
                padding: '2px'
              }}
            >
              <img              
                src={`${import.meta.env.BASE_URL}characters/${c.id}`}
                alt={c.id}
                style={{
                  width: 180, height: 250,
                  borderRadius: 8,
                  boxSizing: 'border-box',
                  filter: 'drop-shadow(0px 0px 10px rgba(255,0,0,.5))',
                }}
              />
            </div>
          ))}
          <img src={`${import.meta.env.BASE_URL}images/circlegif.gif`} width="360" style={{display:'none'}}></img>
        </div>
        {!showBegin && <ProgressBar duration={5000} /> }
        {showBegin && 
          <button
            onClick={() => setWelcome(true)}
            className='start'
            style={{
              ...styles.start
            }}
          >
            Begin
          </button>        
        }
      </div>
    )

  }else{
    return (
      <div style={{
          ...styles.container
        }}
      >
        <div style={{
            ...styles.grid,
            flexDirection: 'column',
          }}
        >
          <motion.div
            animate={animation}
            transition={{ type: "spring", stiffness: 300, damping: 5 }}
            style={{
              ...styles.welcomediv,
              top: '60px',
              left: '0px',
              background: '#5276C5',
              rotate: '-2deg'
            }}
          >
              Health Tracker
          </motion.div>
          <motion.div
            animate={animation}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            style={{
              ...styles.welcomediv,
              top: '150px',
              right: '0px',
              background :'#87ABF5',
              color: 'white',
              rotate: '1deg'
            }}
            >
              How R U ?
          </motion.div>
          
          <img              
            src={`${import.meta.env.BASE_URL}characters/${characters[0].id}`}
            alt="character"
            className="slide-scale-image"
            style={{
              width: 320, height: 360,
              marginTop: 150,
              boxSizing: 'border-box', 
              filter: 'drop-shadow(0px 0px 10px rgba(255,0,0,.7))',
            }}
          />            
        </div>
        <button onClick={() => onSelect()}             
          className="rotate-fade"
          style={{
            width: '174px',
            height: '162px',
            padding: '12px',
            position: 'fixed',
            top: '50%',
            right: '15%',
            color: '#fff',
            textAlign: 'start',
            fontSize: '1.5rem',
            border: 'none',
            borderRadius: '8px',
            cursor: `url('${import.meta.env.BASE_URL}images/cursor.png'), auto`,   
            background: `url('${import.meta.env.BASE_URL}images/arrow.png') no-repeat center center`,
            backgroundSize: 'cover',
          }}
        >
          Let's Start
        </button>  
      </div>
    )
  }
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100vw',
    height: '90vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#23E6A7'
  },
  grid: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  start: {
    width: '200px',
    height: '120px',
    padding: '48px 24px',
    color: '#a52a2a',
    fontSize: '1.75rem',  
    fontWeight: 700,  
    backgroundColor: '#eddd00',            
    cursor: `url('${import.meta.env.BASE_URL}images/cursor.png'), auto`,
    clipPath: 'polygon(0 40%, 100% 20%, 100% 80%, 0 100%)'
  },
  welcomediv: {
    position: 'fixed',
    height: '80px',
    width: '80vw',
    fontSize: '2.5rem',
    textAlign: 'center',
    padding: '0px 40px'
  }
}

export default Welcome
