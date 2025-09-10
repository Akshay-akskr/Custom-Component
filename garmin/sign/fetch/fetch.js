const { Agent, request } = require('https');

const httpOptions = {
  agent: new Agent({ keepAlive: true }),
  'User-Agent': `AWS Lambda Node/${process.version} surflog.app`,
  // Accept: 'application/json',
};

function fetch(options) {
  return new Promise((resolve, reject) => {
    const req = request(options, (res) => {
      const data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => {
        const result = Buffer.concat(data).toString();
        console.log(res.statusCode);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(result);
        } else {
          reject(result);
        }
      });
    });
    req.setTimeout(6000, (err) => {
      console.warn(err);
      console.warn('Timeout', options.hostname);
    });
    req.on('error', reject);
    req.end();
  });
}

module.exports = {
  httpOptions,
  fetch,
};