import express from 'express';
import { AppUserModel } from '../db-utils/model.js';
import {v4} from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { transport } from './mail.js';
import {mailOptions} from  './mail.js';
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
                    const accessToken=jwt.sign({email:responseObject.email},process.env.JWT_SECRET,{expiresIn:'1d'})
                    
                    res.send({...responseObject,accessToken});
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
//forgotPassword
userRouter.post('/forgotPassword',async(req,res)=>{
    const email=req.body.email;
    const emailIsThere=await AppUserModel.findOne({email: email});

    try{ 
        if(emailIsThere){
            const token=jwt.sign({email:email},process.env.JWT_SECRET,{expiresIn:'1d'});
            const link=`${process.env.FRONTEND_URL}/verify?token=${token}`
            await AppUserModel.updateOne({email:email},{'$set':{token:token}})
            await transport.sendMail({...mailOptions,to:email,text:`Please verify your e-mail address using these link ${link} `})
            res.status(200).send({message:"email successfully"}) 
            console.log("email successfully"+link)
        }
        else{
            res.status(401).send({message:"invalid credentials"});
        } 
    }
   catch(error){
    console.log(error)
    res.status(500).send({msg:"error occured in forgot "})
   }  
})
//verifying token
userRouter.post('/verify-token',async(req,res)=>{
 
    try{ 
        const token = req.body.token;
        jwt.verify(token,process.env.JWT_SECRET,async(err,result)=>{
           console.log(result,err)
            await AppUserModel.updateOne({email:result.email},{'$set':{isVerified:true}})
            res.send({msg:"user verifed"})
        });
       
    }
   catch{
    res.status(500).send({msg:"verfication failed"}) 
   }  
})
//updating password
userRouter.post('/updatePassword',async (req,res)=>{
    try{
        const payload=req.body;
        console.log(payload)
        
        
            const decodedtoken=jwt.verify(payload.token,process.env.JWT_SECRET)
        
    
           const hashedPassword=await bcrypt.hash(payload.password,10)
           console.log(decodedtoken.email,hashedPassword,payload.password)
            await AppUserModel.updateOne({email:decodedtoken.email},{'$set':{password:hashedPassword,token:'',isVerified:false}});
            res.send({msg:"updated password"})
       
    
    }catch{
        res.status(500).send({msg:"passwords updation failed"})  
    }
})
export default userRouter      