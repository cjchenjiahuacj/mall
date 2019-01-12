<template>
  <div>
    <div class="row">
      <p class="shopping-address">查看你的订单</p>
    </div>
    <!--展示-->
    <div class="row">
      <table class="table table-striped text-center table-hover">
        <thead class="thead-color">
        <tr>
          <td>项目</td>
          <td>价格</td>
          <td>数量</td>
          <td>总价</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in orderList">
          <td><img :src="'../../static/'+item.productImage" alt="加载出错" width="60"><span>{{item.productName}}</span></td>
          <td><span>￥{{item.sellPrice}}</span></td>
          <td class="amount">
            <span>{{item.amount}}</span>
          </td>
          <td><span class="text-danger">{{item.sellPrice*item.amount}}</span></td>
        </tr>
        </tbody>
      </table>
    </div>
    <!--总价展示-->
    <div class="row">
      <div class="col-sm-12">
        <span class="text-danger pull-right" style="font-size: 18px;font-weight: bold">￥{{totalPrice}}</span>
      </div>
    </div>
    <!-- 订单确认 -->
    <div class="row">
      <div class="col-sm-12">
        <button type="button" class="btn btn-default pull-right" @click="createOrder">订单确认</button>
      </div>
    </div>
  </div>
</template>

<script>
  import NavHeader from './../components/Header'
  import NavBread from './../components/Bread'
  import Modal from './../components/Modal'
  import axios from 'axios'

  export default {
    name: "Order",
    data() {
      return {
        orderList: [],
        totalPrice: 0// 总价
      }
    },
    components: {
      NavHeader,
      NavBread,
      Modal
    },
    mounted() {
      this.init();
    },
    methods: {
      // 数据初始化
      init() {
        axios.get("/orders").then((data) => {
          let res = data.data;
          if (res.status === "1") {
            // 查询成功
            this.orderList = res.result;
            // 遍历计算总价
            if (this.orderList){
              this.orderList.forEach((item)=>{
                this.totalPrice += item.sellPrice*item.amount;
              })
            }
          }
        });
      },
      // 创建订单
      createOrder() {
        axios.post('/orders/createOrder', {
          totalPrice:this.totalPrice,// 总价
        }).then((data) => {
          let res = data.data;
          if (res.status === '1') {
            console.log(res.result);
            // 跳到订单展示
            this.$router.push({
              path:'/showOrder'
            });
          }
        }).catch((e) => {
          console.log(e);
        })
      }
    }
  }
</script>

<style scoped>
  ul li {
    width: 33%;
  }

  .shopping-address {
    font-weight: bold;
    font-size: 18px;
  }

  h3 {
    font-size: 20px;
    font-weight: bold;
    width: 100px;
    line-height: 100px;
  }

  .thead-color {
    background-color: #ba2636;
    color: #fff;
    font-size: 16px;
  }

  table tbody td {
    height: 60px;
    line-height: 60px;
    color: #999;
  }

  table tbody td span, table tbody td span.glyphicon {
    display: inline-block;
    line-height: 60px;
  }

  table tbody td > button.btn {
    padding: 0 5px;
    font-size: 14px;
  }
</style>
