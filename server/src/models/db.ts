import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const mongoUrl = process.env.MONGO_CONN;

if (!mongoUrl) {
    throw new Error("MONGO_CONN is not defined in the environment variables.");
}

const connect = () => mongoose.connect(mongoUrl)
.then(() => {
    console.log('MongoDB Connected...');
})
.catch((err) => {
    console.log('MongoDB Connection Error: ', err);
});

export default connect; 