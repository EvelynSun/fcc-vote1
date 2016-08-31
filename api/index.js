var express = require('express');
var router = express.Router();
var Poll = require('../models/Poll');
var Vote = require('../models/Vote');
var _ = require('underscore');

router.get('/list', function(req, res, next) {
  Poll
    .find({}, { '_id': 0})
    .limit(10)
    .sort('-updateAt')
    .select('title options qid uid')
    .exec(function(err, result) {
      res.json(result);
    });
});

router.get('/vote_result', function(req, res, next) {
  var qid = req.query.qid;
  
  console.log('result_qid'+qid);
  if (!qid) {
    return res.end('missing qid.');
  }
  Vote.aggregate([
    {
      $match: {
        qid: qid
      }
    },
    {
      $group: {
        '_id': '$option',
        'count': {$sum: 1}
      }
    }
  ], function (err, result) {
    if (err) {
      res.json(err);
    } else {
        console.log(result);
      res.json(result);
    }
  });
});

module.exports = router;