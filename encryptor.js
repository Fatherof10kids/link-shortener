// encoder ==> take the id in urls collection and encode it
var symbol = ["A","B","a","b"];
var base = symbol.length;
var encode = function(_id){ // get the incremented _id of doc in urls collection
  //base10 to base 5
var encodeString = '';
var num = +_id;
while(num){
  encodeString = symbol[num%5] + encodeString;
  num = num/5;
}
return encodeString;
}

module.exports = encode;
