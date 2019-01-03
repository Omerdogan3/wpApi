var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = require('../config/config').constants.mongoUrl;
var phoneFormatter = require('phone-formatter');

module.exports = (app) => {
  app.get('/trackeddata/:userid',(req,res, next)=>{  
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
      if (err) throw err;
      var dbo = db.db("wp-api");

      res.send({test: 'test'})

      
    })
  })
}



