<template>
	<div>
    <nav-header></nav-header>
    <nav-bread>
      <span slot="bread">购物车列表</span>
    </nav-bread>
		<div class="container">
      <div class="row">
        <div class="col-lg-offset-1 col-sm-11 col-xs-offset-11 col-xs-11">
          <h3>我的购物车</h3>
        </div>
      </div>
      <!--展示购物车的信息-->
      <div class="row">
        <table class="table table-striped text-center table-hover">
          <thead class="thead-color">
            <tr>
              <td>项目</td><td>价格</td><td>数量</td><td>总价</td><td>编辑</td>
            </tr>
          </thead>
          <tbody>
            <tr :data-checked="item.checked" :class="{warning:item.checked==='1'}" @click="isChecked($event,item)" v-for="(item,index) in cartsList">
              <td><img :src="'../../static/'+item.productImage" alt="加载出错" width="60"><span>{{item.productName}}</span></td>
              <td><span>￥{{item.sellPrice}}</span></td>
              <td class="amount">
                <button type="button" class="btn btn-default" @click.stop="subtraction(item)">-</button>
                <span>{{item.amount}}</span>
                <button type="button" class="btn btn-default" @click.stop="add(item)">+</button>
              </td>
              <td><span class="text-danger">{{item.sellPrice*item.amount}}</span></td>
              <td><span class="glyphicon glyphicon-trash" style="cursor: pointer" @click.stop="show(item.id)"></span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--确定选择-->
      <div class="row">
        <div class="col-sm-8">
          <button type="button" class="btn btn-default btn-select" @click="select">全部选择/全部取消</button>
        </div>
        <div class="col-sm-2 col-xs-2">
          <p id="total-price" class="text-danger btn-select text-center" style="line-height: 50px;font-size: 20px;font-weight: bold">总价：￥{{totalPrice}}</p>
        </div>
        <div class="col-sm-2 col-xs-2">
          <button type="button" class="btn btn-determine" :class="{'btn-disable':checkCount===0}" @click="checkout">确定提交</button>
        </div>
      </div>
    </div>
    <!--删除模态框-->
    <modal :showModal="showModal" @close="hide">
      <span slot="title">是否删除{{cartListId}}</span>
      <div slot="message">
        <div class="row">
          <div class="col-sm-offset-2 col-sm-8">
            <button type="button" class="btn btn-danger" @click.stop="del(cartListId)">确认删除</button>
          </div>
        </div>
      </div>
    </modal>
	</div>
</template>
<script>
  import NavHeader from './../components/Header'
  import NavBread from './../components/Bread'
  import Modal from './../components/Modal'
  import axios from 'axios'
	export default {
	  data(){
	    return{
	      cartsList:[],
        showModal:false,// 控制的模态框的显示
        cartListId:0 // 存储购物车的id
      }
    },
    components:{
	    NavHeader,
      NavBread,
      Modal
    },
    mounted(){
	    this.init();
    },
    computed:{ // 计算属性 - 把它当作属性来使用 data
	    // 计算总价格
      totalPrice(){
        let totalPrice = 0;
        this.cartsList.forEach((item)=>{
          if (item.checked === "1"){
            totalPrice += item.sellPrice*item.amount;
          }
        });
        return totalPrice;
      },
      // 统计选择的总数
      checkCount(){
        let count = 0;
        this.cartsList.forEach((item)=>{
          if (item.checked === "1"){
            count++;
          }
        });
        return count;
      }
    },
		methods: {
	    //初始化购物车列表数据
      init(){
        axios.get("/carts").then((data)=>{
          let res = data.data;
          this.cartsList = res.results; // 获取相关数据
        }).catch(()=>{
          console.log("请求购物车列表数据失败");
        })
      },

	    // 判断是否选中
			isChecked(e,item){
			  let el = $(e.currentTarget);// 当前对象
        if (el.attr("data-checked") === "0"){
          //如果没有选中
          item.checked = '1';
          // 更新数据库
          axios.post('/carts/checked',{
            checked:item.checked,
            cartId:item.id
          })
        }else{
          //如果选中
          item.checked = '0';
          // 更新数据库
          axios.post('/carts/checked',{
            checked:item.checked,
            cartId:item.id
          })
        }
      },
      // 选择全部
      select(e){
			  let el = $(e.currentTarget);
			  let tr = $("table tbody tr");
			  // 如果没有选中的话
			  if (tr.attr("data-checked") === "0"){
          tr.addClass("warning");
          // 修改购物车的全部check
          this.cartsList.forEach((item)=>{
            item.checked = '1';
          });
          // 存在数据表中
          axios.post('/carts/checkedAll',{
            isCheckedAll:true
          })
        } else{
          tr.removeClass("warning");
          // 修改购物车的全部check
          this.cartsList.forEach((item)=>{
            item.checked = '0';
          });
          // 存在数据表中
          axios.post('/carts/checkedAll',{
            isCheckedAll:false
          })
        }
      },

      //模态框
      show(id){
        this.showModal = true;
        this.cartListId = id; // 保存该项的id
      },
      hide(){
        this.showModal = false;
      },

      // 增加商品的数量
      add(item){
        // 更新展示页
        item.amount++;
        // 更新vuex的购物车数量
        this.$store.commit("updateCartCount",1);
        // 更新数据库
        this.sendEdit({
          amount:item.amount,
          cartId:item.id
        });
      },
      // 减少商品的数量
      subtraction(item){
        if (item.amount <= 1){ // 不能小于0
          return;
        }
        item.amount--;
        // 更新vuex的购物车数量
        this.$store.commit("updateCartCount",-1);
        // 更新数据库
        this.sendEdit({
          amount:item.amount,
          cartId:item.id
        })
      },
      // 向更新购物车表发送请求
      sendEdit(json){
        axios.post("/carts/editAmount",json).then((data)=>{
          let res = data.data;
          if (res.status === "1") {
            console.log("success");
          }
        })
      },
      // 删除购物车列表的数据
      del(id){
        // 需要获取删除的购物车商品id
        axios.post("/carts/del",{
          cartId:id
        }).then((data)=>{
          let res = data.data;
          if (res.status === "1") {
            console.log("删除购物车id"+id);
            // 关闭模态框
            this.hide();
            // 删除成功后需要更新页面
            this.init();
            // 提交vuex
            this.$store.commit("updateCartCount",-1);
          }
        }).catch((e)=>{
          console.log("请求失败"+e);
        })
      },
      // 提交到购物车列表
      checkout(){
        if (this.checkCount >0){
          this.$router.push({
            path:"/address"
          });
        }
      }
		}
	}
</script>
<style>
  h3{
    font-size: 20px;font-weight: bold;
    width: 100px;line-height: 100px;
  }
  .thead-color{
    background-color: #ba2636;color: #fff;font-size: 16px;
  }
  table tbody td{
    height: 60px;line-height: 60px;
    color: #999;
  }
  table tbody td span,table tbody td span.glyphicon{
    display: inline-block;
    line-height: 60px;
  }
  table tbody td>button.btn{
    padding: 0 5px;font-size: 14px;
  }
  .btn-determine{
    width: 100%;height:50px;background-color: #ba2636;color: #fff;
  }
  .btn-determine:hover{
    color: #fff;
  }
  .btn-disable{
    background-color: #ccc;
  }
  .btn-select{
    height: 50px;
  }
</style>
