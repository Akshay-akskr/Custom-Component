const crypto = require('crypto-js');//require('crypto');
const OAuth = require('oauth-1.0a');

const CONSUMERKEY = '5e5f558e-b9ef-4373-afbc-1821651b5e7c';
const CONSUMERSECRET = '5m0hSBUImv8lDzcsfR0AR3sttH1kK2xOeZS';

class oauthhelper {
	
    static getAuthHeaderForRequestPost(request) {
        const oauth = OAuth({
            consumer: { key: CONSUMERKEY, secret: CONSUMERSECRET },
            signature_method: 'HMAC-SHA1',
			hash_function(base_string, key) {
				return crypto.algo.HMAC
				  .create(crypto.algo.SHA1, key).update(base_string).finalize().toString(crypto.enc.Base64);
			},
        })

        const authorization = oauth.authorize(request);
        return oauth.toHeader(authorization);
    }
	
	static getAuthHeaderForAccessPost(request, token) {
		const oauth = OAuth({
            consumer: { key: CONSUMERKEY, secret: CONSUMERSECRET},
            signature_method: 'HMAC-SHA1',
            hash_function(base_string, key) {
				return crypto.algo.HMAC
				  .create(crypto.algo.SHA1, key).update(base_string).finalize().toString(crypto.enc.Base64);
            },
        })

        const authorization = oauth.authorize(request, token);
        return oauth.toHeader(authorization);
    }

}

module.exports = oauthhelper;