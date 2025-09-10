const axios = require('axios');
//const requestcall = require('request');
const oauthhelper = require('./oauthhelper');

var request = {
    url: "https://connectapi.garmin.com/oauth-service/oauth/request_token",
    method: "GET"
};

var authHeader = oauthhelper.getAuthHeaderForRequest(request);
var config = {
	 headers:{
		'Authorization': authHeader.Authorization,
	 }
};

console.log("config >>", config);

axios.get(request.url, config)
  .then(res => {
	//console.log(res.status, ' > Result: ', res['data']);	console.log("");
    var data = res['data'];
	var oauthToken = data.split('&')[0].replace('oauth_token=','');	
	var oauthSecret = data.split('&')[1].replace('oauth_token_secret=','');	
	console.log(oauthToken, '.....request Token.... ', oauthSecret);
	var userAuthUrl = "https://connect.garmin.com/oauthConfirm?oauth_token=" + oauthToken + "&oauth_callback=https://apis.garmin.com/tools/oauthAuthorizeUser?action=step3";
	console.log("userAuthUrl >>", userAuthUrl);
	
  })
  .catch(err => {
    console.log('Error: ', err.message +' <'+ err.code +'>');
  }); 
  
  
 /*requestcall(
        {
            url: request.url,
            method: request.method,
            headers: config.headers,
        },
        function (error, response, body) {
            if (response.statusCode == 200) {
                //result = JSON.parse(response.body);
                //console.log('Token', response.body);				
				var data = response.body;
				var oauthToken = data.split('&')[0].replace('oauth_token=','');	
				var oauthSecret = data.split('&')[1].replace('oauth_token_secret=','');	
				console.log(oauthToken, '.....request Token.... ', oauthSecret);
				var userAuthUrl = "https://connect.garmin.com/oauthConfirm?oauth_token=" + oauthToken + "&oauth_callback=https://apis.garmin.com/tools/oauthAuthorizeUser?action=step3";
				console.log("userAuthUrl >>", userAuthUrl);	
				
            }
        }
    );
*/


/*Authorization: OAuth oauth_nonce="5361085061", oauth_signature="RGTb%2F6alE6wbr54PLZ0KuKqhoK0%3D", oauth_consumer_key="5e5f558e-b9ef-4373-afbc-1821651b5e7c", oauth_timestamp="1678800211", oauth_signature_method="HMAC-SHA1", oauth_version="1.0"

 Authorization: 'OAuth oauth_consumer_key="5e5f558e-b9ef-4373-afbc-1821651b5e7c", oauth_nonce="afXoWXGH294CR1hddzhyIiDUuTnhTXNq", oauth_signature="qM%2FkCjLiP%2BueQ%2FiIgNHH7hwiLMw%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1679254790", oauth_version="1.0"'*/