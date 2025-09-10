const jwt = require('jsonwebtoken');

const APIKEY = process.env.APIKEY;
const GENJWT = process.env.GENJWT;
const APPNAME = process.env.APPNAME;
const ISSUER = process.env.ISSUER;
const AUDIENCE = process.env.AUDIENCE;

const APIKEYPRD = process.env.APIKEYPRD;
const GENJWTPRD = process.env.GENJWTPRD;
const APPNAMEPRD = process.env.APPNAMEPRD;
const ISSUERPRD = process.env.ISSUERPRD;
const AUDIENCEPRD = process.env.AUDIENCEPRD;

class jwthelper {
	
    static generateJWTSignature() {
		
		const signedToken = jwt.sign({ apikey: APIKEY, appName: APPNAME}, GENJWT, 
							{algorithm: 'HS256', notBefore: -20, expiresIn: 280, audience:AUDIENCE, issuer:ISSUER},
							);

		return signedToken;
    }
	
	static generatePRDJWTSignature() {
		
		const signedToken = jwt.sign({ apikey: APIKEYPRD, appName: APPNAMEPRD}, GENJWTPRD, 
							{algorithm: 'HS256', notBefore: -20, expiresIn: 280, audience:AUDIENCEPRD, issuer:ISSUERPRD},
							);

		return signedToken;
    }

}

module.exports = jwthelper;