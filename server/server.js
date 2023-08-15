const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 8080;

const config = require("./config/key");

app.use(cors());
app.use(express.json());


const uri = process.env.ATLAS_URI;

const articlesRouter = require('./routes/articles')
app.use('/articles', articlesRouter)


  mongoose.connect(uri, {
       useNewUrlParser: true, useUnifiedTopology: true,
      useCreateIndex: true, useFindAndModify: false
 }) 
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));
  

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {

    // Set static folder   
    // All the javascript and css files will be read and served from this folder
    app.use(express.static("client/build"));
  
    // index.html for all page routes    html or routing and naviagtion
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
    });
  }




const connection=mongoose.connection;
connection.once('open', () => 
    console.log("MongoDB is now connected!")
)

app.listen(port, () => console.log(`The App is running on Port: ${port}`))