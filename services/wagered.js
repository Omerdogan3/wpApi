var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var url = require('../config/config').constants.mongoUrl;

module.exports = (app) => {
  app.get('/wagered',(req,res, next)=>{  
    MongoClient.connect(url, {useNewUrlParser: true}, function(err, db) {
      if (err) throw err;
      var dbo = db.db("bitkong-api");

      dbo.collection("games").aggregate([
      {$match: {}},  
      { 
        $group: { 
          _id: null,
            total: { 
              $sum: "$amount" 
          } 
        } 
      }]).toArray(function(err, result) {
        if (err) console.log(err);
        res.send({
          total: result[0].total.toFixed(3)
        });        
      })
    })
  })
}
