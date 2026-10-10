const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');   

dotenv.config({path:'./config.env'});

const app = express();
app.use(express.json());

const DB_A = process.env.DATABASE_ATLAS.replace('<db_password>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB_A).then(con => {
    console.log('DB Connection Successful...')
}).catch(err => console.log('DB Connection Error:', err))

app.get('/', (req,res)=>{
    res.send('server is runing...');
})

const port = process.env.PORT || 3000;

const server = app.listen(port,() => {
    console.log(`server is runing on port: ${port}`);
});