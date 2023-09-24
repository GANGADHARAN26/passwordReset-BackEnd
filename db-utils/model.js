import mongoose from "mongoose";
//user creation schema model
const userSchema=new mongoose.Schema({
    id:{
        type:String,
    },
    name:{ 
         type:String,
         required:true,
         min:3,
         max:15
    },
    email:{
        type:String,
         required:true,
         min:5,
         max:25
    },
    password:{
        type:String,
        required:true,
        min:5,
        max:20
    }
})
const AppUserModel=mongoose.model('AppUser',userSchema)

export {AppUserModel}