<template>
  <div>
    <router-link to="/">Go back</router-link>
    <div v-if="book && text">
      <h1>{{ book.title || ''}}</h1>
      <Typer @finish="finish" :text="text"/>
      <div v-if="finished">
        You finished with {{ stats.totalErrors }} 
        errors out of {{ stats.totalLetters }} 
        letters ({{ (stats.totalErrors * 100 / stats.totalLetters).toFixed(2) }}%)
      </div>
    </div>
  </div>
</template>

<script>
import Typer from '@/components/Typer';
import Database from '@/lib/database';

export default {
  name: 'TyperMenu',
  components: {
    Typer
  },
  data() {
    return {
      finished: false,
      stats: null,
      book: {},
      text: null,
      db: null
    }
  },
  async mounted() {
    console.log(this.$route.params.id);
    this.db = new Database();
    console.log(this.db);
    await this.db.init();
    console.log(this.db);
    this.db.getBook(this.$route.params.id).then(book => {
      this.book = book;
    });
    this.db.getBookText(this.$route.params.id).then(unformattedText => {
      this.text = unformattedText.split('\n');
    });
  },
  methods: {
    finish(stats) {
      this.finished = true;
      this.stats = stats;
    }
  }
}
</script>


