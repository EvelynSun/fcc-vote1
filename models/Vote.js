var mongoose = require('mongoose');
var voteSchema = new mongoose.Schema({
    qid:{type:String, requiered:true},
    uid:{type:String, required:true},
    option:{type:String,required:true}
},{timestamps:true});

module.exports = mongoose.model('Vote',voteSchema);