const crypto = require('crypto-js');
const OAuth = require('oauth-1.0a');

const CONSUMERKEY = process.env.CONSUMERKEY;
const CONSUMERSECRET = process.env.CONSUMERSECRET;
const CONSUMERKEYPRD = process.env.CONSUMERKEYPRD;
const CONSUMERSECRETPRD = process.env.CONSUMERSECRETPRD;

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
	
	static getAuthHeaderForRequestPRD(request) {
        const oauth = OAuth({
            consumer: { key: CONSUMERKEYPRD, secret: CONSUMERSECRETPRD },
            signature_method: 'HMAC-SHA1',
			hash_function(base_string, key) {
				return crypto.algo.HMAC
				  .create(crypto.algo.SHA1, key).update(base_string).finalize().toString(crypto.enc.Base64);
			},
        })

        const authorization = oauth.authorize(request);
        return oauth.toHeader(authorization);
    }
	
	static getAuthHeaderForAccessPRD(request, token) {
		const oauth = OAuth({
            consumer: { key: CONSUMERKEYPRD, secret: CONSUMERSECRETPRD},
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