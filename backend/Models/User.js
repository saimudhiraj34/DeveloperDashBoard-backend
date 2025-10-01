import mongoose from "mongoose";
const UserSchema=new mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    phone:{type:String,required:true},
    linkedin:{type:String},
    github:{type:String}
})

const Users=mongoose.model("Users",UserSchema);
export default Users;