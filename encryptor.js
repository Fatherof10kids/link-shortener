// encoder ==> take the id in urls collection and encode it
var symbol = ["A","B","a","b","+"];
var base = symbol.length;
var encode = function(_id){ // get the incremented _id of doc in urls collection
  //base10 to base 5
var encodeString = '';
var num = +_id;
while(num){
  encodeString = symbol[num%base] + encodeString;
  num = Math.floor(num/base);
}
return encodeString;
}

var decode = function(encodeString){
  var _id=0;
  var arrEncoded = encodeString.split('');
 for(var i=0;i<arrEncoded.length;i++){
      if(symbol.indexOf(arrEncoded[i])>=0){ // decodable // and symbol.indexOf(item) contains real value in baseXXX
        _id += symbol.indexOf(arrEncoded[i]) * Math.pow(base,(arrEncoded.length-1)-i);
        }
        else{ // false decode, return _id = -1
          _id= -1;
          return _id;
        }
      }
  return _id;
 };


module.exports = {
  encode : encode,
  decode : decode
};
