var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = require('../config/config').constants.mongoUrl;
var currentApiUrl = require('../config/config').constants.currentApiUrl;
var axios = require('axios');
var moment = require('moment');
var _ = require('lodash');



module.exports = (app) => {
  app.get('/myfeed/:userid/:page',(req,res, next)=>{  
    let page = parseInt(req.params.page);
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
      if (err) throw err;
      var dbo = db.db("wp-api");

      axios.get(currentApiUrl + '/trackedusers/' + req.params.userid).then((trackedusers)=>{
        trackedusers = trackedusers.data.map(el=>el.phoneNumber)
        
        loopUserFeed(trackedusers, res, page)

      })
    })
  })
}


function getUserFeed(phoneNumber, page) { 
  console.log(currentApiUrl + '/userfeed/' + phoneNumber + '/' + page)
  return new axios.get(currentApiUrl + '/userfeed/' + phoneNumber + '/' + page).then((userData)=>{
    return (userData.data.result)
  })
}

async function loopUserFeed(trackedusers, res, page) {
  let x = null;
  let arr = [];
  for(let i=0; i<trackedusers.length; ++i){
    x = await getUserFeed(trackedusers[i], page);
    x.map(el=> el.phoneNumber = trackedusers[i])
    arr.push(x);
  }
  arr = _.flatten(arr)
  arr = arr.sort((function(b,a){
    return new Date(a.start) - new Date(b.start);
  }))
  res.send(arr);
}



