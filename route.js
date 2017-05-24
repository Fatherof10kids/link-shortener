var express = require('express');
var encryptor = require('./encryptor.js');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/url';
var route = express.Router();

// _id auto incremented
var getNextSequenceValue = function(sequenceName,db){
  return db.collection('counters').findAndModify( { "_id" : sequenceName },[], { $inc: { sequence_value:1 } } , { new: false });
}

route.get('/new/https://:input_url',(req,res)=>{
  var input_url = req.params.input_url;

  MongoClient.connect(url,(e,db)=>{
    var promise = getNextSequenceValue("url_id",db);
    promise.then((doc)=>{
      db.collection('urls').insert({"_id": doc.value.sequence_value , "long-url": input_url } ,(err,res)=>{   // url_id is key of doc in counters collection

          db.close();
      });
    });


  });

encryptor()
 res.end('this is long url');
});

route.get('/:encoded',(req,res)=>{
res.end('this is encoded');
});
module.exports = route;
