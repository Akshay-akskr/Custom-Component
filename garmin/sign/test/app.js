var express = require('express');
var app = express();

const cors = require("cors");
const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.post('/LEDon', function(req, res) {
    console.log('LEDon button pressed!');
    // Run your LED toggling code here
	
	const { error } = "";
	if (error){
		res.status(400).send(error.details[0].message)
		return;
	}
	
	res.status(200).json("akshay");
});

app.listen(1337);