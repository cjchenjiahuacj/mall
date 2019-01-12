let express = require('express');
let router = express.Router();
let mysql = require('../models/mysql.js');

//给数组的原型添加判断值的函数
Array.prototype.inArray = function (el){
  for (let i=0;i<this[0].length;i++){
    if (this[0][i] === el){
      return true;
    }
  }
  return false;
};

/* GET users listing. */
router.get('/list', function(req, res, next) {
  //获取传递参数
  let sort = req.query.sorts;
  let page = req.query.page;
  let offset = 12*parseInt(page);

  //价格过滤
  let sPrice = parseInt(req.query.sPrice);
  let ePrice = parseInt(req.query.ePrice);
  let sql;

  //根据不同的url参数有不同的sql语句
  if (Object.keys(req.query).length === 1){
    sql = 'select * from goods limit '+offset+",12";
  }else if (Object.keys(req.query).length === 2){
    if (Object.keys(req.query).inArray("sorts")){
      if (sort === '1'){
        sql = 'select * from goods order by sellPrice asc,id limit '+offset+",12";
      }else if (sort === '-1'){
        sql = 'select * from goods order by sellPrice desc,id limit '+offset+",12";
      }
    }else{
      sql = "select * from goods where sellPrice between "+sPrice+" and "+ePrice;
    }
  }
  mysql.find("jd",sql,function (results,fields) {
    res.json({
      "status":"0",
      "msg":"",
      "result":{
        "count":results.length,
        "list":results
      }
    });
  });
});

//为分页按钮获得总数
router.get('/count',function (req,res,next) {
  mysql.find("jd","select * from goods",function (results) {
    res.json({
      "count":results.length
    })
  })
});

//把商品提交到购物车列表
router.post('/addCart',function (req,res,next) {
  //获取用户的id 信息
  let user_id = req.session.userId;
  //获取购物车信息 id
  let product_id = req.body.product_id;
  console.log(req.body);
  //根据用户信息把商品,该用户加入购物车表
  //如果该购物车列表存在该商品，直接给存在该购物车列表的商品数目增加
  //先查用户表，根据用户id获取数据，再判断获取的数据是否存在，根据商品id查找商品表，
  mysql.exe("jd","select * from cartlist").then((results1)=>{
      console.log(results1);
      // 如果购物车列表为空
      if (results1.length === 0) {
        //添加数据
        mysql.exe("jd","INSERT INTO cartlist (product_id,user_id,checked,amount) VALUES ("+product_id+","+user_id+",'0',1)").then(()=>{
          res.json({
            "status":'1',
            "msg":"添加cartlist成功"
          })
        }).catch((e)=>{
          res.json({
            "status":'0',
            "msg":e.message
          })
        })
      }
      for (let i=0;i<results1.length;i++){
        if (results1[i].product_id === product_id) {
          //更新数据就行
          let amount = results1[i].amount+1;
          mysql.exe("jd","update cartlist set amount="+amount+" where product_id="+product_id).then(()=>{
            res.json({
              "status":'1',
              "msg":"更新cartlist成功"
            })
          }).catch((e)=>{
            res.json({
              "status":'0',
              "msg":e.message
            })
          });
          return;
        }
      }
      //添加数据
      mysql.exe("jd","INSERT INTO cartlist (product_id,user_id,checked,amount) VALUES ("+product_id+","+user_id+",'0',1)").then(()=>{
        res.json({
          "status":'1',
          "msg":"添加cartlist成功"
        })
      }).catch((e)=>{
        res.json({
          "status":'0',
          "msg":e.message
        })
      });
    }).catch((e)=>{
      console.log("查找失败"+e);
    })
});


module.exports = router;
