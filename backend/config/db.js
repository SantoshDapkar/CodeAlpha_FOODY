import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect(
      "mongodb+srv://santosh:radheradhe@cluster0.5kbjysf.mongodb.net/food-del"
    ).then(() =>
      console.log("DB connected"));
  
}