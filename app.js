const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');  
const path = require('path');
const studentRoutes = require('./routes/studentRoutes');
const viewsRoutes = require('./routes/viewsRoutes');

dotenv.config({path:'./config.env'});

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine","ejs");
app.set('views', path.join(__dirname, 'views'));

const DB_A = process.env.DATABASE_ATLAS.replace('<db_password>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB_A).then(con => {
    console.log('DB Connection Successful...')
}).catch(err => console.log('DB Connection Error:', err))

// -----------------------------------------------
app.use('/',viewsRoutes);
app.use('/api/v1/students',studentRoutes);
// -----------------------------------------------


const port = process.env.PORT || 3000;
const server = app.listen(port,() => {
    console.log(`server is runing on port: ${port}`);
});