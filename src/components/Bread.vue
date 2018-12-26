<template>
    <div id="bread" class="container">
      <slot name="bread"></slot>
    </div>
</template>
<style scoped>
  #bread{
    height: 30px;margin-bottom: 10px;margin-top: 10px;
    background-color: #fff;
    box-sizing: border-box;
  }
  #bread span{
    height: 100%;line-height: 30px;
  }
</style>
