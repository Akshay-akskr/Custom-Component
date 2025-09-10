import { useState } from 'react';
import axios from 'axios';

function App() {

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [promptInput, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  
  const handleGenerate_TextVideo = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/generate-text-to-video`, { prompt: promptInput });
      setVideoUrl(res.data.output?.video_url || '');
    } catch (err) {
      alert('Error generating video');
    }
    setLoading(false);
  };
  
  /************ */
  
  //const image_url = "https://previews.123rf.com/images/spicytruffel/spicytruffel1904/spicytruffel190400013/122318676-kids-in-classroom-cartoon-children-in-school-studying-reading-and-writing-cute-happy-girls-and.jpg";
  const options = [
    { label: 'Character 1', url: 'https://htapps2.mobilous.com/CMS_QA/story-qa/characters/coolboy.png' },
    { label: 'Character 2', url: 'https://htapps2.mobilous.com/CMS_QA/story-qa/characters/coolgirl.png' },
    { label: 'Character 3', url: 'https://htapps2.mobilous.com/CMS_QA/story-qa/characters/formalboy.png' },
    { label: 'Character 4', url: 'https://htapps2.mobilous.com/CMS_QA/story-qa/characters/formalgirl.png' }
  ];

  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  const handleCharChange = (url: string) => {
    setSelectedChar(url);
  };
  
  const handleGenerate_ImageVideo = async () => {
    if(promptInput.trim() === '') {
      alert('Please enter a prompt');
      return; 
    }
    if(!selectedChar) {
      alert('Please select a character');
      return;
    }
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/dynamicui/generate-image-to-video`, {
        prompt: promptInput,
        image: selectedChar
      });

      console.info("Video URL:", res.data.videoUrl);
      setVideoUrl(res.data.videoUrl);

    } catch (err) {
      alert('Error generating video');
    }
    setLoading(false);
  };

  

  return (
    <>
    <div style={styles.root}>

      <div style={styles.container}>
        <h4>Input a Prompt</h4>
        <textarea style={styles.textbox}
          value={promptInput}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt"
          />
        <button style={styles.generateTI} onClick={handleGenerate_TextVideo} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Text to Image'}
        </button>
      </div>
      
      <div style={styles.container}>
        <h4>Select a Character</h4>
        {options.map((opt, idx) => (
          <label key={idx} style={{ display: 'block', margin: '8px' }}>
            <input type="radio" name="character"
              value={opt.url} onChange={() => handleCharChange(opt.url)} />
            {opt.label}
          </label>
        ))}
        <button style={styles.generate} onClick={handleGenerate_ImageVideo} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Image to Video'}
        </button>
      </div>      
      {selectedChar && (
        <img src={selectedChar} alt="Selected" style={{ width: '240px', height: 'auto', maxHeight: '240px'}} />
      )}

      {videoUrl && (
        <div style={{ position: 'absolute', bottom: '10px'}}>
          <h2>Generated Video</h2>
          <video src={videoUrl} controls width="500" />
        </div>
      )}

    </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  root: {
    width: '80vw',
    height: '95vh',
    padding: '2px 48px',
    display: 'flex',
    flexDirection: 'row',
    gap: '60px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '480px',
  },
  textbox: {
    minWidth: '240px',
    maxWidth: '480px',
    minHeight: '120px' 
  },  
  generateTI: {
    height: '54px',
    padding: '12px 24px',
    marginTop: 40,
    background: '#50b0f9',
    color: 'white',
    fontSize: '1.2em',
    transition: 'transform .2s',
    display: 'none'
  },
  generate: {
    height: '54px',
    padding: '12px 24px',
    marginTop: 40,
    background: '#50b0f9',
    color: 'white',
    fontSize: '1.2em',
    transition: 'transform .2s'
  },
}

export default App;