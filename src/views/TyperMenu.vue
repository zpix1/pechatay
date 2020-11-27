<template>
  <div>
    <div v-if="book && text">
      <div class="book-title">{{ book.title || ''}}</div>
      <Typer @finish="finish" :text="text"/>
      <div v-if="finished">
        You finished with {{ stats.totalErrors }} 
        errors out of {{ stats.totalLetters }} 
        letters ({{ (stats.totalErrors * 100 / stats.totalLetters).toFixed(2) }}%)
      </div>
      <div v-if="parentSet">
        <router-link class="prev-chapter" :to="{ name: 'TyperMenu', params: { id: parentSet.parent.items[parentSet.index - 1].id } }" v-if="parentSet.index - 1 >= 0"> 
          {{ parentSet.parent.items[parentSet.index - 1].title }} 
        </router-link>
        <router-link class="next-chapter" :to="{ name: 'TyperMenu', params: { id: parentSet.parent.items[parentSet.index + 1].id } }" v-if="parentSet.index + 1 < parentSet.parent.items.length"> 
          {{ parentSet.parent.items[parentSet.index + 1].title }} 
        </router-link>
      </div>
    </div>
    <div v-else>
      Not found or not loaded
    </div>
  </div>
</template>

<script>
import Typer from '@/components/Typer';

function findParent(scheme, id) {
  for (let i = 0; i < scheme.items.length; i++) {
    if (scheme.items[i].type === 'set') {
      let res = findParent(scheme.items[i], id);
      if (res) {
        return res;
      }
    } else {
      if (scheme.items[i].id === id) {
        return {
          parent: scheme,
          index: i
        }
      }
    }
  }
  return false;
}

export default {
  name: 'TyperMenu',
  components: {
    Typer
  },
  data() {
    return {
      finished: false,
      stats: null,
      book: null,
      text: null,
      parentSet: null
    }
  },
  mounted() {
    this.database.getBook(this.$route.params.id).then(book => {
      this.book = book;
    });
    this.database.getBookText(this.$route.params.id).then(unformattedText => {
      this.text = unformattedText.split('\n');
    });
    this.parentSet = findParent(this.database.getScheme(), this.$route.params.id);
    console.log(this.parentSet);
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

.book-title {
  font-size: 25px;
  margin-bottom: 20px;
}

</style>


