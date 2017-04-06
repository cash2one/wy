<template>
  <div id="app">
    <img src="/htdocs/page/assets/logo.png">
    <h1>{{ msg }}</h1>
    <mt-button @click.native="startHacking">Let's do it</mt-button>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: '欢迎使用 vue.js'
    }
  },
  methods: {
    startHacking () {
      this.$toast('可以使用了!')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
