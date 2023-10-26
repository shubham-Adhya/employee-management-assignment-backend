const express = require("express");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const {UserModel}=require("../models/user.model")
const userRouter=express.Router()


userRouter.post('/signup',async(req,res)=>{
    try {
        const {email,password}=req.body;
        const userExists = await UserModel.findOne({email})
        if(userExists){
            return res.status(202).json("User Already exists, Please Login")
        }
        const hashedPass=bcrypt.hashSync(password, +process.env.salt)
        const user=new UserModel({email,password:hashedPass})
        user.save()
        return res.status(201).json({message: "User Created Successfully"})
    } catch (error) {
        console.log(error)
    }
})
userRouter.post('/login',async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user = await UserModel.findOne({email})
        
        if(!user){
            return res.status(401).json({message: "User not found"})
        }
        const passcompare=await bcrypt.compare(password, user.password)
        if(!passcompare){
            return res.status(401).json({ message:"Invalid Credentials !"})
        }
        jwt.sign({ userId:user._id ,email, password }, process.env.JWT_Secret,(err,token)=>{
            if(err) throw err

            return res.status(200).json({message: "Login Successful", token ,id: user._id,email})
        })
    } catch (error) {
        console.log(error)
    }
})


module.exports={userRouter}