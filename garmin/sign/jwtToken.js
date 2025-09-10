const axios = require('axios');
const jwthelper = require('./jwthelper');

const GENJWTURL = 'https://tslin-qa.apigee.net/generatejwt-hnwmobserver';

const APIURL = 'https://tslin-qa.apigee.net/hnwmobserver';

let jwtsign = jwthelper.generateJWTSignature();

const jwtURL = GENJWTURL+"?jwt-token="+ jwtsign;


axios.get(jwtURL)
  .then(res => {
	//console.log(res.status, ' > Result: ', res['headers']['jwt-response']);	
	let jwttoken = res['headers']['jwt-response'];
	
	const requestURL = APIURL + "/garmin/requestToken?jwt-token="+ jwttoken;
	axios.post(requestURL)
	  .then(res => {
		console.log(res.status, ' > Result: ', res.data);	
		
	  })
	  .catch(err => {
		console.log('Error2: ', err.message +' <'+ err.code +'>');
	  });
	
  })
  .catch(err => {
    console.log('Error1: ', err.message +' <'+ err.code +'>');
  });


//https://tslin-qa.apigee.net/hnwmobserver/images/642ae075ed2182707d6e5976?jwt-token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJUU0wtQVBJR0VFLUhOV01vYnNlcnZlclByb3h5IiwiYXBpa2V5IjoiYWttQWpiS2RBdUc4dXpTQWpEdG1xNEE0MW0wU0FYbW0iLCJhcHBOYW1lIjoiSE5XTW9ic2VydmVyIiwiaXNzIjoiVFNMLUFQSUdFRS1HZW5lcmF0ZUpXVC1ITldNb2JzZXJ2ZXIiLCJleHAiOjE2ODEyMjc1MjMsImlhdCI6MTY4MTIyNzIyMywianRpIjoiODljNjcwNzgtOGMxMS00OTgyLWFiZTctNWU5NGUyNmZjMjM5In0.pYnBp5VGQMiv7nAJBBFttifFnEVeqIVUV1a9b1lw8qw


//https://tslin-qa.apigee.net/hnwmobserver/images/642ae075ed2182707d6e5976?jwt-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJha21BamJLZEF1Rzh1elNBakR0bXE0QTQxbTBTQVhtbSIsImFwcE5hbWUiOiJITldNb2JzZXJ2ZXIiLCJpYXQiOjE2ODEyMjc1NDQsIm5iZiI6MzM2MjQ1NTA2OCwiZXhwIjozMzYyNDU1MzY4LCJhdWQiOiJUU0wtQVBJR0VFLUdlbmVyYXRlSldULUhOV01vYnNlcnZlciIsImlzcyI6IkhOV01vYnNlcnZlclByb2dyYW0ifQ.QZzsrtTN0Anz7AOav8TWSjHDLyAtfDaiTK22_u7Na8E