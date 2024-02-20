
const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = require('./config');
const app=express()
require('dotenv').config();
const mongoose=require('mongoose')
const courseRoutes = require('./Routes/CourseRoutes');
const userRoutes = require('./Routes/UserRoutes');
const categoryRoutes=require('./Routes/CategoryRoutes')
const authMiddleware=require('./Middlewares/authMiddleware')
const dbConnect=require('./Config/db')
const port=process.env.port || "mongodb://localhost:27017"

// process.env.MONGODB_URI || "mongodb://localhost:27017"
// "mongodb://0.0.0.0:27017"


app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())


dbConnect()


app.get('/',(req,res)=>{
    res.send("Hi I am working properly")
})


// app.use(authMiddleware);
app.use('/api/user', userRoutes);
app.use('/api/category',categoryRoutes)
app.use('/api/course',courseRoutes)


app.listen(5000,()=>{
   console.log("app is running on port 5000")
})
