const mongoose=require('mongoose');

const visitor=new mongoose.Schema({
    location:{
        require:true,
        type:Object
    },
    'mail':{
        require:true,
        type:String,
        lowercase:true,
        unique:true,
    },

},{timestamps:true});
const model=mongoose.model("VISITOR",visitor);

module.exports=model;