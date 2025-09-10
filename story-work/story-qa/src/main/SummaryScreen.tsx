import React from 'react'

type Answered = {
  questionId: number;
  questionText: string;
  selectedOptions: string[];
};

type Props = {
  answers: Answered[]
  onRestart: () => void
  onSubmit: () => void
}

const SummaryScreen: React.FC<Props> = ({ answers, onRestart, onSubmit }) => {
  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <h3 style={{textAlign:'start'}}>🎉 Your Story Summary</h3>
        <ul style={{ textAlign: 'start' }}>
          {answers.map((a, idx) => (
            <li key={idx} style={{ marginBottom: 10 }}>
              <strong>Q{idx + 1}:</strong> {a.questionText}
              <br />
              <strong>Given answer:</strong> {a.selectedOptions.toString()}
            </li>
          ))}
        </ul>
        <button onClick={onRestart} style={styles.button}>🔁 Restart</button>
        <button onClick={onSubmit} style={styles.submit}>Submit</button>
      </div>
    </div>
  )
}

export default SummaryScreen

const styles: { [key: string]: React.CSSProperties } = {
  screen: {
    width: '100vw',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(120deg, rgb(132, 250, 176) 0%, rgb(143, 211, 244) 100%) rgb(255, 255, 255)',
  },
  background: {
    width: '100%',
    height: '100%',
    //objectFit: 'cover',
    position: 'absolute',
    zIndex: 0,
  },
  character: {
    position: 'absolute',
    bottom: '10%',
    left: '10%',
    width: 150,
    height: '35vh',
  },
  card: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    background: 'rgba(255,255,255,0.95)',
    padding: '20px 30px',
    borderRadius: '12px',
    width: '72%',
    maxHeight: '80vh',
    textAlign: 'center'
  },
  button: {
    marginTop: 20,
    padding: '10px 12px',
    fontSize: 16,
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  submit: {
    marginTop: 20,
    marginLeft: 20,
    padding: '10px 20px',
    fontSize: 16,
    backgroundColor: '#0c828a',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
}
