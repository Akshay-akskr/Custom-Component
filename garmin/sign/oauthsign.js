const crypto = require('crypto');
const oauthSignature = require('oauth-signature');

const CONSUMERKEY = '5e5f558e-b9ef-4373-afbc-1821651b5e7c';
const CONSUMERSECRET = '5m0hSBUImv8lDzcsfR0AR3sttH1kK2xOeZS';

class oauthhelper {
	
	static getAuthHeaderForRequest(requesturl, token, nonce) {
		
		var timestamp = new Date().getTime();
		const ts = Math.floor(timestamp / 1000);
		
		var httpMethod = 'POST';
		var url = requesturl;
		var parameters = {
			oauth_consumer_key : CONSUMERKEY,
			oauth_token : token.key,
			oauth_nonce : nonce,
			oauth_timestamp : ts,
			oauth_signature_method : 'HMAC-SHA1',
			oauth_version : '1.0'
		};
		var tokenSecret = token.secret;
		
		// generates a BASE64 encode HMAC-SHA1 hash
		var signature = oauthSignature.generate(httpMethod, url, parameters, CONSUMERSECRET, tokenSecret,{ encodeSignature: false});		
		// generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
		var encodedSignature = oauthSignature.generate(httpMethod, url, parameters, CONSUMERSECRET, tokenSecret, {encodeSignature: true});	

		console.log(signature, "signature >>", encodedSignature);

		var OAuthHeader = 'OAuth oauth_version="1.0", oauth_consumer_key="' + CONSUMERKEY +	'", oauth_timestamp="' + ts + '", oauth_nonce="' + nonce + '", oauth_signature_method="HMAC-SHA1", oauth_signature="' + encodedSignature + '", oauth_token="' + token.key + '"';


		return OAuthHeader;
	}
	
	static getAuthHeaderForAccess(requesturl, token, nonce) {
		
		var timestamp = new Date().getTime();
		const ts = Math.floor(timestamp / 1000);
		
		var httpMethod = 'POST';
		var url = requesturl;
		var parameters = {
			oauth_consumer_key : CONSUMERKEY,
			oauth_token : token.key,
			oauth_nonce : nonce,
			oauth_timestamp : ts,
			oauth_signature_method : 'HMAC-SHA1',
			oauth_version : '1.0'
		};
		var tokenSecret = token.secret;
		
		// generates a BASE64 encode HMAC-SHA1 hash
		var signature = oauthSignature.generate(httpMethod, url, parameters, CONSUMERSECRET, tokenSecret,{ encodeSignature: false});		
		// generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
		var encodedSignature = oauthSignature.generate(httpMethod, url, parameters, CONSUMERSECRET, tokenSecret, {encodeSignature: true});	

		console.log(signature, "signature >>", encodedSignature);

		var OAuthHeader = 'OAuth oauth_version="1.0", oauth_consumer_key="' + CONSUMERKEY +	'", oauth_timestamp="' + ts + '", oauth_nonce="' + nonce + '", oauth_signature_method="HMAC-SHA1", oauth_signature="' + encodedSignature + '", oauth_token="' + token.key + '"';


		return OAuthHeader;
	}
}

module.exports = oauthhelper;