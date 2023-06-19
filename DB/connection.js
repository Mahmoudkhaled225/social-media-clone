import mongoose from "mongoose";
import { config } from "dotenv";
config({ path: "./config/dot.env" });


const connectionDB= async ()=>{
    return await mongoose
        .connect(process.env.DB_LOCAL, )
        .then(()=>console.log("DB connected"))
        .catch((err)=>console.log(err));
};

mongoose.set("strictQuery",true);
export default connectionDB;