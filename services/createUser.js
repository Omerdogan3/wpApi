var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var url = require('../config/config').constants.mongoUrl;

module.exports = (app) => {
  app.get('/createuser',(req,res, next)=>{  
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
      if (err) throw err;
      var dbo = db.db("wp-api");

      let myObj = {
        trackedNumbers: []
      }

      dbo.collection("users").insertOne(myObj,function(err,result){
        if(err) console.log(err);
        res.send({
          userid: myObj._id
        })
      })
    })
  })
}
