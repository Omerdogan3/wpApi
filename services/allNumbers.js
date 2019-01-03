var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var url = require('../config/config').constants.mongoUrl;
var _ = require('lodash');

module.exports = (app) => {
  app.get('/allnumbers',(req,res, next)=>{  
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
      if (err) throw err;
      var dbo = db.db("wp-api");

      dbo.collection("users").aggregate( [ { $project : { trackedNumbers: 1} } ] ).toArray(function(err,result){
        result = _.union(_.flatten(result.map(el => el.trackedNumbers.map(el2=> el2.phoneNumber))))
        res.send(result)
      })
    })
  })
}
