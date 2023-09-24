import express from 'express';
import { AppUserModel } from '../db-utils/model.js';
import {v4} from 'uuid';
import bcrypt from 'bcrypt';
//router 
const userRouter=express.Router();
//register router
userRouter.post('/register',async function(req, res){
    try{
        const payload=req.body;
        const userCheck=await AppUserModel.findOne({email:payload.email})
        if(userCheck)
        {
            res.status(409).send({message:"user already exist"})
            return;
        }
        bcrypt.hash(payload.password,10,async function(err,hash){
            if(err){
                res.status(500).send({message:"error in encrypting password"})
            }
        const user=new AppUserModel({...payload,password:hash,id:v4()});
        await user.save().then(()=>{console.log("User saved")})
        res.send({message:"user registered successfully"});
        })
    }catch(error){
        console.log(error.message);
        res.status(500).send({message:"error in resistering user details"});
    }
})
//user login
userRouter.post('/login',async function(req,res){
    try{
        const payload=req.body;
        const user=await AppUserModel.findOne({email:payload.email},{id:1,name:1,email:1,_id:0,password:1})
        if(user){
            await bcrypt.compare(payload.password,user.password,(_err,result)=>{
                if(!result){
                    res.status(401).send({message:"invalid credentials"});
                }
                else{
                    const responseObject=user.toObject();
                    delete responseObject.password;
                    res.send(responseObject);
                }
            })
        }else{
            res.status(404).send({message:"user is not found"});
        }
    }catch(error){
        console.log(error.message);
        res.status(500).send({message:"error in login  with user details"});
    }
})
export default userRouter