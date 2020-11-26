<template>
  <div class="container">
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
  props: {
    bookId: String
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
    this.db = new Database();
    await this.db.init();
    this.db.getBook(this.bookId).then(book => {
      this.book = book;
    });
    this.db.getBookText(this.bookId).then(unformattedText => {
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

<style scoped>

.container {
  max-width: 600px;
  margin: 0 auto;
}

</style>
