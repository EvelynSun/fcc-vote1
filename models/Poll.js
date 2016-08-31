var mongoose = require('mongoose');
var crypto = require('crypto');

var pollSechema = new mongoose.Schema({
    
    title:{type:String,required:true},
    options:{type:[String],required:true},
    uid:{type:String,required:true},
    qid:{type:String},
    username:{type:String}
},{timestamp:true});

pollSechema.pre('save',function(next){
    var poll = this;
    poll.qid = crypto.randomBytes(8).toString('hex');
    next();
})


module.exports = mongoose.model('Poll',pollSechema);