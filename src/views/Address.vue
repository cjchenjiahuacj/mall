<template>
    <div>
        <div class="row">
          <p class="shopping-address">购物地址</p>
        </div>
        <!-- 添加购物地址 -->
        <div class="row mt">
          <div class="col-sm-3 col-xs-3 limit-height" v-for="(item,index) in addressListFilter">
            <div class="bs bgc" style="position: relative" :class="{'choose':chooseIndex === index}" @click="chooseIndex = index">
              <dl>
                <dt>{{item.username}}</dt>
                <dd>{{item.street}}</dd>
                <dd>{{item.tel}}</dd>
                <dd class="text-danger" style="cursor: pointer;" v-if="item.isDefault === '0'&&chooseIndex === index" @click="setDefault(item)">设置是否为默认地址</dd>
                <dd class="text-danger" style="cursor: pointer;" v-else-if="item.isDefault === '1'&&chooseIndex === index" @click="setDefault(item)">默认</dd>
              </dl>
              <!--删除-->
              <span class="glyphicon glyphicon-trash"></span>
            </div>
          </div>
          <div class="col-sm-3 col-xs-3 limit-height">
            <div class="text-center bs bgc">
              <span class="glyphicon glyphicon-plus" @click="show"></span>
            </div>
          </div>
        </div>
        <!-- 显示更多 -->
        <div class="text-center" style="cursor: pointer" @click="expand" v-if="limit===1">
          <span>显示更多</span><span class="glyphicon glyphicon-chevron-down"></span>
        </div>
        <div class="text-center" style="cursor: pointer" @click="expand" v-else>
          <span>隐藏部分</span><span class="glyphicon glyphicon-chevron-up"></span>
        </div>
        <!-- 模态框 -->
        <modal :showModal="showModal" @close="hide">
          <span slot="title">添加地址</span>
          <div slot="message">
            <form class="form-horizontal">
              <div class="form-group">
                <label for="street" class="col-sm-1 control-label">地址</label>
                <div class="col-sm-11">
                  <textarea class="form-control" rows="2" id="street" v-model="street"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label for="tel" class="col-sm-1 control-label">电话</label>
                <div class="col-sm-11">
                  <input type="text" class="form-control" id="tel" placeholder="电话" v-model="tel">
                </div>
              </div>
              <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                  <button type="button" class="btn btn-danger pull-right" @click="add">增加</button>
                </div>
              </div>
            </form>
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
    name: "Address",
    data(){
      return{
        limit:1,// 默认显示2条地址
        addressList:[],
        // 使用双向数据绑定
        street:"",
        tel:"",
        // 控制模态框
        showModal:false,
        chooseIndex:0
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
    computed:{
      addressListFilter(){
        if (this.addressList){
          return this.addressList.slice(0,this.limit);
        }
      }
    },
    methods:{
      // 初始化数据
      init(){
        axios.get('/addresses').then((data)=>{
          let res = data.data;
          this.addressList = res.result;
          console.log(this.addressList);
        }).catch((e)=>{
          console.log("查询数据失败"+e);
        })
      },

      // 显示更多数据
      expand(){
        if (this.limit === 1){
          this.limit = this.addressList.length;
        } else {
          this.limit = 1;
        }
      },

      //设置默认地址
      setDefault(item){
        axios.post('/addresses/setDefault',{
          addressId:item.id,
          isDefault:item.isDefault
        }).then((data)=>{
          let res = data.data;
          if (res.status === '1') {
            this.init();
          }
        }).catch((e)=>{
          console.log("请求默认值更新失败"+e);
        })
      },

      // 添加数据
      add(){
        axios.post('/addresses/add',{
          street:this.street,
          tel:this.tel
        }).then((data)=>{
          let res = data.data;
          if (res.status === '1'){
            // 关闭模态框
            this.hide();
            alert(res.msg);
            this.$router.push({
              path:'/address'
            });
          }
        });
      },

      //模态框
      show(){
        this.showModal = true;
      },
      hide(){
        this.showModal = false;
      }
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
