import express from 'express';
import cors from 'cors';
import routes from './Router/routes.js';
import { configDotenv } from 'dotenv';

const app=express();
const port=process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use('/api',routes);

app.listen(port);