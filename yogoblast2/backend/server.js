import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import User from './Routers/user.js'
 import pages from './Routers/pages.js';
 import  './controllers/dbConnect.js'
 import cors from 'cors';
 
const app = express();
const port = process.env.PORT ;
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/user',User);
app.use('/pages',pages);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});