<template>
  <div class="component-header">
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        default: '默认头部 VUE'
      }
    },
    created() {
      console.log('header 组件被创建了');
    },
  }
</script>

<style>
  .component-header { padding: 10px 20px; background: #ddd; }
  .component-header h1 { color: #f3fefd; font-weight: normal; }
</style>
