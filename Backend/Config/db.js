

const mongoose=require('mongoose')


const connectDb=async()=>{

try {
   const conn=await mongoose.connect(process.env.MONGO_DB_URI).then(()=>console.log("Connected  to MongoDb databse"))
} catch (error) {
    console.log(`Error in Databse Connection ${error}`)
}

}

module.exports=connectDb