<template>
  <div>
    <div v-if="book && text">
      <div class="book-title">{{ book.title || ''}}</div>
      <Typer 
        @update-user-data="updateUserData"
        :user-data="book.userData"
        :text="text"
        :key="update"
      />
      <div v-if="book.userData.finished" class="finished">
        You finished with {{ book.userData.totalErrors }} 
        errors out of {{ book.userData.totalLetters }} 
        letters ({{ (book.userData.totalErrors * 100 / book.userData.totalLetters).toFixed(2) }}%)
        <br>
        <input type="button" @click="restartBook" value="restart?"/>
      </div>
      <div v-if="parentSet" class="footer">
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
import { findParent } from '@/lib/utils.js';

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
    };
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
    updateUserData(data) {
      this.book.userData = data;
      this.$store.state.db.setBook(this.book.id, this.book);
      if (data.finished) {
        if (this.parentSet.index + 1 < this.parentSet.parent.items.length) {
          this.$store.commit('setCurrentBook', this.parentSet.parent.items[this.parentSet.index + 1]);
        }
      }
    },
    restartBook() {
      this.book.userData = {};
      this.$store.state.db.setBook(this.book.id, this.book);
      this.update = !this.update;
    }
  }
};
</script>

<style scoped>
.book-title {
  font-size: 25px;
  margin-bottom: 20px;
}

.prev-chapter {
  float: left;
}

.next-chapter {
  float: right;
}

.finished {
  margin-bottom: 20px;
}
</style>


