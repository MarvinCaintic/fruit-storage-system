import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/fruit_storage_db");
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1); // Exit the process on failure
    }
};

export default connectDB;
