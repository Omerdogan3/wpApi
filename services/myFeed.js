var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = require('../config/config').constants.mongoUrl;
var currentApiUrl = require('../config/config').constants.currentApiUrl;
var axios = require('axios');
var moment = require('moment');



module.exports = (app) => {
  app.get('/myfeed/:userid',(req,res, next)=>{  
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
      if (err) throw err;
      var dbo = db.db("wp-api");

      axios.get(currentApiUrl + '/trackedusers/' + req.params.userid).then((trackedusers)=>{
        trackedusers = trackedusers.data.map(el=>el.phoneNumber)
        
        loopUserFeed(trackedusers,res)

      })
    })
  })
}


function getUserFeed(phoneNumber) { 
  return new axios.get(currentApiUrl + '/userfeed/' + phoneNumber).then((userData)=>{
    return (userData.data)
  })
}

async function loopUserFeed(trackedusers,res) {
  // var x = trackedusers.map((el)=> (await getUserFeed("905315069751"))
  let x = null;
  let arr = [];
  for(let i=0; i<trackedusers.length; ++i){
    x = await getUserFeed(trackedusers[i]);
    arr.push({[trackedusers[i]]: x});
  }
  // var x = ;
  res.send(arr);
}



