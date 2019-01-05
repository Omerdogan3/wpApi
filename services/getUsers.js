var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var url = require('../config/config').constants.mongoUrl;

module.exports = (app) => {
  app.get('/getusers/:serverNo/:step',(req,res, next)=>{  
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
      if (err) throw err;
      var dbo = db.db("wp-api");

      let step = parseInt(req.params.step);
      let serverNo = parseInt(req.params.serverNo)

      dbo.collection("trackedUsers").aggregate([
        {$match: {}},
        {$limit: 400},
        {$skip: 400 * serverNo},
        {$project: {_id: 1}}
      ]).toArray(function(err,result){
        result = result.map(el=>el._id);
        res.send(result.slice(step * 25, (step + 1) * 25));
      })
    })
  })
}
