const axios = require('axios');
const oauthhelper = require('./oauthhelper');

const CONSUMERKEY = '5e5f55*************5e7c';
const CONSUMERSECRET = '5m****************ZS';

var timestamp = new Date().getTime();
const currts = Math.floor(timestamp / 1000);
const startts = currts - 86400;

const summaryurl = "https://apis.garmin.com/wellness-api/rest/activities?uploadStartTimeInSeconds="+startts+"&uploadEndTimeInSeconds="+currts;

/*const nonce = generatenonce(10);
var parameters = {
	oauth_consumer_key : CONSUMERKEY,
	oauth_token : '97db7c23-542d-48e2-be82-5eb6c120b3e9',
	oauth_nonce : nonce,
	oauth_timestamp : currts,
	oauth_signature_method : 'HMAC-SHA1',
	oauth_version : '1.0'
};
var authStr = new URLSearchParams(parameters).toString();

var requestUrl = summaryurl + "&" + authStr;
console.log("requestUrl >> \n", requestUrl);
console.log("");

axios.get(requestUrl)
	.then(response => response.json())
	.then((response) => {
		console.log("dailysummary >>", response);
	})
	.catch((err) => {
		//console.log('Error: ', err.message +' <'+ err.code +'>');
		let errResponse = err['response'];
		console.log('GET Error: ', errResponse['data']['errorMessage'] +' <'+ errResponse['status'] +' :: '+ errResponse['statusText'] +'>');
	})
*/	
	
var request = {
	url: summaryurl,
	method: "GET",
	data: { oauth_token : '596ff1db-e6bd-4bd0-b6e6-519297633c74' }
};
var authHeader = oauthhelper.getAuthHeaderForRequestPost(request);
console.log("authHeader >>", authHeader);
axios.get( request.url, { headers: authHeader })
	  .then(response => {
		  console.log("acitivities >>", response);		
	  })
	  .catch(err => {
		let errResponse = err['response'];
		console.log('Oauth Error: ', errResponse['data']['errorMessage'] +' <'+ errResponse['status'] +' :: '+ errResponse['statusText'] +'>');
	  });
	  
	
function generatenonce(length) {
    var text = "";
    var possible = "0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;

}
