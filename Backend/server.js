import express from 'express';
import cors from 'cors';
import routes from './Router/routes.js';
import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';
configDotenv();
const app=express();
const port=process.env.PORT || 4000;
app.use(cors({
  origin: "*", // Testing ke liye sab allow kar do
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use('/api',routes);
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.689oscc.mongodb.net/Hotel?retryWrites=true&w=majority`)
  .then(() => console.log("Connected to Hotel Database"))
  .catch(err => console.log(err));
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});