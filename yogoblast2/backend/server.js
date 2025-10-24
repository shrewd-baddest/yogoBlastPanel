import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
import express from 'express';
import User from './Routers/user.js'
 import pages from './Routers/pages.js';
 import  './controllers/dbConnect.js'
 import cors from 'cors';
 
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/user',User);
app.use('/pages',pages);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath=path.join(__dirname,'../YoGo-Blast/form/dist')
app.use(express.static(frontendPath));

app.get('*',(req,res)=>{
  res.sendFile(path.join(frontendPath,'index.html'));
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});