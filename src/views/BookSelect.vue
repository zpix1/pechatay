<template>
  <div>
      <!-- <input type="button" @click="run" :value="`update database v=${version}`"> -->
      <div v-for="b in books" :key="b.id">
        <router-link :to="{ name: 'TyperMenu', params: { id: b.id } }">{{ b.title }}</router-link>
      </div>
  </div>
</template>

<script>
import Database from '@/lib/database';

export default {
  name: 'BookSelect',
  data() {
    return {
      database: null,
      books: []
    }
  },
  mounted() {
    this.database = new Database();
    this.database.init().then(() => {
      this.database.listBooks().then(d => {
        this.books = d;
      });
    })
  }
}
</script>

<style scoped>
</style>
