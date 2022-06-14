// Server
let express = require('express');
let app = express();

// Mongoose connect
require("./mongoose/mongoose").connect();

// Cors
let cors = require('cors')
app.use(cors())

// Disk - file operations
let path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// File Loader
const multer  = require("multer");
app.use(multer({dest:"uploads"}).single("img"))

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());


// Cookie
let cookieParser = require('cookie-parser');
app.use(cookieParser());


// Logger
let logger = require('morgan');
app.use(logger('dev'));


let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let mediaHelper = require('./routes/helpers/media-converter')

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/helpers/converter', mediaHelper);



//JWT
let auth = require('./controllers/auth')
app.use(auth.middlewareAuth)
app.post ('/api/auth', auth.authByLogin)
app.post('/api/tryCreateUser', auth.tryCreateUser)

let prof = require('./controllers/profile')
app.post ('/api/tryUpdateUser', prof.updateUser)

let workwpost = require('./controllers/workwpost')
app.get('/api/getAllPosts', workwpost.getAllPosts)
app.post ('/api/getPostById', workwpost.getPostById)
app.post('/api/tryCreatePost', workwpost.tryCreatePost)
app.post('/api/tryUpdatePostById', workwpost.updatePostById)
app.post('api/tryDeletePostById', workwpost.deletePostById)



let confirm = require("./controllers/confirmation")

app.get('/user/verify/:id/:token', confirm.confirmEmail);

module.exports = app;

