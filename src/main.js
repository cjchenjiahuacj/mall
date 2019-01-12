// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyload from  'vue-lazyload'
import $ from 'jquery' ;

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(VueLazyload,{
  loading: './../static/loading-bubbles.svg'
});

// 状态管理
const store = new Vuex.Store({
  state:{
    loginName:'',// 用户名
    cartCount:0// 购物车数量
  },
  mutations:{ // 改变状态
    updateUserInfo(state,name){
      state.loginName = name;
    },
    updateCartCount(state,cartCount){ // 购物车的数量
      state.cartCount += cartCount;
    },
    initCartCount(state,cartCount){ // 需要初始化购物车数量
      state.cartCount = cartCount;
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store, // 状态管理
  router,
  components: { App },
  template: '<App/>'
});
