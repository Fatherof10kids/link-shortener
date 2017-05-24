var express = require('express');
var router = require('./route');
var app = express();

var port = process.env.PORT || 5000;

// set the name variable port is "port" then get it later
app.set('port',port);

app.use('/',router);

app.get('/',(req,res)=>{
  res.end("hello");
});
app.listen(port,console.log("Server is listen to port",app.get('port')));
