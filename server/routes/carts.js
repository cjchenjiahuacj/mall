let express = require('express');
let router = express.Router();
let mysql = require('../models/mysql');

//需要登录才可以执行的路由
//获取购物车表的数据
router.get("/",function (req,res,next) {
  //获取用户id 根据用户id查找购物车列表
  mysql.exe("jd","select cartlist.id,checked,amount,user_id,productName,productImage,sellPrice from goods,cartlist where goods.id=product_id").then((result)=>{
    res.json({
      status:"1",
      msg:"",
      results:result
    });
  }).catch((e)=>{
    console.log("查找失败"+e);
    res.json({
      status:"0",
      msg:e.message,
      results:""
    });
  })
});

//删除其中的购物车列表的数据
router.post("/del",function (req,res,next) {
  //获取购物车id
  let cartlistId = req.body.cartId;
  console.log(cartlistId);
  res.json({
    status:"1",
    results:""
  });
});

//更新数据库购物车列表的数据
router.post("/editAmount",function (req,res,next) {
  // 接收相关的参数 列表id 商品数量
  let params = {
    amount:req.body.amount,
    cartId:req.body.cartId
  };
  // 更新数据库
  mysql.exe("jd","update cartlist set amount="+params.amount+" where id="+params.cartId).then((results)=>{
    res.json({
      status:"1",
      msg:"更新成功"
    });
  }).catch((e)=>{
    console.log("更新购物车数量失败"+e);
  })
});

//更新选中状态
router.post('/checked',function (req,res,next) {
  // 更新参数
  let checked = req.body.checked;
  let cartId = req.body.cartId;
  // 更新数据库
  mysql.exe("jd","update cartlist set checked="+checked+" where id="+cartId).then(()=>{
    res.json({
      status:"1",
      msg:"更新成功"
    });
  }).catch((e)=>{
    console.log("更新失败"+e);
    res.json({
      status:"0",
      msg:"更新失败"
    });
  })
});

// 更新全部选中状态
router.post("/checkedAll",function (req,res,next) {
  // 获取参数 是否全部选中
  let isCheckedAll = req.body.isCheckedAll?'1':'0';
  // 更新全部选中字段
  mysql.exe("jd","update cartlist set checked="+isCheckedAll).then(()=>{
    res.json({
      status:"1",
      msg:"更新成功"
    });
  }).catch((e)=>{
    console.log("更新全部选中字段失败"+e);
    res.json({
      status:"0",
      msg:"更新失败"
    });
  })
});

// 返回购物车中的数量
router.get('/getCartCount',function (req,res,next) {
  // 查询购物车列表的数据
  mysql.exe("jd","select amount from cartlist").then((results)=>{
    // 统计总数
    let sum = 0;
    for (let i=0;i<results.length;i++) {
      sum += results[i].amount;
    }
    res.json({
      status:"1",
      msg:"查找成功",
      result:sum
    });
  }).catch((e)=>{
    console.log("查找表失败"+e);
    res.json({
      status:"0",
      msg:"查找失败"
    });
  })
});

module.exports = router;
