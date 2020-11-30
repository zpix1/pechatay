<template>
  <div class="container">
    <div v-if="!$store.state.loading">
      <div class="head">
        <span class="header">Pechatay</span>
        <router-link to="/">Book select</router-link> |
        <router-link to="/fight">Fight online</router-link>
      </div>
      <router-view :key="$route.path"/>
    </div>
    <div v-else>
      Loading database...
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  beforeCreate() {
    this.$store.commit('init');
  }
};
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

.head a.router-link-active {
  text-decoration: underline;
}

.container {
  max-width: 600px;
  margin: 0 auto;
}

a {
  text-decoration: none;
  color: black;
}
</style>