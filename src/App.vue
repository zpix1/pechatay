<template>
  <div class="container">
    <h1>Pechatay</h1>
    <router-view :key="$route.path"/>
  </div>
</template>

<script>
// import TyperMenu from '@/views/TyperMenu.vue'

export default {
  name: 'App'
}
</script>

<style scoped>

.container {
  max-width: 600px;
  margin: 0 auto;
}

</style>