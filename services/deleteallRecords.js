var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var url = require('../config/config').constants.mongoUrl;

module.exports = (app) => {
  app.get('/deleteallrecords',(req,res, next)=>{  
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
      if (err) throw err;
      var dbo = db.db("wp-api");

      let myObj = {
        trackedNumbers: []
      }

      dbo.collection("trackedUsers").updateMany({}, {$set: {userData: []}},function(err,result){
        res.send({modified: result.modifiedCount})
      })
    })
  })
}
