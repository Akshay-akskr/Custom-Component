const crypto = require('crypto');
const { stringify: qStringify } = require('querystring');
const { httpOptions, fetch } = require('./fetch');

function nonce() {
  return crypto.randomBytes(16).toString('hex');
}

function sign(baseStr, key) {
  return crypto.createHmac('sha1', key).update(baseStr).digest('base64');
}

function percentEncode(str) {
  const notEscapedRe = /[!'()*]/g;
  return encodeURIComponent(str).replace(notEscapedRe, (c) => `%${c.charCodeAt(0).toString(16)}`);
}

function makeObjStr(parameters, quote = '"', split = ',') {
  const ordered = Object.fromEntries(Object.entries(parameters).sort());
  return Object.entries(ordered).map(([key, value]) => `${percentEncode(key)}=${quote}${percentEncode(value)}${quote}`).join(split);
}

function authHeader(parameters) {
  return { Authorization: `OAuth ${makeObjStr(parameters)}` };
}

function makeHeader(consumer, token, request) {
  const oauthData = {
    oauth_consumer_key: consumer.key,
    oauth_token: token.key,
    oauth_nonce: nonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000),
    oauth_version: '1.0',
  };
  const baseStr = [
    request.method.toUpperCase(),
    percentEncode(request.url),
    percentEncode(makeObjStr({ ...request.data, ...oauthData }, '', '&')),
  ].join('&');
  const signingKey = [percentEncode(consumer.secret), percentEncode(token.secret)].join('&');
  return authHeader({
    ...oauthData,
    oauth_signature: sign(baseStr, signingKey),
  });
}

function oAuth1Fetch({
  consumer, token, hostname, path, query = {},
}) {
  const request = {
    method: 'GET',
    url: `https://${hostname}${path}`,
    data: query,
  };
  return fetch({
    ...httpOptions,
    headers: makeHeader(consumer, token, request),
    hostname,
    path: `${path}?${qStringify(query)}`,
  });
}

module.exports = {
  oAuth1Fetch,
};