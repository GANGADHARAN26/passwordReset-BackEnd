import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const username=process.env.DB_USERNAME || '';
const password=process.env.DB_PASSWORD || '';
const clusterName=process.env.DB_CLUSTER || '';
const dbname=process.env.DB_NAME || '';
const cloudDb=`mongodb+srv://${username}:${password}@${clusterName}/${dbname}?retryWrites=true&w=majority`
const localDB='mongodb://localhost:27017/password-reset';
const DbConnection=async()=>{
    try{
        await mongoose.connect(cloudDb,{useNewUrlParser:true});
        console.log("DB connection established")
    }catch(error)
    {
      console.log(error.message)
      process.exit(1)
    }
}
export default DbConnection; 