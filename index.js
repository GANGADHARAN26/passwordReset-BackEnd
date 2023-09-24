import cors from 'cors';
import DbConnection from "./db-utils/mongoose-connection.js";
import userRouter from "./routes/user.js";
import express from 'express';
const PORT=process.env.PORT||5050;
const app=express();
await DbConnection();
app.use(cors());
app.use(express.json());

app.use('/user',userRouter)
app.listen(PORT,()=>{console.log(`listening on port ${PORT}`);});
