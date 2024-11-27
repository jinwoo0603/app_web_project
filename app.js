const express = require('express');
const app = express();
const port = 8000;
const router = express.Router();
const nunjucks = require('nunjucks');
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require('./config/db');
require('./config/passport-config')(passport);

//router
const loginRouter = require('./routes/login')
const indexRouter = require('./routes/index');
const noteRouter = require('./routes/note');
const adminRouter = require('./routes/admin');

//view engine과 public파일
app.set('view engine', 'html');
app.use(express.static('public'));
nunjucks.configure('./views', {
  express: app,
  watch: true,
});

//passport관련 middleware 설정
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//본체
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);
app.use('/note', noteRouter);
app.use((res, req, next) => {
  res.statusCode(404).send('Not Found')
})

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});