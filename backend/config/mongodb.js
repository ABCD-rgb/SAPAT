import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const handleMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit if cannot connect to database
    }
};

export default handleMongoDB;