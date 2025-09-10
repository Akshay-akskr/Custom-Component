const axios = require('axios');
const oauthhelper = require('./oauthhelper');

var request = {
    url: "https://connectapi.garmin.com/oauth-service/oauth/request_token",
    method: "POST"
};

var authHeader = oauthhelper.getAuthHeaderForRequestPost(request);
console.log("authHeader >>", authHeader);


axios.post( request.url, request.body, { headers: authHeader })
  .then(res => {
    var data = res['data'];
	var oauthToken = data.split('&')[0].replace('oauth_token=','');	
	var oauthSecret = data.split('&')[1].replace('oauth_token_secret=','');	
	console.log(oauthToken, '.....request Token.... ', oauthSecret);	console.log("");
	
	var userAuthUrl = "https://connect.garmin.com/oauthConfirm?oauth_token=" + oauthToken + "&oauth_callback=https://apis.garmin.com/tools/oauthAuthorizeUser?action=step3";
	console.log("userAuthUrl >>", userAuthUrl);	console.log("");
	
	return {'UserAuthURL': userAuthUrl};	
  })
  .catch(err => {
    console.log('Error: ', err.message +' <'+ err.code +'>');
  }); 