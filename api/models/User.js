const mongoose = require("mongoose");
const Joi = require('joi');
const { number } = require("joi");

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:3,
        maxlength:20,
        unique:true
    },
    email:{
        type:String,
        required:true,
        minlength:11,
        maxlength:50,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    profilePicture:{
        type:String,
        default:""
    },
    coverPicture:{
        type:String,
        default:""
    },
    followers:{
        type:Array,
        default:""
    },
    following:{
        type:Array,
        default:""
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    desc:{
        type:String,
        maxlength:50,
        default:"",
    },
    city:{
        type:String,
        maxlength:50,
        default:"",
    },
    from:{
        type: String,
        maxlength:50,
        default:"",
    },
    relationship:{
        type:String,
        maxlength:50,
        default:"single",
    }
},{timestamps:true})

function validateUser(user) {
    const schema = {
        username: Joi.string().min(3).max(20).required(),
        email: Joi.string().min(11).max(50).required().email(),
        password: Joi.string().min(8).max(255).required(),
        profilePicture: Joi.string(),
        coverPicture:Joi.string(),
        followers:Joi.string(),
        following:Joi.string(),
        isAdmin:Joi.boolean(),
        desc:Joi.string(),
        city:Joi.string(),
        from:Joi.string(),
        relationship:Joi.string()
    };
    return Joi.validate(user, schema);
}

module.exports = mongoose.model("User",UserSchema)
exports.validate = validateUser;