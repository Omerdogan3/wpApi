var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = require('../config/config').constants.mongoUrl;
var phoneFormatter = require('phone-formatter');

module.exports = (app) => {
  app.post('/stoptracknumber',(req,res, next)=>{  
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
      if (err) throw err;
      var dbo = db.db("wp-api");

      let phoneNumber = req.body.phoneNumber.replace(/[^+0-9]/g, '').replace(/^00/, '').replace(/\+/g, '');
      
      dbo.collection("users").updateOne({_id: ObjectId(req.body.userid)}, {
        $pull: {trackedNumbers: {phoneNumber: phoneNumber}}
      },function(err,result){
        dbo.collection("users").find({trackedNumbers: {$elemMatch: {phoneNumber:phoneNumber}}}).toArray(function(err,result){
          if(err) console.log(err);
          if(result.length>0){
            //o zaman silme
            res.send({status: 1, result: result.map(el=>el._id)})
          }else{
            //sil
            dbo.collection("trackedUsers").deleteMany({_id: phoneNumber},function(err,result){
              res.send({status: 1, result: result})
            })
          }
        })
      })
    })
  })
}



