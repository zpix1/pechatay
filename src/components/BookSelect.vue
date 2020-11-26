<template>
  <div>
      <input type="button" @click="run" :value="`update database v=${version}`">
  </div>
</template>

<script>
import Database from '@/lib/database';

export default {
  name: 'BookSelect',
  data() {
    return {
      version: '0.0.1',
      database: null
    }
  },
  methods: {
    run() {
      this.database.listBooks().then(d => {
        console.log(d);
      });
    }
  },
  mounted() {
    this.database = new Database();
  }
}
</script>

<style scoped>
</style>
