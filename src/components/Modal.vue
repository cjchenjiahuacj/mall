<template>
  <div>
    <!--模态框-->
    <div id="modal-overlay" v-show="showModal">
      <div class="modal-data">
        <!--注册/登录-->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" @click.stop="hide"><span>&times;</span></button>
            <!--<h4 class="modal-title">请注册</h4>-->
            <slot name="title"></slot>
          </div>
          <div class="modal-body">
            <slot name="message"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Modal",
      data(){
        return{
          // showModal:false
        }
      },
      props:["showModal"],
      methods:{
        hide(){
          this.$emit('close');
        }
      }
    }
</script>

<style scoped>
  #modal-overlay {
    position: fixed; /* 使用绝对定位或固定定位  */
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.5);
  }

  /* 模态框样式 */
  .modal-data {
    width: 500px;
    margin: 100px auto;
    padding: 15px;
    text-align: center;
  }
</style>
