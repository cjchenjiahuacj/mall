<template>
  <!--头部-->
  <div id="header">
    <div class="container clear">
      <h1>想买就买</h1>
      <div v-if="loginFlag">
        <a @click.prevent="loginOut">退出</a>
        <a>{{loginName}}</a>
      </div>
      <div v-else>
        <a @click.prevent="show();showSignUp()">注册</a>
        <a @click.prevent="show();showLogin()">登录</a>
      </div>
      <a @click.prevent="jumpCart">购物车</a>
      <span class="cart-link" v-if="cartCount>0">{{cartCount}}</span>
      <!-- 引入模态框 -->
      <modal v-if="modalFlag" :showModal="showModal" @close="hide">
        <!--注册-->
        <h4 slot="title" class="modal-title" >请注册</h4>
        <form slot="message" class="form-horizontal">
          <div class="form-group">
            <label for="username" class="col-sm-2 control-label">用户名</label>
            <div class="col-sm-10">
              <input v-model="username" type="text" class="form-control" id="username" placeholder="Username"
                     name="username">
            </div>
          </div>
          <div v-show="errorUTip" class="alert alert-danger" role="alert">存在该用户</div>
          <div class="form-group">
            <label for="password" class="col-sm-2 control-label">密码</label>
            <div class="col-sm-10">
              <input v-model="password" type="password" class="form-control" id="password" placeholder="Password"
                     name="password">
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
              <button type="button" class="btn btn-default pull-right" @click="signUp()">注册</button>
            </div>
          </div>
        </form>
      </modal>
      <modal v-else="modalFlag" :showModal="showModal" @close="hide">
        <!-- 登录 -->
        <h4 slot="title" class="modal-title">请登录</h4>
        <form slot="message" class="form-horizontal" >
          <div class="form-group">
            <label for="loginUser" class="col-sm-2 control-label">用户名</label>
            <div class="col-sm-10">
              <input v-model="loginUser" type="text" class="form-control" id="loginUser" placeholder="Username"
                     name="loginUser">
            </div>
          </div>
          <div v-show="errorUTip" class="alert alert-danger" role="alert">没用该用户</div>
          <div class="form-group">
            <label for="loginPwd" class="col-sm-2 control-label">密码</label>
            <div class="col-sm-10">
              <input v-model="loginPwd" type="password" class="form-control" id="loginPwd" placeholder="Password"
                     name="loginPwd" ><!--@keyup.enter="login"-->
            </div>
          </div>
          <div v-show="errorPTip" class="alert alert-danger" role="alert">密码错误</div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
              <button type="button" class="btn btn-default pull-right" @click="login">登录</button>
            </div>
          </div>
        </form>
      </modal>
    </div>
  </div>
  <!-- Button trigger modal -->
</template>
<script>
  import axios from 'axios'
  import Modal from './../components/Modal'

  export default {
    data() {
      return {
        modalFlag: true,// 模态框设置标志
        username: '',// 注册表单的用户名
        password: '',
        loginUser: '',// 登录表单的用户名
        loginPwd: '',
        errorUTip: false, // 显示用户名标识的正确性
        errorPTip: false, // 显示密码名称的正确性
        loginFlag: false, //登录标记
        userId:0, // 当前用户登录后的id
        showModal:false //框的显示
      }
    },
    computed:{
      // 刷新后用来保存的用户名
      loginName(){
        return this.$store.state.loginName;
      },
      // 购物车的数量
      cartCount(){
        return this.$store.state.cartCount;
      }
    },
    mounted() {
      this.checkLogin();
    },
    components: {
      Modal
    },
    props:["id"],
    methods: {
      //模态框
      show(){
        this.showModal = true;
      },
      hide(){
        this.showModal = false;
      },
      // 注册框
      showSignUp(){
        this.modalFlag = true;
      },
      // 登录框
      showLogin(){
        this.modalFlag = false;
      },

      //检查是否为登录状态
      checkLogin() {
        axios.get("/users/checkLogin").then((data) => {
          let res = data.data;
          if (res.status === '1') {
            // 刷新后依然保存登录名称
            this.$store.commit("updateUserInfo",res.results); // 提交到vuex
            // 获取购物车的数量
            this.getCartCount();
            this.loginFlag = true;
          }
        })
      },

      //注册
      signUp() {
        axios.post('/users/signUp', {
          username: this.username,
          password: this.password
        }).then((res) => {
          let data = res.data;
          if (data.status === '1') {
            console.log(data);
            this.errorUTip = false;
            // 消除模态框
            this.hide();
          } else if (data.status === "0") {
            console.log("已存在该用户");
            this.errorUTip = true;
          }
        })
      },

      //登录
      login() {
        axios.post('/users/login', {
          loginUser: this.loginUser,
          loginPwd: this.loginPwd
        }).then((res) => {
          let data = res.data;
          if (data.status === '1') {
            console.log(data);
            this.errorPTip = false;
            this.errorUTip = false;
            this.loginFlag = true; //修改登录标记
            // 保存登录名
            this.$store.commit("updateUserInfo",data.results.username); // 提交到vuex
            this.userId = data.results.user_id;
            // 传递用户id给父元素
            this.$emit("listenToChild",this.userId);
            // 获取购物车的数量
            this.getCartCount();
            //消除模态框
            this.hide();
          } else if (data.status === "0") {
            console.log("密码错误");
            this.errorPTip = true;
          } else if (data.status === "-1") {
            console.log("没有该用户");
            this.errorUTip = true;
          }
        })
      },
      //  退出
      loginOut() {
        axios.get("/users/loginOut").then(()=>{
          this.loginFlag = false; // 更改登录标志
          this.$store.commit("updateUserInfo",""); // 清除vuex
        })
      },
      // 获取购物车的数量
      getCartCount(){
        axios.get('/carts/getCartCount').then((data)=>{
          let res = data.data;
          if (res.status === '1'){
            // 提交vuex
            this.$store.commit("initCartCount",res.result);
          }
        })
      },
      // 跳转购物车
      jumpCart(){
        // 需要是登录状态
        if (this.loginFlag) {
          this.$router.push({
            path:"/cart"
          });
        }else {
          alert("没登录");
        }
      }
    }
  }
</script>
<style scoped>
  h1{
    color: #fff;
    font-size: 20px;
  }
  #header {
    width: 100%;
    height: 40px;
    background-color: #ba2636;
  }

  #header h1 {
    float: left;
    width: 100px;
    line-height: 40px;
  }

  #header a{
    float: right;
    display: block;width: 50px;height: 100%;
    line-height: 40px;text-align: center;font-size: 14px;color: #fff;
    cursor: pointer;
  }
  /*购物车数量图标*/
  .cart-link{
    position: absolute;top: 0;right: 200px;
    display: inline-block;width: 15px;height:15px;
    border-radius: 50%;background-color: #ccc;text-align: center;color: #999;
  }
</style>
