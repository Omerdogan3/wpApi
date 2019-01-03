var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = require('../config/config').constants.mongoUrl;
var phoneFormatter = require('phone-formatter');
var moment = require('moment');
var _ = require('lodash');

module.exports = (app) => {
  app.post('/onlinestatus',(req,res, next)=>{  
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
      if (err) throw err;
      var dbo = db.db("wp-api");
      let onlineUsers = JSON.parse(req.body.onlineStatus).map(el => String(el));
      dbo.collection("trackedUsers").aggregate([ { $project : { _id : 1 } } ]).toArray(function(err,allUsers){
        let offlineUsers = _.difference(allUsers.map(el=> el._id), onlineUsers);
        dbo.collection("trackedUsers").updateMany({ _id: {$in: offlineUsers} }, { $push: { userData : {status: 0, time: moment().format()} } }, function(err,result){
          dbo.collection("trackedUsers").updateMany({ _id: {$in: onlineUsers} }, { $push: { userData : {status: 1, time: moment().format()} } }, function(err,result){
            res.send({
              status: 1
            })
          })
        })
      })
    })
  })
}



