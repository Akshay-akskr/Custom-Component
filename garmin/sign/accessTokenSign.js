const axios = require('axios');
const oauthhelper = require('./oauthsign');

var request = {
    url: "https://connectapi.garmin.com/oauth-service/oauth/access_token",
    method: "POST"
};

const token = {
    key: '6680a126-560b-4dcc-8d91-0ae603eacea1',
	secret: 'M0SETPK8PE3jIeDI676VUO4HC2KqfMa35jp'
}

const nonce = generatenonce(16);
var requestUrl = 'https://connectapi.garmin.com/oauth-service/oauth/access_token';
var authHeader = oauthhelper.getAuthHeaderForAccess(requestUrl, token, nonce);
//console.log("authHeader >>", authHeader);

 var authVal = authHeader + ', oauth_verifier="AfDUiwUq33"';

var config = {
	 headers:{
		'Authorization': authVal,
	 }
};

console.log("config >>", config);

axios.get(request.url, config)
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


function generatenonce(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}