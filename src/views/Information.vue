<template>
    <div>
      <nav-header></nav-header>
      <nav-bread ><span slot="bread">地址列表</span></nav-bread>
      <div class="container">
        <div class="row">
          <ul class="nav nav-tabs">
            <li><router-link to="/address">确认地址</router-link></li>
            <li><router-link to="/order">查看你的订单</router-link></li>
            <li><router-link to="">确认订单</router-link></li>
          </ul>
        </div>
        <hr>
        <router-view></router-view>
      </div>
    </div>
</template>

<script>
  import NavHeader from './../components/Header'
  import NavBread from './../components/Bread'
  import Modal from './../components/Modal'
  import axios from 'axios'
  export default {
    name: "Information",
    components:{
      NavBread,
      NavHeader,
      Modal
    }
  }
</script>

<style scoped>
  ul li{
    width: 25%;
  }
  .mt{
    margin-top: 10px;
  }
  .shopping-address{
    font-weight: bold;font-size: 18px;
  }
  .limit-height{
    height: 170px;
  }
  /*内容背景*/
  .bs{
    box-shadow: 0 0 5px #ccc;
  }
  .bgc{
    background-color: #fff;width: 100%;height: 100%;
  }
  [class*="col-"]{
    padding: 5px;
  }
  /*内容区域*/
  span.glyphicon-plus{
    line-height: 160px;cursor: pointer;
  }
  dl{
    padding: 15px;
  }
  dl dd{
    margin-top: 5px;
  }
  dl dd:nth-of-type(2){
    margin-top: 20px;
  }
  dl dd:nth-of-type(3){
    margin-top: 10px;
  }
  span.glyphicon-trash{
    position: absolute;top: 15px;right: 15px;cursor: pointer;
  }
  /*地址选中后的样式*/
  .choose{
    border: 1px solid #ba2636;
  }
</style>
