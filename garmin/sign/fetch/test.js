oAuth1Fetch({
  consumer: {
    key: 'xyz',
    secret: 'xyz',
  },
  token: {
    key: 'xyz',
    secret: 'xyz',
  },
  hostname: 'apis.garmin.com',
  path: '/wellness-api/rest/backfill/activities',
  query: {
    summaryStartTimeInSeconds: 1609459200,
    summaryEndTimeInSeconds: 1609459200 + 7776000,
  },
}).then(console.log).catch(console.error);