const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const helmet = require('helmet')
const morgan = require('morgan');
const userRouter = require("./routes/users")
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");
const cookieParser = require('cookie-parser')
//used for session cookie;
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");

const app = express()
const port = 3000

mongoose.connect('mongodb://localhost:27017/SocialMedia_api').then(()=>{
    console.log('Mongodb Connected');
})

//middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use(cookieParser())



app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/posts',postRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(session({
  name:"socialmedia",
  //TODO Change the secret before deployment in production mode
  secret:'somethingsomething',
  saveUninitialized:false,
  resave:false,
  cookie:{
    maxAge: (1000 * 60 *100)
  }
}))

app.use(passport.initialize());
app.use(passport.session());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})