<template>
	<div>
		<!--头部-->
    <nav-header @listenToChild="getUserId"></nav-header>
    <!--面包屑-->
    <nav-bread>
      <span slot="bread">商品列表</span>
    </nav-bread>
    <!--内容-->
    <div id="content" class="container clearfix">
      <!--左边商品列表-->
      <div class="row">
        <div class="col-sm-7">
          <div class="list">
            <!--商品-->
            <div class="good" v-for="(item,index) in goodsList">
              <!--图片-->
              <div class="img">
                <img v-lazy="'./../../static/'+item.productImage">
              </div>
              <!--文字-->
              <p>{{item.productName}}</p>
              <p class="text">￥{{item.sellPrice}}</p>
              <!--加入购物车按钮-->
              <a href="javascript:void(0);" class="car" @click="addCart(item.id)">加入购物车</a>
            </div>
          </div>
        </div>
        <div class="col-sm-3 pull-right">
          <!--右边价格-->
          <div class="price">
            <!--标题-->
            <p>价格
              <span class="glyphicon glyphicon-arrow-up" aria-hidden="true" @click="getGoodsList(0,1)"></span>
              <span class="glyphicon glyphicon-arrow-down" aria-hidden="true" @click="getGoodsList(0,-1)"></span>
            </p>
            <a href="javascript:;" :class="{'cur':priceChecked==='all'}" @click="priceChecked='all';getGoodsList(0);getGoodsCount()">所有</a>
            <div v-for="(price,index) in priceFilter">
              <a href="javascript:;" :class="{'cur':priceChecked===index}" @click="setPriceFilter(index);getPriceFilter(price.startPrice,price.endPrice)">{{price.startPrice}}-{{price.endPrice}}</a>
            </div>
          </div>
        </div>
        </div>
      <div class="row text-center">
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li>
              <a href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li v-for="(item,index) in goodsCount"><a href="#" @click="getPage(index)">{{index+1}}</a></li>
            <li>
              <a href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
	</div>
</template>
<script>
  import NavHeader from './../components/Header'
  import NavBread from './../components/Bread'
  import axios from 'axios'


	export default {
    data(){
      return {
        goodsList: [],
        goodsCount:0,
        active:0,
        priceFilter: [
          {
            startPrice:0,
            endPrice:500
          },
          {
            startPrice:500,
            endPrice:1000
          },
          {
            startPrice:1000,
            endPrice:5000
          }
        ],
        priceChecked: "all",
        userId:0
      }
    },
    components: {
      NavHeader,NavBread
    },
    mounted() {
      this.getGoodsList(0);
      this.getGoodsCount()
    },
    methods: {
      getGoodsList(page,sort){
        let params = {};
        if (arguments.length === 1){
          params = {
            "page":page
          }
        } else if (arguments.length === 2){
          params = {
            "page":page,
            "sorts":sort
          }
        }
        axios.get("/goods/list",{
          params:params
        }).then((res) => {
          this.goodsList = res.data.result.list;
        })
      },
      setPriceFilter(index){
        this.priceChecked = index
      },
    //  获得商品的总数
      getGoodsCount(){
        axios.get("/goods/count").then((res)=>{
          this.goodsCount = Math.ceil(res.data.count/12);
        })
      },
    //  获取分页
      getPage(index){
        axios.get("/goods/list",{
          params:{
            "page":index
          }
        }).then((res) => {
          this.goodsList = res.data.result.list;
        });
      },
    //  价格筛选
      getPriceFilter(sPrice,ePrice){
        axios.get("/goods/list",{
          params:{
            "sPrice":sPrice,
            "ePrice":ePrice
          }
        }).then((res)=>{
          this.goodsList = res.data.result.list;
          this.goodsCount = Math.ceil(res.data.result.count/12);
        })
      },
    //  添加购物车
      addCart(id){
        axios.post('/goods/addCart',{
          product_id:id,
          user_id:this.userId
        }).then((data)=>{
          let res = data.data;
          if (res.msg === "没登录"){
            alert(res.msg);
          }
          if (res.status === "1"){
            alert(res.msg);
            // 修改购物车数量
            this.$store.commit("updateCartCount",1);
          }
          console.log(data);
        })
      },
      // 获取用户id
      getUserId(id){
        this.userId = id;
        console.log("获取用户id"+this.userId);
      }
    }
  }
</script>
<style>
  .glyphicon-arrow-up,.glyphicon-arrow-down{
    cursor: pointer;
  }
  /*分页*/
  .pagination>li>a,.pagination>li>a:hover,.pagination>li>a:focus{
    color: #ba2636;
  }
  .pagination>.active>a,.pagination>.active>a:focus,.pagination>.active>a:hover{
    background-color: #ba2636;border-color: #ba2636;
  }
</style>
