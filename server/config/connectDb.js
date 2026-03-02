import mongoose, { connect } from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(`Database connection error: ${error}`);
    }
}
export default connectDb;