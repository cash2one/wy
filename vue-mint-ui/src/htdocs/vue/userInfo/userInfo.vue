<template>
  <div class="component-userInfo">
    <img :src="icon" class="icon" alt="头像" />
    <div class="content">
      <h1 class="name">{{ name }}</h1>
      <div class="introduce">{{ introduce }}</div>
    </div>
  </div>
</template>

<script>
  module.exports = {
    props: {
      name: {
        default: '未知'
      },
      introduce: {
        default: '这个人很赖，什么都没有留下'
      },
      icon: {
        default: ResUrl + '/vue/userInfo/default.png'
      }
    },
    created: function() {
      console.log('header 组件被创建了');
    }
  };
</script>

<style lang="less">
  .component-userInfo {
    display: inline-block;
    border: 1px solid #ddd; margin: 10px; padding: 10px;
    box-shadow: 0 0 2px #ddd;
    transform: scale(1.1);
    .icon, .content { display: inline-block; vertical-align: bottom; }
    .icon { width: 120px; height: 120px; background: url(./back.png) no-repeat; }
    .name { font-size: 18px; }
    .introduce { font-size: 14px; font-weight: normal;}
  }
</style>
