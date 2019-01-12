<template>
    <div>
      <div class="container">
        <div class="row text-center content">
          <p>恭喜你</p>
          <p>订单创建成功</p>
        </div>
        <div class="row text-center mt">
          <span class="text-info">创建日期{{showOrder.datetime}}</span>
          <span class="text-info">总价{{showOrder.totalPrice}}</span>
        </div>
        <div class="row text-center mt">
          <button class="btn btn-default" @click="jumpCart">购物车</button>
          <button class="btn btn-danger" @click="jumpGoods">商品列表</button>
        </div>
      </div>
    </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "showOrder",
    data(){
      return{
        showOrder:[]
      }
    },
    mounted(){
      this.init();
    },
    methods:{
      // 初始化数据
      init(){
        axios.get('/orders/showOrders').then((data)=>{
          let res = data.data;
          if (res.status === "1") {
            this.showOrder = res.result;
            console.log(this.showOrder);
          }
        })
      },
      // 跳转到购物车
      jumpCart(){
        this.$router.push({
          path:'/cart'
        });
      },
      // 商品列表
      jumpGoods(){
        this.$router.push({
          path:'/'
        });
      }
    }
  }
</script>

<style scoped>
  .mt{
    margin-top: 20px;
  }
  div.content p:nth-of-type(1){
    font-size: 18px;font-weight: bold;
  }
  div.content p:nth-of-type(2){
    font-size: 20px;font-weight: bold;
  }
</style>
