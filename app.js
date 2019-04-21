var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var manageRouter = require('./routes/manage');
var orderRouter = require('./routes/order');
var petMasterRouter = require('./routes/petMaster');
var productRouter = require('./routes/product');
var serviceRouter = require('./routes/service');
var shopApplyRouter = require('./routes/shopApply');
var shopManageRouter = require('./routes/shopManage');
var shopSysRouter = require('./routes/shopSys');
var supplierRouter = require('./routes/supplier');
var userSysRouter = require('./routes/userSys');

var app = express();
// view engine setup
//配置session
app.use(session({
    secret: "lovo",
    resave: true, //强制保存session对象
    saveUninitialized: true,
    cookie: {
        maxAge: 5000000
    },
    rolling: true,
    saveUninitialized: false //将未初始化的对象保存
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//用户登录路由
app.use('/login', loginRouter);
//用户注册路由
app.use('/register', registerRouter);
//用户管理
app.use('/userSys', userSysRouter);
//系统管理路由
app.use('/manage', manageRouter);
//订单管理路由
app.use('/order', orderRouter);
//宠物主管理路由
app.use('/petMaster', petMasterRouter);
//商品管理路由
app.use('/product', productRouter);
//服务管理路由
app.use('/service', serviceRouter);
//门店申请路由
app.use('/shopApply', shopApplyRouter);
//店家管理
app.use('/shopManage', shopManageRouter);
//门店管理管理
app.use('/shopSys', shopSysRouter);
//供应商管理
app.use('/supplier', supplierRouter);
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

// module.exports = app;
// app.listen(3000, function() {
//     console.log('服务器已启动...')
// })
module.exports = app;
