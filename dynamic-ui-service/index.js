const express = require('express');
const cors = require("cors");
const multer = require('multer');
const fs = require('fs');
const zlib = require('zlib');

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.disable('x-powered-by');

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 5000;

/*const whitelist = ["http://localhost:3000","http://localhost:5173","https://htapps2.mobilous.com","https://healthtrackeruat.mobilous.com"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
		callback(null, true)
    } else {
		callback("Error: Not allowed by CORS");
    }
  },
  methods: ['GET','POST','DELETE'],
  credentials: true,
}*/

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow non-browser tools

    const hostname = new URL(origin).hostname;

    const isAllowed =
      hostname.endsWith('.mobilous.com') ||          // *.mobilous.com
      hostname === 'localhost';                 	// localhost

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  methods: ['GET','POST'],
  credentials: true,
};
app.use(cors(corsOptions));

app.get('/dynamicui', (req, res) => {
	res.send('Welcome !');
});

app.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}`);
});


// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'resources/uploads/');
  },
  filename: (req, file, cb) => {
	cb(null, file.originalname);		//Date.now() + '-' + file.originalname
  },
});

const upload = multer({ storage });

// File Upload Endpoint
app.post('/dynamicui/uploadfile', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  //console.info("");
  let filename = req.file.filename;
  manipulateData(filename, req, res);  
});

function manipulateData(filename, req, res){
	try {
		
		var uiData = [];
		
		fs.readFile('./resources/UIPartDic.json', 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			
			try {

				let uipartDic = JSON.parse(data).UIParts;
				//console.info("*************", uipartDic);		  
				
				let conditionData;
				/*try{
					const conditionfilename = filename.replace(".json","")+"_condition.json";
					const conditionfilepath = './resources/uploads/'+conditionfilename;
					if (fs.existsSync(conditionfilepath)) {
						const conditionfiledata = fs.readFileSync(conditionfilepath, 'utf8');
						conditionData = JSON.parse(conditionfiledata);
					} else {
						console.info('Condition File does not exist!');
					}
					
				}catch (err) {
					console.error("conditionfile error...", err);
				}*/				
				//console.info("ConditionData *************", conditionData);
					
			  
				let actiondata = fs.readFileSync('./resources/htapps_action.json', 'utf8');
				actiondata = actiondata.replaceAll("page_1213","__CURRENTPAGE__").replaceAll("page_1214","__CURRENTPAGE__").replaceAll("page_269378","__CURRENTPAGE__");
				let actionsArr = JSON.parse(actiondata);
				let actionsObj;
				let actionsCheckOff;
				let actionsRM;
				let actionsPOTRGridDelete;
				for(let i=0; i < actionsArr.length; i++){
					if(actionsArr[i]['name'] === "Base"){
						actionsObj = actionsArr[i]['actions'];
					}else if(actionsArr[i]['name'] === "CheckboxOff"){
						actionsCheckOff = actionsArr[i]['actions'];
					}else if(actionsArr[i]['name'] === "ReportMatrix"){
						actionsRM = actionsArr[i]['actions'];
					}else if(actionsArr[i]['name'].toLowerCase() === "portgriddeletecolumn"){
						actionsPOTRGridDelete = actionsArr[i]['actions'];
					}
				}
				
				let dateRangedata = fs.readFileSync('./resources/htapps_datetime.json', 'utf8');
				dateRangedata = dateRangedata.replaceAll("page_1275","__CURRENTPAGE__").replaceAll("page_1307","__CURRENTPAGE__");
				let dateRangeObj = JSON.parse(dateRangedata);
				//console.info("dateRangedata *************", dateRangeObj);
				
				let tablePOTRdata = fs.readFileSync('./resources/htapps_tablepotr.json', 'utf8');
				tablePOTRdata = tablePOTRdata.replaceAll("page_269378","__CURRENTPAGE__").replaceAll("page_269248","__CURRENTPAGE__");;				
				let tablePOTRObj = JSON.parse(tablePOTRdata);
				//console.info("tablePOTRdata *************", tablePOTRObj);
				
				const editBtndata = fs.readFileSync('./resources/htapps_edit.json', 'utf8');
				let editBtnObj = JSON.parse(editBtndata);
				//console.info("editBtndata *************", editBtnObj);				
				
				const filedata = fs.readFileSync('./resources/uploads/'+filename, 'utf8');
				//console.info("*************", JSON.parse(filedata));
				
				let contentHeight = 0;

				let arrData = JSON.parse(filedata);
				for(let i=0; i< arrData.length; i++){						
					let doNameIndex = true;
				
					let _uitype = arrData[i]['uitype'].toLowerCase();	
					//if(_uitype === "pagebreak")		_uitype = "textbutton";
					if(_uitype === "reportmatrixscore")		_uitype = "label";
					
					const baseUIdic = uipartDic[0].dic;
					let resultUI = uipartDic.filter((uidic) => uidic['name'].toLowerCase().indexOf(_uitype) > -1);
					
					if(_uitype === "editbutton"){
						resultUI = [];
						resultUI.push({ name:arrData[i]['uitype'], dic:{} });
						resultUI[0]['dic'] = editBtnObj;
						
					}else if(arrData[i]['uitype'].toLowerCase() === "reportmatrixscore"){
						const reportMatrixObj = JSON.parse(JSON.stringify(resultUI[0]));
						
						resultUI = [];
						resultUI.push({ name:"reportmatrixscore", dic:{} });
						
						let rmDic = JSON.stringify(reportMatrixObj['dic']);
						rmDic = rmDic.replaceAll("reportmatrixscore", "reportmatrixscore_"+arrData[i]['uiid']);						
						resultUI[0]['dic'] = JSON.parse(rmDic);
						
						//console.info(i, _uitype, "+++++ reportmatrixscore *************", resultUI[0]);						
						doNameIndex = false;						
						
					}else if(_uitype === "todate" || _uitype === "fromdate" || _uitype === "toduration" || _uitype === "fromduration" || _uitype === "showduration" || _uitype === "labelduration" || _uitype === "datediff" || _uitype === "timeflag" || _uitype === "fromtime" || _uitype === "totime" || _uitype === "singletime" || _uitype === "timepicker" || _uitype === "todaydate"){
						
						resultUI = [];
						resultUI.push({ name:arrData[i]['uitype'], dic:{} });
						
						let dicObj = dateRangeObj.find((element) => element.name === _uitype);
						let strDic = JSON.stringify(dicObj);
						strDic = strDic.replaceAll("todate", "todate_"+arrData[i]['uiid']).replaceAll("fromdate", "fromdate_"+arrData[i]['uiid']).replaceAll("toduration", "toduration_"+arrData[i]['uiid']).replaceAll("fromduration", "fromduration_"+arrData[i]['uiid']).replaceAll("showduration", "showduration_"+arrData[i]['uiid']).replaceAll("labelduration", "labelduration_"+arrData[i]['uiid']).replaceAll("datediff", "datediff_"+arrData[i]['uiid']).replaceAll("timeflag", "timeflag_"+arrData[i]['uiid']).replaceAll("fromtime", "fromtime_"+arrData[i]['uiid']).replaceAll("totime", "totime_"+arrData[i]['uiid']).replaceAll("singletime", "singletime_"+arrData[i]['uiid']).replaceAll("timepicker", "timepicker_"+arrData[i]['uiid']).replaceAll("todaydate", "todaydate_"+arrData[i]['uiid']);						
						
						strDic = strDic.replaceAll("uitype='showduration_"+ arrData[i]['uiid']+"'", "uitype='showduration'");
						
						resultUI[0]['dic'] = JSON.parse(strDic);
						
						doNameIndex = false;
						
					}else if(_uitype === "table_1" || _uitype === "popover_flag" || _uitype === "row_id_lbl" || _uitype === "col_id_lbl" || _uitype === "cell_id_lbl" || _uitype === "label_ques_no" || _uitype === "label_table_no" || _uitype === "Popover_show_option".toLowerCase()){
						
						resultUI = [];
						resultUI.push({ name:arrData[i]['uitype'], dic:{} });
						let dicObj = tablePOTRObj.find((element) => element.name === arrData[i]['uitype']);
						let strDic = JSON.stringify(dicObj);
						strDic = strDic.replaceAll("table_1", "table_1_"+arrData[i]['uiid']).replaceAll("popover_flag", "popover_flag_"+arrData[i]['uiid']).replaceAll("row_id_lbl", "row_id_lbl_"+arrData[i]['uiid']).replaceAll("col_id_lbl", "col_id_lbl_"+arrData[i]['uiid']).replaceAll("cell_id_lbl", "cell_id_lbl_"+arrData[i]['uiid']).replaceAll("Popover_show_option", "Popover_show_option_"+arrData[i]['uiid']).replaceAll("options_dynamic_ui","options_dynamic_ui_"+arrData[i]['uiid']).replaceAll("label_text","label_text_"+arrData[i]['uiid']).replaceAll("Cross_button","Cross_button_"+arrData[i]['uiid']).replaceAll("col1_btn","col1_btn_"+arrData[i]['uiid']).replaceAll("col1_tv","col1_tv_"+arrData[i]['uiid']).replaceAll("col2_btn","col2_btn_"+arrData[i]['uiid']).replaceAll("col2_tv","col2_tv_"+arrData[i]['uiid']).replaceAll("col3_btn","col3_btn_"+arrData[i]['uiid']).replaceAll("col3_tv","col3_tv_"+arrData[i]['uiid']).replaceAll("col4_btn","col4_btn_"+arrData[i]['uiid']).replaceAll("col4_tv","col4_tv_"+arrData[i]['uiid']).replaceAll("col5_btn","col5_btn_"+arrData[i]['uiid']).replaceAll("col5_tv","col5_tv_"+arrData[i]['uiid']).replaceAll("col6_btn","col6_btn_"+arrData[i]['uiid']).replaceAll("col6_tv","col6_tv_"+arrData[i]['uiid']).replaceAll("col7_btn","col7_btn_"+arrData[i]['uiid']).replaceAll("col7_tv","col7_tv_"+arrData[i]['uiid']).replaceAll("label_ques_no","label_ques_no_"+arrData[i]['uiid']).replaceAll("label_table_no","label_table_no_"+arrData[i]['uiid']);
						
						resultUI[0]['dic'] = JSON.parse(strDic);
						
						doNameIndex = false;
						
					}else if(resultUI.length === 0){
						continue;
					}
					
					let resultUIdic = JSON.parse(JSON.stringify(resultUI[0]['dic']));
					if(arrData[i]['id']){
						resultUIdic['id'] = arrData[i]['id'];
					}
					
					if(_uitype === "texteditor"){
						resultUIdic['showtoolbar'] = false;
					}
					
					if(resultUIdic.hasOwnProperty('text'))	resultUIdic['text'] = arrData[i]['uitext'];
					if(resultUIdic.hasOwnProperty('title'))	resultUIdic['title'] = arrData[i]['uitext'];				
					
					if(resultUIdic.hasOwnProperty('font')){
						resultUIdic['font']['fontName'] = arrData[i]['uifontfamily'];
						resultUIdic['font']['fontSize'] = parseInt(arrData[i]['uifontsize']);
						if(isNaN(arrData[i]['uifontweight'])){							
							resultUIdic['font']['fontWeight'] = (arrData[i]['uifontweight'] === 'Bold') ? true : false;
						}else{
							resultUIdic['font']['fontWeight'] = (arrData[i]['uifontweight'] === "") ? 400 : parseInt(arrData[i]['uifontweight']);
							resultUIdic['font']['fontWeightNum'] = (arrData[i]['uifontweight'] === "") ? 400 : parseInt(arrData[i]['uifontweight']);
						}
						resultUIdic['font']['textAlignment'] = arrData[i]['uihalign'];
						resultUIdic['font']['textColor'] = getRGBColor(arrData[i]['uicolor']);
					}else if(resultUIdic.hasOwnProperty('normalFont')){
						resultUIdic['normalFont']['fontName'] = arrData[i]['uifontfamily'];
						resultUIdic['normalFont']['fontSize'] = parseInt(arrData[i]['uifontsize']);						
						if(isNaN(arrData[i]['uifontweight'])){							
							resultUIdic['normalFont']['fontWeight'] = (arrData[i]['uifontweight'] === 'Bold') ? true : false;
						}else{
							resultUIdic['normalFont']['fontWeight'] = (arrData[i]['uifontweight'] === "") ? 400 : parseInt(arrData[i]['uifontweight']);
							resultUIdic['normalFont']['fontWeightNum'] = (arrData[i]['uifontweight'] === "") ? 400 : parseInt(arrData[i]['uifontweight']);
						}
						resultUIdic['normalFont']['textAlignment'] = arrData[i]['uihalign'];
						resultUIdic['normalFont']['textColor'] = getRGBColor(arrData[i]['uicolor']);
					}
					if(resultUIdic.hasOwnProperty('verticalAlignment'))	resultUIdic['verticalAlignment'] = arrData[i]['uivalign'];				
					
					if(resultUIdic.hasOwnProperty('borderWeight')){
						resultUIdic['borderWeight'] = (arrData[i]['uiborder'] === "") ? 0 : parseInt(arrData[i]['uiborder']);
					}
					if(resultUIdic.hasOwnProperty('borderColor')){
						if(arrData[i]['uibordercolor'])	
							resultUIdic['borderColor'] = getRGBColor(arrData[i]['uibordercolor']);		
					}					
						
					if(resultUIdic.hasOwnProperty('padding') && arrData[i]['uihpad'] !== ""){
						resultUIdic['padding']['left'] = (arrData[i]['uihpad'] === "") ? 0 : parseInt(arrData[i]['uihpad']);
						resultUIdic['padding']['right'] = (arrData[i]['uihpad'] === "") ? 0 : parseInt(arrData[i]['uihpad']);
					}
					if(resultUIdic.hasOwnProperty('frame')){
						resultUIdic['frame']['width'] = parseInt(arrData[i]['uiwidth']);
						resultUIdic['frame']['height'] = parseInt(arrData[i]['uiheight']);
						
						//if(resultUIdic['name'] && resultUIdic['name'].toLowerCase().indexOf('editbutton') === 0){
						if(resultUIdic['name']){
							const uiName = resultUIdic['name'].toLowerCase();
							if(uiName.indexOf('editbutton') === 0){	
								const groupUI = uiData.filter((uiItem) => uiItem['dynamicUIid'] === arrData[i]['uiid']);							
								if(groupUI.length > 0){							
									resultUIdic['frame']['x'] = groupUI[0]['frame']['width'];
									resultUIdic['frame']['y'] = groupUI[0]['frame']['y'];
								}
							}else {
								if(uiName.indexOf('fromdate') === 0 || uiName.indexOf('fromduration') === 0 || uiName.indexOf('showduration') === 0 || uiName.indexOf('singletime') === 0 || uiName.indexOf('fromtime') === 0){
									contentHeight = contentHeight + 10;
									resultUIdic['frame']['x'] = 10;
									resultUIdic['frame']['y'] = contentHeight;
									
									contentHeight = contentHeight + parseInt(arrData[i]['uiheight']);
								
								}else if(uiName.indexOf('todate') === 0){
									const fromdateUI = uiData.filter((uiItem) => uiItem['name'].toLowerCase().indexOf('fromdate') === 0);
									if(fromdateUI.length > 0){							
										resultUIdic['frame']['x'] = parseInt(fromdateUI[0]['frame']['x']) + parseInt(fromdateUI[0]['frame']['width']) + 20;
										resultUIdic['frame']['y'] = fromdateUI[0]['frame']['y'];
									}
								}else if(uiName.indexOf('toduration') === 0){
									const fromdurationUI = uiData.filter((uiItem) => uiItem['name'].toLowerCase().indexOf('fromduration') === 0);
									if(fromdurationUI.length > 0){							
										resultUIdic['frame']['x'] = parseInt(fromdurationUI[0]['frame']['x']) + parseInt(fromdurationUI[0]['frame']['width']) + 20;
										resultUIdic['frame']['y'] = fromdurationUI[0]['frame']['y'];
									}
								}else if(uiName.indexOf('labelduration') === 0){
									const showdurationUI = uiData.filter((uiItem) => uiItem['name'].toLowerCase().indexOf('showduration') === 0);
									if(showdurationUI.length > 0){							
										resultUIdic['frame']['x'] = parseInt(showdurationUI[0]['frame']['x']) + parseInt(showdurationUI[0]['frame']['width']) + 10;
										resultUIdic['frame']['y'] = showdurationUI[0]['frame']['y'];
									}
								}else if(uiName.indexOf('datediff') === 0){
									const labeldurationUI = uiData.filter((uiItem) => uiItem['name'].toLowerCase().indexOf('labelduration') === 0);
									if(labeldurationUI.length > 0){							
										resultUIdic['frame']['x'] = parseInt(labeldurationUI[0]['frame']['x']) + parseInt(labeldurationUI[0]['frame']['width']) + 10;
										resultUIdic['frame']['y'] = labeldurationUI[0]['frame']['y'];
									}
								}else if(uiName.indexOf('totime') === 0){
									const fromtimeUI = uiData.filter((uiItem) => uiItem['name'].toLowerCase().indexOf('fromtime') === 0);
									if(fromtimeUI.length > 0){							
										resultUIdic['frame']['x'] = parseInt(fromtimeUI[0]['frame']['x']) + parseInt(fromtimeUI[0]['frame']['width']) + 20;
										resultUIdic['frame']['y'] = fromtimeUI[0]['frame']['y'];
									}
								}
								
							}						
						}else{						
							contentHeight = contentHeight + 10;
							resultUIdic['frame']['x'] = 10;
							resultUIdic['frame']['y'] = contentHeight;
							
							contentHeight = contentHeight + parseInt(arrData[i]['uiheight']);
						}
					}
					
					let uiPart = Object.assign({}, baseUIdic, resultUIdic);
					if(doNameIndex){
						const _filenameArr = filename.split('_');
						let nameprefix = "";
						for(let p=0; p<_filenameArr.length; p++){
							nameprefix += (_filenameArr[p]) ? _filenameArr[p].charAt(0) : "";
						}
						uiPart.name = nameprefix +"_"+ _uitype +"_"+ i;
					}else{
						uiPart.name = arrData[i]['uitype'] +"_"+ arrData[i]['uiid'] +"_"+ i;
					}
					//console.info(doNameIndex, filename, "*********", uiPart.name);
					
					uiPart['dynamicUIid'] = arrData[i]['uiid'];
					
					if(arrData[i]['uivalue']) {
						if(_uitype === "webview"){
							let customVal = arrData[i]['uivalue'];							
							customVal = customVal.replaceAll('null,','').replaceAll(',null','');
							customVal = customVal.replaceAll("'","%22").replaceAll("&","%26").replaceAll("?","%3F");
							
							uiPart['queryString'] = "data="+customVal;
							
							/*customVal = decodeURIComponent(customVal);
							//console.info(customVal, "******* web view ******", decodeURIComponent(customVal));
							const queryData = JSON.parse(customVal);
							const queryStr = JSON.stringify(queryData, null, 2);
							let filepath = '/var/www/html/on-the-fly/data.json';
							
							// Write the JSON string to a file
							fs.writeFile(filepath, queryStr, (err) => {
							  if (err) {
								console.error('Error writing webview data file', err);
							  } else {
								console.info('webview data JSON file has been created successfully!');
							  }
							});*/
							
						}else{
							if(_uitype !== "checkbox"){
								if(uiPart.hasOwnProperty('value'))			uiPart['value'] = arrData[i]['uivalue'].toString();
								if(uiPart.hasOwnProperty('fieldname'))		uiPart['fieldname'] = arrData[i]['uivalue'].toString();
								//if(_uitype === "checkbox")					uiPart['fieldname'] = "";
								
								if(_uitype === "radiobutton"){
									uiPart['groupname'] = arrData[i]['uiid'];
								}
							}else{
								uiPart['fieldname'] = "";
							}
							
							if(_uitype === "checkbox" || _uitype === "radiobutton"){
								uiPart['dynamicUIValue'] = arrData[i]['id'];
							}else{
								uiPart['dynamicUIValue'] = arrData[i]['uivalue'].toString();
							}
							
						}						
					}					
					
					if(uiPart.hasOwnProperty('backgroundColor'))	uiPart['backgroundColor'] = getRGBColor(arrData[i]['uibackground']);
					
					if(arrData[i]['uiother']) {	
						try{
							let otherVal = arrData[i]['uiother'];
							//otherVal = otherVal.replaceAll(' ', '');
							otherVal = otherVal.replaceAll('%5B','[').replaceAll('%5D',']');
							otherVal = otherVal.replace(/\\\\/g, '\\').replace(/\\\//g, '/');
							
							console.info("otherVal *************", otherVal);

							/*function formatToJsonString(str) {
							  return str.replace(
								/(\w+):(\w+|{[^{}]*})/g, // Match keys and values, including nested objects
								(match, key, value) => {
									
									console.info(str, "*************", match, key, value);
									
									
								  if (value === 'true' || value === 'false' || !isNaN(value)) {
									// Handle booleans and numbers without quotes
									return `"${key}":${value}`;
								  } else if (value.startsWith('{')) {
									// Recursively process nested objects
									return `"${key}":${formatToJsonString(value)}`;
								  } else {
									// Handle string values with quotes
									return `"${key}":"${value}"`;
								  }
								}
							  );
							}
							/(\w+):(true|false|\d+|{[^{}]*}|\[.*?\]|[^,{}[\]]+)/g, // Match keys and all types of values
							
							*/	
							
							/*function formatToJsonString(str) {
							  return str.replace(
								/(\w+):([a-zA-Z_]+[\w\s\-\/]*|\d+\w+|\d+(\.\d+)?|{[^{}]*}|\[.*?\])/g, // Match keys and all types of values
								(match, key, value) => {
								  if (value === 'true' || value === 'false' || !isNaN(value)) {
									// Handle booleans and numbers without quotes
									return `"${key}":${value}`;
								  } else if (value.startsWith('{') || value.startsWith('[')) {
									// Recursively process nested objects or arrays
									return `"${key}":${formatToJsonString(value)}`;
								  } else {
									  console.info(key, "*************", value);
									  
									  //value = value.replace(/\\\//g, '/');
									// Handle string values (including date-like and placeholders) with quotes
									return `"${key}":"${value}"`;
								  }
								}
							  );
							}*/
							
							///(\w+):((?:https?:\\{0,2}\/{0,2}[\w\-\.\/]+)|[a-zA-Z_]+[\w\s\-\/]*|\d+\w+|\d+(\.\d+)?|{[^{}]*}|\[.*?\])/g, 
								
							function formatToJsonString(str) {
								return str.replace(
									/(\w+):((?:https?:\\{0,2}\/{0,2}[\w\-\.\/]+)|(?:[^{}\[\],:][^{}\[\],]*)|\d+\w*|\d+(\.\d+)?|{[^{}]*}|\[.*?\])/g,
									(match, key, value) => {										
										if(key === "https")	return key+":"+value;
										
										if (value === 'true' || value === 'false' || /^\d+(\.\d+)?$/.test(value)) {
											// Keep booleans and numbers without quotes
											return `"${key}":${value}`;
										} else if (value.startsWith('{') || value.startsWith('[')) {
											// Recursively process nested objects or arrays
											return `"${key}":${formatToJsonString(value)}`;
										} else {
											//console.info(key, "*******KV******", value);
											// Ensure text values (with spaces, numbers, and dashes) are quoted
											let fixedValue = value.replace(/\\\\/g, '\\').replace(/\\\//g, '/'); // Fix escaped slashes
											return `"${key}":"${fixedValue}"`;
										}
									}
								);
							}

							
							let otherString = `${formatToJsonString(otherVal)}`;							
							//console.info("otherString *************", otherString);							
							let otherObj = JSON.parse(otherString);						
							//console.info("otherObj *************", otherObj);							
							
							for (const prop in otherObj) {
								if(uiPart.hasOwnProperty(prop))	{
									//uiPart[prop] = otherObj[prop];
									const otherValue = otherObj[prop];
									if( otherValue === true || otherValue === false ) {
										uiPart[prop] = otherValue;
									}else if( typeof otherValue == "string" || !isNaN(otherValue) ) {
										uiPart[prop] = otherValue;
									}else{
										if(prop === "dataCols"){
											uiPart.dataCols.forEach((item, index) => {
											  if (otherValue[index]) {
												item['isInclude'] = otherValue[index]['isInclude'];
											  }
											});
										}else{
											uiPart[prop] = Object.assign(uiPart[prop], otherObj[prop]);
										}
									}
								}
							}
						}catch (err) {
							logError(err);
							console.error("issue in uiother...", err);
						}
					}
					
					if(arrData[i]['uiselectedvalue']) {
						uiPart['uiselectedvalue'] = (arrData[i]['uiselectedvalue'] === null) ? '' : arrData[i]['uiselectedvalue'];
					}
					
					if(arrData[i]['cell_id']) {
						uiPart['cell_id'] = (arrData[i]['cell_id'] === null) ? '' : arrData[i]['cell_id'];
					}
					
					try{
						if(resultUIdic.hasOwnProperty('actions')){
							
							let strActionsObj = JSON.stringify(actionsObj);
							
							/*strActionsObj = strActionsObj.replaceAll("table_1", "table_1_"+arrData[i]['uiid']).replaceAll("popover_flag", "popover_flag_"+arrData[i]['uiid']).replaceAll("row_id_lbl", "row_id_lbl_"+arrData[i]['uiid']).replaceAll("col_id_lbl", "col_id_lbl_"+arrData[i]['uiid']).replaceAll("cell_id_lbl", "cell_id_lbl_"+arrData[i]['uiid']).replaceAll("Popover_show_option", "Popover_show_option_"+arrData[i]['uiid']);
							*/							
							
							const uiid = arrData[i]['uiid'];
							strActionsObj = replaceExactWordChain(strActionsObj, [
							  ["table_1", `table_1_${uiid}`],
							  ["popover_flag", `popover_flag_${uiid}`],
							  ["row_id_lbl", `row_id_lbl_${uiid}`],
							  ["col_id_lbl", `col_id_lbl_${uiid}`],
							  ["cell_id_lbl", `cell_id_lbl_${uiid}`],
							  ["label_ques_no", `label_ques_no_${uiid}`],
							  ["label_table_no", `label_table_no_${uiid}`],
							  ["Popover_show_option", `Popover_show_option_${uiid}`]
							]);
							
							actionsObj = JSON.parse(strActionsObj);
							
							if(_uitype === "checkbox"){
								uiPart['actions']['on'] = actionsObj;
								uiPart['actions']['off'] = actionsCheckOff;
								
							}else if(_uitype === "radiobutton"){
								uiPart['actions']['Selected'] = actionsObj;
								
							}else if(_uitype === "combobox"){
								uiPart['actions']['OnSelect'] = actionsObj;
								
							}else if(_uitype === "slider"){
								uiPart['actions']['valueChanged'] = actionsObj;
							
							}else if(_uitype === "calendar"){
								uiPart['actions']['valueChanged'] = actionsObj;
							
							}else if(_uitype === "textview" && !uiPart['dynamicUIValue']){
								uiPart['dynamicUIValue'] = "";
								uiPart['actions']['DidEndEditing'] = actionsObj;
							
							}else if(_uitype === "webview"){								
								let strRM = JSON.stringify(actionsRM);
								strRM = strRM.replaceAll("reportmatrixscore", "reportmatrixscore_"+arrData[i]['uiid']);
								
								uiPart['actions']['DidFinishLoad'] = JSON.parse(strRM);
								
							}else if(_uitype === "potrgrid") {
								let strPGD = JSON.stringify(actionsPOTRGridDelete);								
								uiPart['actions']['OnDeleteColumn'] = JSON.parse(strPGD);
							}
						}
					} catch (err) {
						console.error(err);
						logError(err);
					}					
					
					uiData.push(uiPart);
				}
				
				if(conditionData){
					manipulateActionData(conditionData, uiData);
				}
				
				// Convert the object to a JSON string
				const jsonData = JSON.stringify(uiData, null, 2); // `null` and `2` are for pretty-printing

				const dirPath = '/var/www/html/on-the-fly/';
				let resultfile = dirPath + filename;

				fs.access(dirPath, (err) => {
				  if (err) {
					// Directory doesn't exist
					fs.mkdir(dirPath, { recursive: true }, (mkdirErr) => {
						if (mkdirErr) {
							return console.error('Error creating directory:', mkdirErr);
						}
						console.info('Directory created successfully!');

						// Write the JSON string to a file named "data.json"
						fs.writeFile(resultfile, jsonData, (err) => {
						  if (err) {
							console.error('Error writing file', err);
						  } else {
							console.info('JSON file has been created successfully!');
						
							const gzip = zlib.createGzip();
							const source = fs.createReadStream(resultfile);
							const destination = fs.createWriteStream(resultfile+'.gz');

							source.pipe(gzip).pipe(destination).on('finish', () => {
								console.log('JSON file compressed');
							});
						
							res.json({ message: 'File created successfully', filename: filename });
						  }
						});

					});
				  } else {
					console.info('Directory already exists.');
					try {
						// Write the JSON string to a file named "data.json"
						fs.writeFile(resultfile, jsonData, (err) => {
						  if (err) {
							console.error('Error writing file', err);
						  } else {
							console.info('JSON file has been created successfully!');
							
							const gzip = zlib.createGzip();
							const source = fs.createReadStream(resultfile);
							const destination = fs.createWriteStream(resultfile+'.gz');

							source.pipe(gzip).pipe(destination).on('finish', () => {
								console.log('JSON file compressed');
							});
	  
							res.json({ message: 'File created successfully', filename: filename });
						  }
						});
					} catch (err) {
					  logError(err);
					}
				  }
				});
				
				return uiData;
			} catch (err) {
			  console.error('Error',err);
			  logError(err);
			}
		});
		
	  
	} catch (err) {
	  console.error("UI Data error:", err);
	  logError(err);
	}
}
function getRGBColor(hex) {
	if(hex === null || hex === 0)	hex = "000000";
	
	// Remove the leading '#' if present
	hex = hex.replace(/^#/, '');

	// Parse the r, g, b values using base 16 (hexadecimal)
	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);

	return {"alpha": 1, "red": r, "green": g, "blue": b, "colorName": ""};	//`rgb(${r}, ${g}, ${b})`;
}

function replaceExactWordChain(str, replacements) {
  return replacements.reduce((result, [word, replacement]) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'g');
    return result.replace(regex, replacement);
  }, str);
}


function manipulateActionData(actionData, uiData){
	try {
		let setVisibleAction = { 
			"category": "ControlAction",
			"type": "Property", 
			"method":"setVisible",
			"params": {
				"targetPage": "__CURRENTPAGE__",
				"uiparts": [],
				"hidden": false
			},
			"actions" : {"onElse": [], "success": [], "error": []}
		};
		
		for(let i=0; i< actionData.length; i++){
			const uiid = actionData[i]['scale_id'] +"-"+ actionData[i]['variation_id'] +"-"+ actionData[i]['ques_no'];
			const refqid = actionData[i]['scale_id'] +"-"+ actionData[i]['variation_id'] +"-"+ actionData[i]['logic_ques_no'];
			const actionvalue = (actionData[i]['logic']) ? actionData[i]['logic'].toLowerCase() : '';
			const conditionvalue = actionData[i]['logic_option'];
			let condvalueArr = conditionvalue.split(",");
			
			let refUIData = uiData.filter((uiObj) => uiObj['dynamicUIid'] === refqid);
			if(refUIData.length > 0){
				let uiparts = [];
				for(let j=0; j< refUIData.length; j++){
					let uitarget = refUIData[j]['name'];// +'_'+ refUIData[j]['dynamicUIid'];
					uiparts.push(uitarget);
				}
				
				let sourceUIData = uiData.filter((uiObj) => uiObj['dynamicUIid'] === uiid);
				for(let k=0; k< sourceUIData.length; k++){
					let sourceUIObj = sourceUIData[k];
					if(sourceUIObj.hasOwnProperty('actions')){
						
						for (const [key, value] of Object.entries(sourceUIObj['actions'])) {
							//console.info(`${key}`, value);
							if(value.length > 0){
								
								let actionObj = JSON.parse(JSON.stringify(setVisibleAction));
								actionObj['params']['uiparts'] = uiparts;
								actionObj['params']['hidden'] = (actionvalue === "show") ? false : true;
								
								let restarget = sourceUIObj['name'];// +'_'+ uiid;
								
								let caseArr = [];
								if(condvalueArr.length > 0){
									for(let j=0; j< condvalueArr.length; j++){
										let caseObj = {operator:"E", target:restarget, value:condvalueArr[j], ORGroupCase:[], condtemp:"" };										
										caseArr.push(caseObj);
									}								
								}else{
									let caseObj = {operator:"E", target:restarget, value:conditionvalue, ORGroupCase:[], condtemp:"" };
									caseArr.push(caseObj);
								}
								let groupcaseArr = [{cases: caseArr}];
								let conditionObj = {groupcases: groupcaseArr};
								
								actionObj['params']['condition'] = conditionObj;
								
								//console.info(restarget, actionObj['params']['hidden'], " >>", JSON.stringify(uiparts.toString()));
								
								value.push(actionObj);							
							}
						}
					
					}					
				}
			}		
		}
		
	}catch (err) {
	  console.error("Action Data error:", err);
	  logError(err);
	}
}

app.post('/dynamicui/upload-actionfile', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  } 
  
  let filename = req.file.filename;
  res.json({ message: 'File created successfully', filename: filename });
});

/****** error logs ****/

const logFile = 'error.log';

function logError(error) {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] ERROR: ${error.stack || error}\n`;

  fs.appendFile(logFile, message, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
}

