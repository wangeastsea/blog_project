var express = require('express')
var router = express.Router()
router.get('/', function (req, res, next) {
  console.log( '2' ,req.userInfo)
  // 第二个参数是给模版传递数据
  res.render('main/index', {
    userInfo: req.userInfo
  })
})
module.exports = router