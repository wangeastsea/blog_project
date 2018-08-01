// 应用程序的启动入口文件
var express = require('express')
// 加载模版处理模块
var swig = new require('swig')
// 加载数据库模块
var mongoose = require('mongoose')
// 加载body-parser,用来处理post提交过来的数据
var bodyParser = require('body-parser')
// 加载cookie模块
var Cookies = require('cookies')
// 创建app应用，服务端的对象
var app = express()
var User = require('./models/user')
// 静态文件托管
//当用户访问的url以/public开始，那么直接返回对应的__dirname + '/public'下的文件
app.use('/public', express.static(__dirname + '/public'))
app.engine('html', swig.renderFile)
// 设置模版文件存放目录，第一个参数必须是views，第二个参数是目录
app.set('views', './views')
// 注册所使用的模版引擎
app.set('view engine', 'html')
// 开发过程中，取消模版缓存，不用再重新执行node app.js
swig.setDefaults({
  cache: false
})

// bodyparser设置
app.use(bodyParser.urlencoded({
  extended: true
}))
// cookie 设置
app.use(function (req, res, next) {
  req.cookies = new Cookies(req, res)
  req.userInfo = {}
  if (req.cookies.get('userInfo')) {
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'))
      // 获取当前用户的类型判断是否是管理员
      User.findById(req.userInfo._id).then(function (userInfo) {
        console.log('1', userInfo)
        req.userInfo.isAdmin = Boolean(userInfo.isAdmin)
        next()
      })
    } catch (e) {
      next()
    }
  } else {
    next()
  }
})
// 根据不同的功能划分模块
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))
// 连接数据库
mongoose.connect('mongodb://localhost:27017/blog_project', function (err) {
  if (err) {
    console.log('数据库连接失败')
  } else {
    console.log('数据库连接成功')
    app.listen(8081)
  }
})