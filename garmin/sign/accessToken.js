const axios = require('axios');
const oauthhelper = require('./oauthhelper');

var request = {
    url: "https://connectapi.garmin.com/oauth-service/oauth/access_token",
    method: "POST",
	data: { oauth_verifier: 'Hello Ladies + Gentlemen, a signed OAuth request!' }
};

const token = {
    key: '<step1_token>',
	secret: '<step1_secret>'
}

var authHeader = oauthhelper.getAuthHeaderForAccessPost(request, token);
//console.log("authHeader >>", authHeader);
var config = {
	 headers:{ 'Authorization': authHeader.Authorization }
};

axios.post(request.url, request.body, config)
  .then(res => {
	console.log(res.status, ' > Result: ', res['data']);
	console.log("");
    var data = res['data'];
	console.log('data: ', data);
	console.log("");
	
  })
  .catch(err => {
    console.log('Error: ', err.message +' <'+ err.code +'>');
  });