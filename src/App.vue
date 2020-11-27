<template>
  <div class="container">
    <div class="head">
      <span class="header">Pechatay</span>
      <router-link to="/">Continue typing () </router-link> |
      <router-link to="/">Book select</router-link> |
      <router-link to="/">Fight online</router-link>
      
    </div>
    <router-view :key="$route.path"/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

.header {
  font-size: 30px;
  margin-right: 30px;
}

.head {
  font-size: 20px;
  margin-bottom: 30px;
}

.head a {
  text-decoration: none;
  color: black;
}

.container {
  max-width: 600px;
  margin: 0 auto;
}

</style>