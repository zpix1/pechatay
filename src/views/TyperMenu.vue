<template>
  <div>
    <div v-if="book && text">
      <div class="book-title">{{ book.title || ''}} {{ book.userData.totalLetters }}</div>
      <Typer 
        @update-user-data="updateUserData"
        :user-data="book.userData"
        :text="text"
        :key="update"
      />
      <div v-if="book.userData.finished">
        You finished with {{ book.userData.totalErrors }} 
        errors out of {{ book.userData.totalLetters }} 
        letters ({{ (book.userData.totalErrors * 100 / book.userData.totalLetters).toFixed(2) }}%)
        <br>
        <input type="button" @click="restartBook" value="restart?"/>
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
      book: null,
      text: null,
      parentSet: null,
      update: false
    }
  },
  mounted() {
    this.book = this.$store.state.db.getBook(this.$route.params.id);
    this.$store.commit('setCurrentBook', this.book);

    this.$store.state.db.getBookText(this.$route.params.id).then(unformattedText => {
      this.text = unformattedText.split('\n');
    });
    this.parentSet = findParent(this.$store.state.db.getScheme(), this.$route.params.id);
  },
  methods: {
    // finish(data) {
    //   this.book.userData = data
    //   this.$store.state.db.setBook(this.book.id, this.book);
    // },
    updateUserData(data) {
      this.book.userData = data
      this.$store.state.db.setBook(this.book.id, this.book);
    },
    restartBook() {
      this.book.userData = {};
      this.$store.state.db.setBook(this.book.id, this.book);
      this.update = !this.update;
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


