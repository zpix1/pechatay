<template>
  <div class="container">
    <BookSelect/>
    <Typer @finish="finish"/>
    <div v-if="finished">
      You finished with {{ stats.totalErrors }} 
      errors out of {{ stats.totalLetters }} 
      letters ({{ (stats.totalErrors * 100 / stats.totalLetters).toFixed(2) }}%)
    </div>
  </div>
</template>

<script>
import Typer from './Typer';
import BookSelect from './BookSelect';

export default {
  name: 'Main',
  components: {
    Typer, BookSelect
  },
  data() {
    return {
      finished: false,
      stats: null,
    }
  },
  methods: {
    finish(stats) {
      this.finished = true;
      this.stats = stats;
    }
  }
}
</script>

<style scoped>

.container {
  max-width: 600px;
  margin: 0 auto;
}

</style>
