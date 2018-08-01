var express = require('express')
var router = express.Router()
router.use(function (req, res, next) {
  if (!req.userInfo.isAdmin) {
    res.send('只有管理员才能进入改页面')
    return
  } 
  next()
})
router.get('/', function (req, res, next) {
  res.send('后台管理首页')
})
module.exports = router