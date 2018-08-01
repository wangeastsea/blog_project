var express = require('express')
var router = express.Router()
var User = require('../models/user')

// 统一返回的格式
var responseData
router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ''
  }
  next()
})

// 注册
router.post('/user/register', function (req, res, next) {
  var username = req.body.username
  var password = req.body.password
  var repassword = req.body.repassword
  if (username === '') {
    responseData.code = 1
    responseData.message = '用户名不能为空'
    res.json(responseData)
    return;
  }
  if (password === '') {
    responseData.code = 2
    responseData.message = "密码不能为空"
    res.json(responseData)
    return
  }
  if (repassword !== password) {
    responseData.code = 3
    responseData.message = '两次输入的密码不一致'
    res.json(responseData)
    return
  }
  // 如果数据库中已经存在和我们要注册的用户名同名的数据，表示该用户名已经注册
  User.findOne({
    username: username
  }).then(function (userInfo) {
    if (userInfo) {
      responseData.code = 4
      responseData.message = '用户名已经被注册'
      res.json(responseData)
      return
    }
    // 保存用户注册的信息到数据库中
    var user = new User({
      username: username,
      password: password
    })
    return user.save()  // 返回插入的新纪录
  }).then(function (newUserInfo) {
    responseData.message = '注册成功'
    res.json(responseData)
  })
})
// 登录
router.post('/user/login', function (req, res, next) {
  var username = req.body.username
  var password = req.body.password
  if ( username === '' || password === '') {
    responseData.code = 1
    responseData.message = '用户名和密码不能为空'
    res.json(responseData)
    return
  } 
  // 查询数据库中同用户名和密码的记录是否存在，如果存在，就登录成功
  User.findOne({
    username: username,
    password: password
  }).then(function (userInfo) {
    if (!userInfo) {
      responseData.code = 2
      responseData.message = '当前用户或密码错误'
      res.json(responseData)
      return 
    } 
    // 用户名或密码正确
    responseData.message = '登录成功'
    responseData.userInfo = {
      _id : userInfo._id,
      username : userInfo.username
    }
    // 设置浏览器端的cookie，下次刷新浏览器时，浏览器会把cookie添加到头信息发送到服务器
    req.cookies.set('userInfo', JSON.stringify({
      _id: userInfo._id,
      username: userInfo.username
    }))
    res.json(responseData)
    return
  })
})
// 退出
router.get('/user/logout', function (req, res) {
  req.cookies.set('userInfo', null)
  res.json(responseData)
})
module.exports = router