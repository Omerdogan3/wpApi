var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = require('../config/config').constants.mongoUrl;
// var phoneFormatter = require('phone-formatter');
var moment = require('moment');

module.exports = (app) => {
  app.get('/userfeed/:userid',(req,res, next)=>{  
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
      if (err) throw err;
      var dbo = db.db("wp-api");


      dbo.collection("trackedUsers").findOne({_id: req.params.userid},function(err,result){
        if(result === null){
          res.send("Error")
        }else{
          let onlineResult = [];
          let onlineInterval = [];
          for(let i=0; i< result.userData.length; ++i){
            if(result.userData[i].status === 1){
              // console.log(result.userData[i])
              onlineInterval.push(result.userData[i])
            }else{
              if(onlineInterval.length > 0){
                onlineResult.push({
                  start: moment(onlineInterval[0].time).format('lll'),
                  end: moment(onlineInterval[onlineInterval.length-1].time).format('lll'),
                  duration: moment(onlineInterval[onlineInterval.length-1].time).diff(onlineInterval[0].time , "seconds")
                });
              }
              
              onlineInterval = [];
              
            }
          }
          res.send(onlineResult)
        }

        

       
      })
    })
  })
}



