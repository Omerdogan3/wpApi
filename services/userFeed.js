var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = require('../config/config').constants.mongoUrl;
// var phoneFormatter = require('phone-formatter');
var moment = require('moment');

module.exports = (app) => {
  app.get('/userfeed/:phoneNumber/:page',(req,res, next)=>{  
    let page = parseInt(req.params.page);
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
      if (err) throw err;
      var dbo = db.db("wp-api");

      dbo.collection("trackedUsers").findOne({_id: req.params.phoneNumber},function(err,result){
        if(result === null){
          res.send([])
        }else{
          let onlineResult = [];
          let onlineInterval = [];
          let girCik = false;
          for(let i=0; i< result.userData.length; ++i){        
            if(result.userData[i].status === 1){
              girCik = false
              onlineInterval.push(result.userData[i])
            }else{
              if(girCik === false){
                girCik = true;
              }else{
                if(onlineInterval.length > 0){
                  onlineResult.push({
                    start: moment(onlineInterval[0].time).valueOf(),
                    end: moment(onlineInterval[onlineInterval.length-1].time).valueOf(),
                    duration: moment(onlineInterval[onlineInterval.length-1].time).diff(onlineInterval[0].time , "seconds")
                  });
                }
                onlineInterval = [];
              }
            }
          }
          
          onlineResult = onlineResult.sort((function(b,a){
            return new Date(a.start) - new Date(b.start);
          }))
          res.send(paginate(onlineResult, page))
        }

        

       
      })
    })
  })
}


function paginate (array, page_number) {
  let pageSize = 8;
  let result = array.slice(page_number * pageSize, (page_number + 1) * pageSize);
  return {result, isMore: result.length < pageSize ? false : true};
}



