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
router.get('/', function(req, res, next) {
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


module.exports = router;
