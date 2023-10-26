const express=require("express");
const cors=require("cors");
const { connection } = require("./configs/connection");
require("dotenv").config();

const {userRouter}=require("./routes/user.route")
const {dashboardRouter}=require("./routes/dashboard.route")

const app=express();
app.use(cors());
app.use(express.json())

app.get("/",(req,res)=>{
    res.json("Backend Server is running 👍")
})

app.use("/user",userRouter)
app.use("/dashboard",dashboardRouter)


app.listen(process.env.PORT,async()=>{
    try {
        await connection
            .then(()=>{
                console.log("Connected to MongoDB Atlas")
                console.log(`Server is running at port ${process.env.PORT}`)
            })
            .catch((err)=>{
                throw err
            })
    } catch (error) {
        console.log(error)
    }
})