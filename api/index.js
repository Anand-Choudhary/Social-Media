const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const helmet = require('helmet')
const morgan = require('morgan');
const userRouter = require("./routes/users")
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");


const app = express()
const port = 3000

mongoose.connect('mongodb://localhost:27017/SocialMedia_api').then(()=>{
    console.log('Mongodb Connected');
})

//middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use('/api/users',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/posts',postRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})