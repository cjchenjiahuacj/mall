let express = require('express');
let router = express.Router();
let mysql = require('../models/mysql');

// 渲染地址列表的数据
router.get("/",function (req,res,next) {
  // 查询数据库
  mysql.exe('jd',"select * from address order by aid desc").then((results)=>{
    res.json({
      status:'1', // 1代表成功
      msg:"查询成功",
      result:results
    });
  }).catch((e)=>{
    console.log("查找初始数据失败"+e);
  });
});

// 为地址列表添加数据
router.post("/add",function (req,res,next) {
  // 获取用户数据
  let params = {
    username:req.session.username,
    street:req.body.street,
    tel:req.body.tel,
    isDefault:"0"
  };
  // 加入数据
  mysql.exe("jd","insert into address (username,street,tel,isDefault) values ('"+params.username+"','"+params.street+"','"+params.tel+"','"+params.isDefault+"')").then(()=>{
    console.log("插入成功");
    res.json({
      status:'1',
      msg:"插入成功"
    });
  }).catch((e)=>{
    console.log("插入数据失败"+e);
    res.send("0");
  });
});

//设置默认地址
router.post('/setDefault',function (req,res,next) {
  let params = {
    addressId:req.body.addressId,
    isDefault:req.body.isDefault,
  };
  // 查询数据
  mysql.exe("jd","select id from address").then((results)=>{
    for (let i=0;i<results.length;i++) {
      // 设置默认值
      if (params.addressId === results[i].id){
        params.isDefault = '1'
      } else{
        params.isDefault = '0'
      }
      // 更新数据库 异步的坑啊
      mysql.exe("jd","update address set isDefault="+params.isDefault+" where id="+results[i].id)
    }
    res.json({
      status:'1',
      msg:"更新成功"
    });
  }).catch((e)=>{
    console.log("查询默认失败" + e);
  });
});

// 删除订单的功能

module.exports = router;
