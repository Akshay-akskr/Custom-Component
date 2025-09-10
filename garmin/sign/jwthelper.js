const jwt = require('jsonwebtoken');

const APIKEY = 'akmAjbKdAuG8uzSAjDtmq4A41m0SAXmm';
const GENJWT = 'ae94d158-e3fd-47ae-8595-5574d9746a3a';
const APPNAME = 'HNWMobserver';
const ISSUER = 'HNWMobserverProgram';
const AUDIENCE = 'TSL-APIGEE-GenerateJWT-HNWMobserver';

class jwthelper {
	
    static generateJWTSignature() {
		
		const signedToken = jwt.sign({ apikey: APIKEY, appName: APPNAME}, GENJWT, 
							{algorithm: 'HS256', notBefore: -20, expiresIn: 280, audience:AUDIENCE, issuer:ISSUER},
							);

		//console.log(".....signedToken >>>>>>>>>", signedToken);
		return signedToken;
    }

}

module.exports = jwthelper;