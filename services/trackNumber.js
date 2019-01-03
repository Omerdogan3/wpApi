var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = require('../config/config').constants.mongoUrl;
var phoneFormatter = require('phone-formatter');

module.exports = (app) => {
  app.post('/tracknumber',(req,res, next)=>{  
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
      if (err) throw err;
      var dbo = db.db("wp-api");

      //userid
      //phonenumber
      let phoneNumber = req.body.phoneNumber.replace(/[^+0-9]/g, '').replace(/^00/, '');

      dbo.collection("users").updateOne({_id: ObjectId(req.body.userid)}, {
        $addToSet: {trackedNumbers: {phoneNumber, username: req.body.username}}
      },function(err,result){
        res.send({
          userid: req.body.userid,
          phoneNumber: phoneNumber,
          username: req.body.username,
          status: 1
        })
      })


      
    })
  })
}



