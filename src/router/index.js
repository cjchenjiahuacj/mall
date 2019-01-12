import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from './../views/GoodsList'
import Cart from './../views/Cart'
import Address from './../views/Address'
import Order from './../views/Order'
import Information from './../views/Information'
import ShowOrder from './../views/showOrder'
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
    	path: '/cart',
    	name: 'cart',
    	component: Cart
    },
    {
      path: '/information',
      name: 'Information',
      component: Information,
      children:[
        {
          path: '/address',
          name: 'Address',
          component: Address
        },
        {
          path: '/order',
          name: 'Order',
          component: Order
        },
        {
          path: '/showOrder',
          name: 'ShowOrder',
          component: ShowOrder
        },
      ]
    },
  ]
})
