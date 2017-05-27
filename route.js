var express = require('express');
var encryptor = require('./encryptor.js');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/url';
var route = express.Router();

// _id auto incremented
var getNextSequenceValue = function(sequenceName,db){
  return db.collection('counters').findAndModify( { "_id" : sequenceName },[], { $inc: { sequence_value:1 } } , { new: false });
}

route.get('/new/*',(req,res)=>{
  var orginalURL = req.originalUrl;
  var regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  var input_url_Arr = orginalURL.match(regex); // return null if not match
  var input_url="";
  if(input_url_Arr!=null){
    input_url= input_url_Arr[0];
  MongoClient.connect(url,(e,db)=>{
    var promise = getNextSequenceValue("url_id",db);
    promise.then((doc)=>{
      db.collection('urls').insert({"_id": doc.value.sequence_value , "long-url": input_url } ,(err,result)=>{   // url_id is key of doc in counters collection
          var resObj = {
            "long-url" : input_url,
            "short-url" : req.headers.host+'/' + encryptor.encode(doc.value.sequence_value)
          }
          res.json(resObj);
          db.close();
      });
    });
  });
} // end of test url
else{
  res.send({ "error" : "Invalid URL"});
}
});


route.get('/:encoded',(req,res)=>{
  var encodedString = req.params.encoded;
  var _id = encryptor.decode(encodedString);
  if(_id==-1){
    res.send({"error" : 'There is no such link like this in database'});
  }
  else{
  MongoClient.connect(url,(err,db)=>{
    db.collection('urls').find({"_id":_id}).toArray((err,docs)=>{
      res.writeHead(301,
                {Location:docs[0]["long-url"]}
                          );
                          res.end();
                            db.close();
                            });
                              });
 }
});
module.exports = route;
