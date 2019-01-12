var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
let session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let goodsRouter = require('./routes/goods'); //引入商品路由
let cartsRouter = require('./routes/carts'); //引入购物车列表的路由
let addressRouter = require('./routes/address');// 引入地址列表的路由
let orderRouter = require('./routes/orders');// 引入订单列表的路由

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//使用session中间件
app.use(session({
  name: "user_key",
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname, 'public')));

// 登录拦截
app.use(function (req,res,next) {
  if (req.session.login === "1"){
    next();
  }else{
    if (req.path === '/users/login' || req.path ==="/users/logOut" ||req.path==='/goods/list' ||req.path==='/goods/count'){
      next();
    }else{
      res.json({
        "status":'0',
        "msg":"没登录",
        "results":""
      });
    }
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter); // 使用商品路由
app.use('/carts', cartsRouter); // 使用购物车路由
app.use('/addresses',addressRouter);// 使用地址列表的路由
app.use('/orders',orderRouter);// 订单路由

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
