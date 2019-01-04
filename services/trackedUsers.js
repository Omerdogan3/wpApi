var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = require('../config/config').constants.mongoUrl;
// var phoneFormatter = require('phone-formatter');

module.exports = (app) => {
  app.get('/trackedusers/:userid',(req,res, next)=>{  
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
      if (err) throw err;
      var dbo = db.db("wp-api");


      dbo.collection("users").findOne({_id: ObjectId(req.params.userid)},function(err,result){
        res.send(result.trackedNumbers)
      })
    })
  })
}



