<template>
  <div class="container">
    <Typer/>
  </div>
</template>

<script>
import Typer from './Typer';

export default {
  name: 'Main',
  components: {
    Typer
  }
}
</script>

<style scoped>

.container {
  max-width: 600px;
  margin: 0 auto;
}

</style>
