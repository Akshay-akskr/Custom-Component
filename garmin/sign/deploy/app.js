var express = require('express');
var app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

const dotenv = require('dotenv');
dotenv.config();

const oauthhelper = require('./oauthhelper');
const jwthelper = require('./jwthelper');

const axios = require('axios');
const cors = require("cors");
const webpush = require('web-push');
const path = require('path');

app.disable('x-powered-by');

const whitelist = ["http://localhost:3000", "https://tslwellnessapp.mobilous.com"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
		console.log("origin -->", origin);
		//callback(new Error("Not allowed by CORS"));
		callback("Error: Not allowed by CORS");
    }
  },
  methods: ['GET','POST','DELETE'],
  credentials: true,
}
app.use(cors(corsOptions))

 ///////////////////////////////////// Web Push /////////////////////////////////////

// store client files in ./client directory.
app.use(express.static(path.join(__dirname, "client")))

const vapidKeys = {
	publicKey: process.env.PUBLICKEY,
	privateKey: process.env.PRIVATEKEY
}

// Setup the public and private VAPID keys to web-push library.
webpush.setVapidDetails("mailto:akshay.agarwal@mobilous.com", vapidKeys.publicKey, vapidKeys.privateKey);

//////////////////////

let users = [];
let registeredusers = [];
let dailyRecords = [];
let activityRecords = [];

app.use((req, res, next) => {
	
	console.log("is req.secure -->", req.secure);	
	//if (req.secure) {
		res.setHeader('Strict-Transport-Security', 'max-age=10368000;');
	//}
	
	const { error } = "";
	if (error){
		res.status(400).send(error.details[0].message)
		return;
	}
	
	var reqURL = req.originalUrl;
    console.log("ENd point -->", reqURL);
	
	next();
	
	/*var reqBody = req.body;
	
	if(reqURL.indexOf('/user') > -1) {
		if(reqURL.indexOf('/permissionchange') > -1 && reqBody.hasOwnProperty("userPermissionsChange")){
			console.log("come here --> 2");
			var arrPermissions = reqBody['userPermissionsChange'];
			console.log("come here --> 3", arrPermissions);
			if(arrPermissions && arrPermissions.length > 0){
				var permissionObj = arrPermissions[arrPermissions.length -1];
				var permissions = permissionObj['permissions'];
				console.log("come here --> 4", permissions);
				res.status(200).send({'permissions': permissions});
				return;
			}
		}
		else{
			next();	
		}
	}
	else{
		next();	
	}*/
	
});


app.get('/', (req, res) => {
	res.send('!');
});

const port = 3000 || process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}..`));


 ///////////////////////////////////// User Authentication /////////////////////////////////////


app.post('/garmin/requestToken', (req, res)=> {
	console.log("calling to garmin requestToken ....");
	const { error } = "";
	if (error){
		res.status(400).send(error.details[0].message)
		return;
	}
	
	var request = {
		url: "https://connectapi.garmin.com/oauth-service/oauth/request_token",
		method: "POST"
	};

	var authHeader = oauthhelper.getAuthHeaderForRequestPost(request);
	axios.post( request.url, request.body, { headers: authHeader })
	  .then(response => {
		var data = response['data'];
		var oauthToken = data.split('&')[0].replace('oauth_token=','');	
		var oauthSecret = data.split('&')[1].replace('oauth_token_secret=','');		
		res.status(200).send({ oauthtoken: oauthToken, oauthsecret: oauthSecret });
		
	  })
	  .catch(err => {
		console.log('Error: ', err.message +' <'+ err.code +'>');
		res.status(500).json({msg: `Internal Server Error.`});
	  });
});


app.post('/garmin/accessToken', (req, res)=> {	
	console.log("calling to garmin accessToken ....");
	const { error } = "";
	if (error){
		res.status(400).send(error.details[0].message)
		return;
	}
 
	var request = {
		url: "https://connectapi.garmin.com/oauth-service/oauth/access_token",
		method: "POST",
		data: { oauth_verifier: req.body.v }
	};

	const token = {
		key: req.body.k,
		secret: req.body.s
	}

	var authHeader = oauthhelper.getAuthHeaderForAccessPost(request, token);
	axios.post( request.url, request.body, { headers: authHeader })
	  .then(response => {
		var data = response['data'];
		var userToken = data.split('&')[0].replace('oauth_token=','');	
		var userSecret = data.split('&')[1].replace('oauth_token_secret=','');
		
		if(registeredusers){
			let useraccess = userToken.toString();
			if(registeredusers.indexOf(useraccess) == -1){
				registeredusers.push(useraccess);
			}
		}
		
		res.status(200).send({ usertoken: userToken, usersecret: userSecret });
		
	  })
	  .catch(err => {
		console.log('Error: ', err.message +' <'+ err.code +'>');
		res.status(500).json({msg: `Internal Server Error.`});
	  });  
});

//// PRD ////

app.post('/garmin/requestTokenPRD', (req, res)=> {
	console.log("calling to PRD requestToken ....");
	const { error } = "";
	if (error){
		res.status(400).send(error.details[0].message)
		return;
	}
	
	var request = {
		url: "https://connectapi.garmin.com/oauth-service/oauth/request_token",
		method: "POST"
	};

	var authHeader = oauthhelper.getAuthHeaderForRequestPRD(request);
	axios.post( request.url, request.body, { headers: authHeader })
	  .then(response => {
		var data = response['data'];
		var oauthToken = data.split('&')[0].replace('oauth_token=','');	
		var oauthSecret = data.split('&')[1].replace('oauth_token_secret=','');		
		res.status(200).send({ oauthtoken: oauthToken, oauthsecret: oauthSecret });
		
	  })
	  .catch(err => {
		console.log('Error: ', err.message +' <'+ err.code +'>');
		res.status(500).json({msg: `Internal Server Error.`});
	  });
});


app.post('/garmin/accessTokenPRD', (req, res)=> {	
	console.log("calling to PRD accessToken ....");
	const { error } = "";
	if (error){
		res.status(400).send(error.details[0].message)
		return;
	}
 
	var request = {
		url: "https://connectapi.garmin.com/oauth-service/oauth/access_token",
		method: "POST",
		data: { oauth_verifier: req.body.v }
	};

	const token = {
		key: req.body.k,
		secret: req.body.s
	}

	var authHeader = oauthhelper.getAuthHeaderForAccessPRD(request, token);
	axios.post( request.url, request.body, { headers: authHeader })
	  .then(response => {
		var data = response['data'];
		var userToken = data.split('&')[0].replace('oauth_token=','');	
		var userSecret = data.split('&')[1].replace('oauth_token_secret=','');
		
		if(registeredusers){
			let useraccess = userToken.toString();
			if(registeredusers.indexOf(useraccess) == -1){
				registeredusers.push(useraccess);
			}
		}
		
		res.status(200).send({ usertoken: userToken, usersecret: userSecret });
		
	  })
	  .catch(err => {
		console.log('Error: ', err.message +' <'+ err.code +'>');
		res.status(500).json({msg: `Internal Server Error.`});
	  });  
});


 /////////////////////// Get request to get API data ///////////////////////


function userDataHandler(request, response, next) {	
	
	const headers = {
		'Content-Type': 'text/event-stream',
		'Connection': 'keep-alive',
		'Cache-Control': 'no-cache'
	};
	response.writeHead(200, headers);
	
	const userId = request.query.id;
	const dataType = request.query.type;
	
	if(registeredusers && registeredusers.length > 0){	
		console.log(userId, "... registeredusers >>", registeredusers);	
		if(registeredusers.indexOf(userId) == -1){
			let nouser = `data: "No user found."\n\n`;
			response.write(nouser);
			response.status(200).end();
			return;
		}
	}
	
	//console.log(request.query.id, request.query.type, " ::", registeredusers.length, activityRecords.length);
	
	let data = `data: "No data found."\n\n`;
	if(dataType == 'dailies') {
		const nodailydata = 'No data found.';
		if(dailyRecords.length > 0){
			let userdailyRecords = dailyRecords.filter(daily => daily.userAccess === userId);
			if(userdailyRecords.length > 0){					
				const dailydata = {'dailies': userdailyRecords};
				data = `data: ${JSON.stringify(dailydata)}\n\n`;
			}else {
				data = `data: ${JSON.stringify(nodailydata)}\n\n`;
			}
		}else {
			data = `data: ${JSON.stringify(nodailydata)}\n\n`;
		}
	}else if(dataType == 'activities') {
		const noactivitydata = 'No data found.';
		if(activityRecords.length > 0){
			//let useractivityRecords = activityRecords.filter(activity => activity.userAccess === userId);			
			let useractivityRecords = activityRecords.filter(function(activity) {
				console.log(userId, ".. activity ::", activity);
				if(activity){
					return activity.userAccess === userId;
				}
			});
			
			if(useractivityRecords.length > 0){
				const activitydata = {'activities': useractivityRecords};
				data = `data: ${JSON.stringify(activitydata)}\n\n`;
			}else {
				data = `data: ${JSON.stringify(noactivitydata)}\n\n`;
			}
		}else {
			data = `data: ${JSON.stringify(noactivitydata)}\n\n`;
		}
	}
	response.write(data);
	
	const newUser = {id: userId, response};
	users.push(newUser);
	
	setTimeout(() => {		
		setResponseEnd(response, userId);
		console.log("Timeout sending events.");
	}, 3000);

	request.on('close', () => {
		console.log(`${userId} Connection closed`);
		if (!response.finished) {
			setResponseEnd(response, userId);
			console.log("Stopped sending events.");
		}	
	});
}

app.get('/garmin/wellness', userDataHandler);	// /garmin/wellness?id=97db7c23-542d-48e2-be82-5eb6c120b3e9&type=activities
 
var setResponseEnd = function(resp, userId) {
	resp.status(200).end();
	//console.log("setResponseEnd ::", dailyRecords.length, activityRecords.length);
	
	//dailyRecords = dailyRecords.filter(daily => daily.userAccess !== userId);
	activityRecords = activityRecords.filter(function(activity) {
		if(activity){
			return activity.userAccess !== userId;
		}
	});
	users = users.filter(user => user.id !== userId);
}

/////////////////////////////// User deregistration or Permission change ///////////////////////////////

const registrationDB = { subscription: null }

app.post('/garmin/registration', cors({origin: '*'}), (req, res)=> {
 
	console.log("calling to gaarmin registration ....");
 
	const { error } = "";
	if (error){
		res.status(400).send(error.details[0].message)
		return;
	}
	
	const subscription = req.body;
	registrationDB.subscription = subscription;
	res.status(200).send({ message: 'success' });
});


async function pushUserDeregistration(request, respsonse, next) {
	const reqBody = request.body;  
	console.log("calling to gaarmin Deregistration ....", reqBody);
	
	var arrDeregister = reqBody['deregistrations'];
	if(arrDeregister && arrDeregister.length > 0){		
		for(var i=0; i< arrDeregister.length; i++){
			var userID = arrDeregister[i]['userAccessToken'];
					
			registeredusers.forEach((ruser) => {
				console.log(i, ': '+userID, ' .... ruser', ruser);
				if(ruser === userID){
					console.log('Call for user: '+userID+' de-registeration.');
					//ruser.response.write(`data: ${userID} requested for de-registeration\n\n`);
					registeredusers = registeredusers.filter(user => user !== userID);
				}
			});
		}
		
		try {	  
			const subscription = registrationDB.subscription;
			if (subscription === null) {
				console.log("No subscribers in the app yet.");
				respsonse.status(200).send('ACK');
			} else {
				console.log("Got the subsciption.");				
				const payload = JSON.stringify({ title: "Health & Wellness", body: "Your account has been de-registered with app" });
				webpush.sendNotification(subscription, payload);
				respsonse.status(200).send('ACK');
				//respsonse.status(201).json({});
			}
		} catch (error) {
			// Passes errors into the error handler
			console.log("Deregistration error....", error);
			return next(error);
		}		
	}
}

app.post('/garmin/user/deregistration', pushUserDeregistration);


app.get('/garmin/user/permissionchange', (req, res)=> {
 
	console.log("calling to gaarmin permissionchange ....");
 
	const { error } = "";
	if (error){
		res.status(400).send(error.details[0].message)
		return;
	}
	
	res.status(200).send('ACK');
});


/////////////////////////////// User Activity API ///////////////////////////////


function sendSummaryDataToAll(records) {
	
	let definedrecords = records.filter(function(x) {
		 return x !== undefined;
	});
	
	const data = {activities: definedrecords};
	console.log("sendSummaryDataToAll >>", data);

	let jwtsign = jwthelper.generateJWTSignature();
	const GENJWTURL = 'https://tslin-qa.apigee.net/generatejwt-hnwmobserver';
	const jwtURL = GENJWTURL+"?jwt-token="+ jwtsign;
	axios.get(jwtURL)
	  .then(res => {
		//console.log(res.status, ' > Result: ', res['headers']['jwt-response']);	
		let jwttoken = res['headers']['jwt-response'];
		
		const requestURL = "https://tslin-qa.apigee.net/hnwmobserver/garmin/activityrecords?jwt-token="+ jwttoken;
		axios.post(requestURL, data)
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
	
}

async function setActivitySummary(request, respsonse, next) {
	const reqBody = request.body;
	console.log("calling to garmin activitysummary", reqBody);
	var arrActivity = reqBody["activities"];
	if(arrActivity && arrActivity.length > 0){
		activityRecords = [];
		var walkData = setUserActivityData(arrActivity,"WALKING");
		if(walkData && walkData.length > 0){
			activityRecords = activityRecords.concat(walkData);	
		}
		var runData = setUserActivityData(arrActivity,"RUNNING");
		if(runData && runData.length > 0){
			activityRecords = activityRecords.concat(runData);
		}
		var cycleData = setUserActivityData(arrActivity,"CYCLING");
		var bikeData = setUserActivityData(arrActivity,"BIKING");
		if(cycleData && cycleData.length > 0){
			if(bikeData && bikeData.length > 0){
				//cycleData = cycleData.concat(bikeData);
				if(parseInt(cycleData[0]['startTimeInSeconds']) > parseInt(bikeData[0]['startTimeInSeconds'])){
					activityRecords = activityRecords.concat(cycleData);
				}else{
					activityRecords = activityRecords.concat(bikeData);
				}
			}else{
				activityRecords = activityRecords.concat(cycleData);
			}
		}else{
			activityRecords = activityRecords.concat(bikeData);
		}
		var swimData = setUserActivityData(arrActivity,"SWIMMING");
		if(swimData && swimData.length > 0){
			activityRecords = activityRecords.concat(swimData);
		}
		var tennisData = setUserActivityData(arrActivity,"TENNIS");
		if(tennisData && tennisData.length > 0){
			activityRecords = activityRecords.concat(tennisData);
		}
		var golfData = setUserActivityData(arrActivity,"GOLF");
		if(golfData && golfData.length > 0){
			activityRecords = activityRecords.concat(golfData);
		}
		//console.log("activityRecords >>", activityRecords);
		//respsonse.status(200).json(activityRecords);
		//return sendSummaryDataToAll(activityRecords);
		
		sendSummaryDataToAll(activityRecords);
		respsonse.status(200).send('ACK');
	}else{
		respsonse.status(500).json({msg: `No records found`});
		return sendSummaryDataToAll('No data found');
	}	
}
app.post('/garmin/activity/summary', setActivitySummary);



function sendPRDSummaryDataToAll(records) {
	
	let definedrecords = records.filter(function(x) {
		 return x !== undefined;
	});
	
	const data = {activities: definedrecords};
	console.log("PRD SummaryDataToAll >>", data);

	let jwtsign = jwthelper.generatePRDJWTSignature();
	const GENJWTURL = 'https://tslin-prd.apigee.net/generatejwt-hnwmobserver';
	const jwtURL = GENJWTURL+"?jwt-token="+ jwtsign;
	axios.get(jwtURL)
	  .then(res => {
		//console.log(res.status, ' > Result: ', res['headers']['jwt-response']);	
		let jwttoken = res['headers']['jwt-response'];
		
		const requestURL = "https://tslin-prd.apigee.net/hnwmobserver/garmin/activityrecords?jwt-token="+ jwttoken;
		axios.post(requestURL, data)
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
	
}

async function setActivitySummaryPRD(request, respsonse, next) {
	const reqBody = request.body;
	console.log("calling to PRD activitysummary", reqBody);
	var arrActivity = reqBody["activities"];
	if(arrActivity && arrActivity.length > 0){
		activityRecords = [];
		var walkData = setUserActivityData(arrActivity,"WALKING");
		if(walkData && walkData.length > 0){
			activityRecords = activityRecords.concat(walkData);	
		}
		var runData = setUserActivityData(arrActivity,"RUNNING");
		if(runData && runData.length > 0){
			activityRecords = activityRecords.concat(runData);
		}
		var cycleData = setUserActivityData(arrActivity,"CYCLING");
		var bikeData = setUserActivityData(arrActivity,"BIKING");
		if(cycleData && cycleData.length > 0){
			if(bikeData && bikeData.length > 0){
				if(parseInt(cycleData[0]['startTimeInSeconds']) > parseInt(bikeData[0]['startTimeInSeconds'])){
					activityRecords = activityRecords.concat(cycleData);
				}else{
					activityRecords = activityRecords.concat(bikeData);
				}
			}else{
				activityRecords = activityRecords.concat(cycleData);
			}
		}else{
			activityRecords = activityRecords.concat(bikeData);
		}
		var swimData = setUserActivityData(arrActivity,"SWIMMING");
		if(swimData && swimData.length > 0){
			activityRecords = activityRecords.concat(swimData);
		}
		var tennisData = setUserActivityData(arrActivity,"TENNIS");
		if(tennisData && tennisData.length > 0){
			activityRecords = activityRecords.concat(tennisData);
		}
		var golfData = setUserActivityData(arrActivity,"GOLF");
		if(golfData && golfData.length > 0){
			activityRecords = activityRecords.concat(golfData);
		}
		
		sendPRDSummaryDataToAll(activityRecords);
		respsonse.status(200).send('ACK');
	}else{
		respsonse.status(500).json({msg: `No records found`});
		return sendSummaryDataToAll('No data found');
	}	
}
app.post('/garmin/prdactivity/summary', setActivitySummaryPRD);

//////////////////////////////


function sendActivityDetailsToAll(records) {
	console.log("sendActivityDetailsToAll >>", records);
	//const activitiesdata = {'activities': records};
	//users.forEach(user => user.response.write(`data: ${JSON.stringify(activitiesdata)}\n\n`));
}

async function setActivityDetails(request, respsonse, next) {
	
	var arrActivity = [];
	var reqBody = request.body;	
	var arrDetails = (reqBody.hasOwnProperty("activityDetails")) ? reqBody["activityDetails"] : reqBody;
	arrDetails.forEach((detail) => {	
		let dobj = Object.assign({}, detail["summary"]);
		dobj["userId"] = detail["userId"];
		dobj["userAccessToken"] = detail["userAccessToken"];
		arrActivity.push(dobj);	
	});
	console.log("calling to garmin activitydetails", arrActivity);
	if(arrActivity && arrActivity.length > 0){
		activityRecords = [];
		var walkData = setUserActivityData(arrActivity,"WALKING");
		if(walkData && walkData.length > 0){
			activityRecords = activityRecords.concat(walkData);	
		}
		var runData = setUserActivityData(arrActivity,"RUNNING");
		if(runData && runData.length > 0){
			activityRecords = activityRecords.concat(runData);
		}
		var cycleData = setUserActivityData(arrActivity,"CYCLING");
		var bikeData = setUserActivityData(arrActivity,"BIKING");
		if(cycleData && cycleData.length > 0){
			if(bikeData && bikeData.length > 0){
				//cycleData = cycleData.concat(bikeData);
				if(parseInt(cycleData[0]['startTimeInSeconds']) > parseInt(bikeData[0]['startTimeInSeconds'])){
					activityRecords = activityRecords.concat(cycleData);
				}else{
					activityRecords = activityRecords.concat(bikeData);
				}
			}else{
				activityRecords = activityRecords.concat(cycleData);
			}
		}else{
			activityRecords = activityRecords.concat(bikeData);
		}
		var swimData = setUserActivityData(arrActivity,"SWIMMING");
		if(swimData && swimData.length > 0){
			activityRecords = activityRecords.concat(swimData);
		}
		var tennisData = setUserActivityData(arrActivity,"TENNIS");
		if(tennisData && tennisData.length > 0){
			activityRecords = activityRecords.concat(tennisData);
		}
		var golfData = setUserActivityData(arrActivity,"GOLF");
		if(golfData && golfData.length > 0){
			activityRecords = activityRecords.concat(golfData);
		}
		//console.log("activityRecords >>", activityRecords);
		//respsonse.status(200).json(activityRecords);
		return sendActivityDetailsToAll(activityRecords);
	}else{
		respsonse.status(500).json({msg: `No data found`});
		return sendActivityDetailsToAll('No data found');
	}	
}
app.post('/garmin/activity/details', setActivityDetails);


app.get('/garmin/activity/manualdetails', (req, res)=> {
 
	const { error } = "";
	if (error){
		res.status(400).send(error.details[0].message)
		return;
	}
	
	console.log("calling to gaarmin activities");
	
	var timestamp = new Date().getTime();
	const currts = Math.floor(timestamp / 1000);
	const startts = currts - 900;

    const url = "https://apis.garmin.com/wellness-api/rest/manuallyUpdatedActivities?uploadStartTimeInSeconds="+startts+"&uploadEndTimeInSeconds="+currts;
	axios.get(url).then(response => response.json())
    .then((response) => {
		res.status(200).json(response);
	})
    .catch((err) => {
		res.status(500).json({msg: `Internal Server Error.`});
	});
});

app.get('/garmin/activity/moveiq', (req, res)=> {
 
	const { error } = "";
	if (error){
		res.status(400).send(error.details[0].message)
		return;
	}
	
	console.log("calling to gaarmin activities");
	
	var timestamp = new Date().getTime();
	const currts = Math.floor(timestamp / 1000);
	const startts = currts - 900;

    const url = "https://apis.garmin.com/wellness-api/rest/moveiq?uploadStartTimeInSeconds="+startts+"&uploadEndTimeInSeconds="+currts;
	axios.get(url).then(response => response.json())
    .then((response) => {
		res.status(200).json(response);
	})
    .catch((err) => {
		res.status(500).json({msg: `Internal Server Error.`});
	});
});



/////////////////////////////// User Health API calls ///////////////////////////////

async function setDailiesData(reqBody) {
	console.log("calling to garmin dailysummary", reqBody);
	var arrDaillies = reqBody["dailies"];
	if(arrDaillies && arrDaillies.length > 0){
		dailyRecords = [];
		var walkData = setUserActivityData(arrDaillies,"WALKING");
		if(walkData && walkData.length > 0){
			dailyRecords = dailyRecords.concat(walkData);	
		}
		var runData = setUserActivityData(arrDaillies,"RUNNING");
		if(runData && runData.length > 0){
			dailyRecords = dailyRecords.concat(runData);
		}
		//console.log("setDailiesData >>", dailyRecords);
		
		return dailyRecords;
		
	}else{
		return 'No records found';
	}	
}
app.post("/garmin/health/dailysummary", async function (req, res, next) {
	try {	  
		const reqBody = req.body;		
		let records = await setDailiesData(reqBody);
		console.log("dailysummary records", records);
		res.status(200).send({ result: records });

	} catch (error) {
		// Passes errors into the error handler
		return next(error);
	}
});


app.post('/garmin/health/epochdata', (req, res)=> {
	console.log("calling to garmin epochdata", req.body);
	const { error } = "";
	if (error){
		res.status(400).send(error.details[0].message)
		return;
	}
	
	var reqBody = req.body;	
	var arrDaillies = reqBody["epochs"];
	if(arrDaillies && arrDaillies.length > 0){
		var epochRecords = []
		var walkData = setActivityData(arrDaillies,"WALKING");
		if(walkData){
			walkData['activityType'] = 'STEPS';
			epochRecords.push(walkData);	
		}
		var runData = setActivityData(arrDaillies,"RUNNING");
		if(runData){
			epochRecords.push(runData);	
		}
		console.log("epochsRecords >>", epochRecords);
		
		res.status(200).json({'activityRecords': epochRecords});
		
	}else{
	
		var timestamp = new Date().getTime();
		const currts = Math.floor(timestamp / 1000);
		const startts = currts - 900;

		const url = "https://apis.garmin.com/wellness-api/rest/epoch?uploadStartTimeInSeconds="+startts+"&uploadEndTimeInSeconds="+currts;	//&oauth_consumer_key=eb60d6a5-0172-4bbd-ae02-d5a5ea2140fa&oauth_nonce=2464567464&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1473668857&oauth_token=07c6dd26-a57f-4c39-8fd3-6ac81d10fde6&oauth_version=1.0&uploadEndTimeInSeconds=1473668824&uploadStartTimeInSeconds=1473582424
		console.log("calling to garmin epochdata", url);
		
		axios.get(url).then(response => response.json())
		.then((response) => {
			console.log("result...");
			res.status(200).json(response);
		})
		.catch((err) => {
			res.status(500).json({msg: `Internal Server Error.`});
		});
	}
});


///////////////////////////////////// To set Activity data /////////////////////////////////////

var setUserActivityData = function(arrActivity, type) {
			
	var filteredArr = arrActivity.filter(function (el)
    {
      //return el.activityType == type;
	  return (el.activityType.indexOf(type) > -1);
    });
	
	var actdata = [];
	for(var i=0; i< filteredArr.length; i++){
		var myObj = {};
		myObj['stepswalked'] = (filteredArr[i]['steps']) ? sanitizeInput(filteredArr[i]['steps']) : 0;		
		myObj['durationInSeconds'] = (filteredArr[i]['activeTimeInSeconds']) ? sanitizeInput(filteredArr[i]['activeTimeInSeconds']) : filteredArr[i]['durationInSeconds'];
		myObj['distanceInMeters'] = sanitizeInput(filteredArr[i]['distanceInMeters']);
		myObj['speedms'] = (filteredArr[i]['averageSpeedInMetersPerSecond']) ? sanitizeInput(filteredArr[i]['averageSpeedInMetersPerSecond']) : 0;
		myObj['calories'] = sanitizeInput(filteredArr[i]['activeKilocalories']);
		myObj['startTimeInSeconds'] = sanitizeInput(filteredArr[i]['startTimeInSeconds']);
		myObj['userAccess'] = sanitizeInput(filteredArr[i]['userAccessToken']);
		myObj['userId'] = sanitizeInput(filteredArr[i]['userId']);
		
		actdata.push(myObj);		
	}
	
	if(actdata.length > 0) {
		
		const groupBy = (array, key) => {
		  return array.reduce((result, currentValue) => {
			(result[currentValue[key]] = result[currentValue[key]] || []).push(
			  currentValue
			);			
			return result;
		  }, {});
		};

		const actdataGroupedByUserAccess = groupBy(actdata, 'userAccess');
		//console.log("grouped actdata >>", actdataGroupedByUserAccess);
		
		let totalData = [];
		for (const ua in actdataGroupedByUserAccess) 
		{
			var userdata = actdataGroupedByUserAccess[ua];
			// taking last object, so only recent activity data sync.
			userdata = [userdata[userdata.length - 1]];
		
			var totalSteps = 0;
			var totalDuration = 0;
			var totalDistance = 0;
			var totalSpeed = 0;
			var totalCalories = 0;
			for(var j=0; j< userdata.length; j++){
				totalSteps = totalSteps + userdata[j]['stepswalked'];
				totalDuration = totalDuration + userdata[j]['durationInSeconds'];
				totalDistance = totalDistance + userdata[j]['distanceInMeters'];
				totalCalories = totalCalories + userdata[j]['calories'];
				totalSpeed = totalSpeed + userdata[j]['speedms'];
			}
			
			var totalObj = {};
			//totalObj['activityType'] = type;
			totalObj['activityType'] = (type == 'BIKING') ? 'CYCLING' : type;
			totalObj['stepswalked'] = totalSteps;		
			totalObj['distanceInMeters'] = totalDistance;
			totalObj['distanceInKMs'] = parseFloat(totalDistance)/1000;
			totalObj['durationInSeconds'] = totalDuration;
			totalObj['durationInMinutes'] = parseInt(totalDuration)/60;
			totalObj['avgSpeedInMpS'] = (totalSpeed > 0) ? (totalSpeed/userdata.length) : (totalDistance/totalDuration);
			totalObj['avgSpeedInKmpH'] = (totalSpeed > 0) ? (totalSpeed/userdata.length)*3.6 : (totalDistance/totalDuration)*3.6;
			totalObj['kiloCalories'] = totalCalories;
			totalObj['startTimeInSeconds'] = userdata[userdata.length-1]['startTimeInSeconds'];	
			totalObj['userAccess'] = userdata[userdata.length-1]['userAccess'];
			totalObj['userId'] = userdata[userdata.length-1]['userId'];		
			
			if(totalObj)	totalData.push(totalObj);
		}
		return totalData;
	}	
}

function sanitizeInput(input) {
	
	//console.log(typeof input, input);	
	
	if(typeof input == "string"){
		let malInput = false;
		if(input.indexOf("<")  > -1 || input.indexOf(">")  > -1) {
			malInput = true;
		}
		if(input.toLowerCase().indexOf("alert(")  > -1) {
			malInput = true;
		}
		if(input.toLowerCase().indexOf("confirm(")  > -1) {
			malInput = true;
		}		
		return (malInput) ? "" : input;
	} 	
	
	return input;
}

var setActivityData = function(arrActivity, type) {
	var totalObj;
	return totalObj;
}


