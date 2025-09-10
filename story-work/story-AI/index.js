const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Replace with your actual RunwayML API key
const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;

app.post('/generate-image-to-video', async (req, res) => {
  const { image } = req.body;
  
  console.info("URL :::: ", image);
 
  try {	
	const result = await fetch(
	  "https://api.dev.runwayml.com/v1/image_to_video",
	  {
		method: "POST",
		headers: {
		  "Authorization": `Bearer ${RUNWAY_API_KEY}`,
		  "X-Runway-Version": "2024-11-06",
		  "Content-Type": "application/json",
		},
		body: JSON.stringify({
		  "promptImage": image,
		  "seed": 4294967295,
		  "model": "gen4_turbo",
		  "promptText": "string",
		  "duration": 5,
		  "ratio": "1280:720"
		}),
	  },
	).then(res => res.json());
	
	console.info("generate-image-to-video >>>", result);
	
	const videoId = result.id;

    // Step 2: Polling function
    const pollVideoStatus = async (id, maxRetries = 200, interval = 3000) => {
      let retries = 0;

      return new Promise((resolve, reject) => {
        const timer = setInterval(async () => {
          try {
			const pullVideoURL = `https://api.dev.runwayml.com/v1/tasks/${id}`;			
            const response = await fetch(pullVideoURL, {
                headers: {				  
				  "Authorization": `Bearer ${RUNWAY_API_KEY}`,
				  "X-Runway-Version": "2024-11-06",
                },
              }
            );

			if (!response.ok) {
			  const text = await response.text();
			  console.error(`HTTP Error ${response.status}: ${text}`);
			  throw new Error(`Failed request`);
			}
			
			const contentType = response.headers.get('content-type');
			if (contentType && contentType.includes('application/json')) {
				const data = await response.json();
				const _status = data.status.toLowerCase();
				console.info(_status, "tasks data >>>", data);
				
				/*
				
RUNNING tasks data >>> {
  id: '2d5bc50c-e62d-4315-b9d0-f00a7273c83d',
  status: 'RUNNING',
  createdAt: '2025-05-30T12:48:32.265Z',
  progress: 0.55
}
RUNNING tasks data >>> {
  id: '2d5bc50c-e62d-4315-b9d0-f00a7273c83d',
  status: 'RUNNING',
  createdAt: '2025-05-30T12:48:32.265Z',
  progress: 0.55
}
SUCCEEDED tasks data >>> {
  id: '2d5bc50c-e62d-4315-b9d0-f00a7273c83d',
  status: 'SUCCEEDED',
  createdAt: '2025-05-30T12:48:32.265Z',
  output: [
    'https://dnznrvs05pmza.cloudfront.net/5dc614ea-b7c0-42c7-8284-9772b4d25f3d.mp4?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMWFhYzRkZjhhM2IyMGRiMyIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc0ODczNjAwMH0.sC5NO854QV0cflAfSAd1O9MXBk1L7Gr9ucr8Bjf9yyU'
  ]
}

*/
				
				if (data.status === 'running') {
				  const _progress = (data.progress / 100) * 100;
				  console.info("polling-video task progress >>>", _progress);
				  
				} else if (data.status === 'succeeded') {
				  clearInterval(timer);
				  const _videoURL = data.output;
				  console.info("polling-video >>>", _videoURL);
				  resolve(_videoURL);
				  
				} else if (data.status === 'failed' || retries >= maxRetries) {
				  clearInterval(timer);
				  reject(new Error('Video generation failed or timed out.'));
				}
				
			} else {
			  const text = await response.text();
			  console.error('Expected JSON, got:', text);
			  reject(new Error('Unexpected response format'));
			}
			
            retries++;
          } catch (err) {
            clearInterval(timer);
            reject(err);
          }
        }, interval);
      });
    };

    // Step 3: Start polling and respond when ready
	console.info("videoId >>>", videoId);	
    const videoUrl = await pollVideoStatus(videoId);
	console.info("videoUrl >>>", videoUrl);
    res.json({ videoUrl });
	
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error generating video');
  }
});

app.post('/generate-text-to-video', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      'https://api.runwayml.com/v1/generate',
      {
        input: {
          prompt: prompt,
        },
        model: 'gen-2', // Choose the correct model slug
      },
      {
        headers: {
          Authorization: `Bearer ${RUNWAY_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Error generating video');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
