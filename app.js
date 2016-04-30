'use strict';
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.set('port', port);

app.use(express.static(path.join(__dirname, 'public')));

let server = app.listen(app.get('port'), ()=>{
	let fullUrl = 'http://localhost:'+port;
	console.log('Please open your browser on :', fullUrl);
});