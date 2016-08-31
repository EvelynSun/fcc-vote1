var express = require('express');
var router = express.Router();

//import mogoose Poll model schema

var Poll = require('../models/Poll');

//import mogoose Vote model schema

var Vote = require('../models/Vote');

//get request of get /polls/create, render /polls/create.pug 
router.get('/create', function(req, res, next) {
  res.render('polls/create');
});


//get request of POST /polls/create

router.post('/create',function(req,res,next){
    var uid = req.user.id;
   // res.send('uid'+uid);
   var title = req.body.title;
   var options = req.body.options;
   
   
   //delete \r and split by \n
   
   options = options.replace(/\r/g,'').split('\n');
   //if poll name is empty, show an error message and redirect to the polls/create.pug 
   if(!title){
       req.flash('errors',{
           msg:'poll name can not be empty'
       });
       return res.redirect('/polls/create');
   }
   //if poll options is empty, show an error message and redirect to the polls/create.pug
   if(!options){
       req.flash('errors',{
           msg:'poll options can not be empty'
       })
       
       return res.redirect('/polls/create')
   }
   
   //create a new schema entity
   
   var poll = new Poll({
       
      title:title,
      options:options,
      uid:uid,
      
   });
   
  // save poll entity data
  var err = poll.validateSync()
  poll.save(function(err){
      if(err){
          return res.render('error',{
              err_title:'Failed to save a poll'
          })
      };
      
// after save sucessfully, redirect to vote index

  var qid = poll.qid;
    res.redirect('/polls/'+qid);
  })
  
  
   
});
//get request of /polls/mypoll,render /polls/mypoll.pug
router.get('/mypoll',function(req,res,next){
   // res.send('test');
   
   
   var uid = req.user.id;
   Poll.find({'uid':uid},{'_id':0})
        .select('title qid')
        .exec(function(err,result){
            var polls = result.map(function(data){
                return {
                    title:data.title,
                    url:'/polls/'+data.qid
                }
            })
            res.render('polls/mypoll',{
                polls:polls
            });
            
        })
})

//post delete request

router.post('/delete', function(req, res, next) {
  var qid = req.body.qid;
  var uid = req.user.id;
  
 // res.send('qid'+qid)
  Poll.findOne({qid: qid}, function(err, result) {
    if (!result ) {
      return res.render('error', {
        err_title: 'Poll Not Found',
        err_desc: 'Invalide poll id'
      });
    }
    if (result.uid !== uid) {
      req.flash('errors', { msg: 'You have no permission to delete other user\'s post'});
      return res.redirect('/polls/'+ qid);
    }
    
   result.remove(function(err) {
      if (err) {
        res.render('error', {
          err_title: 'Internal Error',
          err_desc: 'Remove poll failed!'
        })
      }
      req.flash('success', { msg: 'Delete poll successfully!'});
      return res.redirect('/polls/mypoll');
    });
  });
});

//get /:qid request

router.get('/:qid', function(req, res, next) {
  var qid = req.params.qid;
  Poll
    .findOne({ 'qid': qid })
    .select('title options qid uid')
    .exec(function(err, result) {
      if (!result) {
        res.render('error', {
          err_title: 'Poll Not Found',
          err_desc: 'Invalid poll id'
        });
      } else {
        res.render('polls/vote', {
          title: result.title,
          options: result.options,
          qid: result.qid,
          isOwner: req.user && req.user.id === result.uid
        });
      }
    });
});


router.post('/vote',function(req,res,next){
    var qid = req.body.qid;
    var voteId = req.body.voteId;
  //  var uid = req.user.id;
    
   // res.send('qid'+ voteId);
    if (!req.user || !req.user.id) {
        req.flash('errors',{
            msg:'please Login'
        })
    return res.redirect('/polls/'+qid);
    }
    
    
    if(!voteId) {
        req.flash('errors',{
            msg:'please select an option'
        })
        
        return res.redirect('/polls/'+qid);
    }
     var uid = req.user.id;
    Vote.findOne({'qid':qid,'uid':uid})
         .exec(function(err,result){
             if(result){
                 req.flash('errors',{
                     msg:'You have already voted!'
                 })
                 
                 return res.redirect('/polls/'+qid);
             }else {
                 var vote = new Vote({
                     uid:uid,
                     qid:qid,
                     option:voteId
                 });
                 
                 vote.save(function(err){
                     if(err) {
                         return res.render('error', {err_title: 'Failed to vote'})
                     }
                     req.flash('success',{
                         msg:'Thank You!'
                     })
                     console.log('qid'+qid)
                     res.redirect('/polls/'+qid)
                 })
             }
         })
})


module.exports = router;