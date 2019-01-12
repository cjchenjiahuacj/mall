let express = require('express');
let router = express.Router();
let mysql = require('../models/mysql');

router.get('/',function (req,res,next) {
  // 把选中的商品查询查询出来
  mysql.exe("jd","select cartlist.id,checked,amount,user_id,productName,productImage,sellPrice,aid from goods,cartlist,address where product_id=goods.id and cartlist.checked='1' and isDefault='1'").then((results)=>{
    res.json({
      status:'1',
      result:results
    });
  }).catch((e)=>{
    console.log("查找错误"+e);
  });
});

// 创建订单接口
router.post("/createOrder",function (req,res,next) {
  // 获取用户信息
  let params = {
    user_id:req.session.userId,// 用户id
    totalPrice:req.body.totalPrice,// 总价
  };
  // 当前用户的地址 购物车的购买商品加到表中
  mysql.exe("jd","insert into orders (totalPrice,datetime,user_id) values ("+params.totalPrice+",now(),"+params.user_id+")").then(()=>{
    // 插入后返回
    res.json({
      status:'1',
      msg:"插入成功"
    });
  });
});

// 生成确定订单
router.get("/showOrders",function (req,res,next) {
  // 查询数据库
  mysql.exe("jd","select * from orders order by datetime desc").then((results)=>{
    res.json({
      status:'1',
      msg:"查询成功",
      result:results[0]
    });
  }).catch((e)=>{
    console.log("查询错误"+e);
    res.json({
      status:'0',
      msg:"查询失败"
    });
  })
});

module.exports = router;
