var express = require('express');
var router = express.Router();
let crypto = require('crypto');

let mysql = require('../models/mysql');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//执行注册
router.post('/signUp',function (req,res,next) {
  //创建md5加密的函数
  let md5 = crypto.createHash("md5");
  let ePassword = md5.update(req.body.password).digest("hex");
  //获取用户名 密码参数
  let params = {
    username:req.body.username,
    password:ePassword
  };
  //先查是否有该用户，若不存在才添加
  mysql.exe("jd","select username from users where username='"+params.username+"'").then((results)=>{
    if (results.length !== 0){
      //存在
      res.json({
        "status":'0'
      });
    }
    //不存在就加入数据库
    mysql.exe("jd","insert into users(username,password) values ('"+params.username+"','"+params.password+"')").then((results2)=>{
      //加入session
      req.session.login = "1";
      req.session.username = params.username;
      //加入cookie
      res.json({
        "status":'1',
        "results":{
          username:params.username
        }
      });
    }).catch((e)=>{
      console.log("注册添加users失败"+e);
    })
  }).catch((e)=>{
    console.log("注册查找users失败"+e);
  })
});

//执行登录
router.post('/login',function (req,res,next) {
  //创建md5加密的函数
  let md5 = crypto.createHash("md5");
  let ePassword = md5.update(req.body.loginPwd).digest("hex");
  //获取用户名 密码参数
  let params = {
    loginUser:req.body.loginUser,
    loginPwd:ePassword
  };
  //查找用户表
  mysql.exe("jd","select * from users where username='"+params.loginUser+"'").then((results)=>{
    // 如果没有该用户
    if (results.length===0) {
      res.json({
        "status":'-1'
      });
      return;
    }
    //如果存在，检测密码是否正确
    if (results[0].password === params.loginPwd) {
      //写入session,记录登录状态
      req.session.login = "1";
      req.session.username = params.loginUser;
      // 添加用户id
      req.session.userId = results[0].id;
      res.json({
        "status":'1',
        "results":{
          username:results[0].username,
          user_id:results[0].id
        }
      })
    }else{
      // 密码错误
      res.json({
        "status":'0'
      });
    }
  }).catch((e)=>{
    console.log("查找users失败"+e);
  })
});

//执行退出
router.get('/loginOut',function (req,res,next) {
  req.session.destroy(function (err) {
    if (err) {
      console.log("退出失败");
      return;
    }
    //清除登录cookie
    res.clearCookie("user_key");
    res.redirect("/goods");
  });
});

//检测登录
router.get('/checkLogin',function (req,res,next) {
  //如果处于登录状态
  if (req.session.login === "1"){
    res.json({
      "status":'1',
      "results":req.session.username
    });
  }else{
    res.json({
      "status":'0',
      "msg":"没登录",
      "results":""
    });
  }
});

module.exports = router;
