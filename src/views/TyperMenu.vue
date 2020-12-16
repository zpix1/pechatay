<template>
  <div>
    <div v-if="book && text">
      <div class="g-header">{{ book.title || '' }}</div>
      <div class="g-subtitle" v-if="book.author.length !== 0">{{ book.author }}</div>
      <Typer
          @update-user-data="updateUserData"
          :user-data="book.userData"
          :text="text"
          :key="update"
      />
      <div v-if="book.userData.finished" class="finished">
        <div class="result">
          You finished with {{ book.userData.totalErrors }}
          errors out of {{ book.userData.totalLetters }}
          letters ({{ (book.userData.totalErrors * 100 / book.userData.totalLetters).toFixed(2) }}%).
          <span v-if="hideTime" @click="hideTime = false" class="g-text-button">Time result hidden.</span>
          <span v-else @click="hideTime = true" class="g-text-button">Mean wpm: {{ getWPM(book.userData.totalMs, book.userData.totalLetters).toFixed(1) }}. Time: {{ (book.userData.totalMs / 1000).toFixed(1) }}.</span>
        </div>
        <span class="g-button" @click="restartBook">Type again?</span>
        <div v-if="parentSet" class="footer">
          <router-link class="prev-chapter g-button"
                       :to="{ name: 'TyperMenu', params: { id: parentSet.parent.items[parentSet.index - 1].id } }"
                       v-if="parentSet.index - 1 >= 0">
            Prev: {{ parentSet.parent.items[parentSet.index - 1].title }}
          </router-link>
          <router-link class="next-chapter g-button"
                       :to="{ name: 'TyperMenu', params: { id: parentSet.parent.items[parentSet.index + 1].id } }"
                       v-if="parentSet.index + 1 < parentSet.parent.items.length">
            Next: {{ parentSet.parent.items[parentSet.index + 1].title }}
          </router-link>
        </div>
      </div>
    </div>
    <div v-else>
      Not found or not loaded
    </div>
  </div>
</template>

<script>
import Typer from "@/components/Typer";
import {findParent, getWPM} from "@/lib/utils.js";

export default {
  name: "TyperMenu",
  components: {
    Typer
  },
  data() {
    return {
      hideTime: true,
      book: null,
      text: null,
      parentSet: null,
      update: false
    };
  },
  mounted() {
    this.book = this.$store.state.db.getBook(this.$route.params.id);
    this.$store.commit("setCurrentBook", this.book);
    this.$store.state.db.getBookText(this.$route.params.id).then(text => {
      this.text = text;
    });
    this.parentSet = findParent(this.$store.state.db.getScheme(), this.$route.params.id);
  },
  methods: {
    getWPM: getWPM,
    updateUserData(data) {
      this.book.userData = data;
      this.$store.state.db.setBook(this.book.id, this.book);
      if (data.finished) {
        if (this.parentSet.index + 1 < this.parentSet.parent.items.length) {
          this.$store.commit("setCurrentBook", this.parentSet.parent.items[this.parentSet.index + 1]);
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
  margin-bottom: 10px;
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

.result {
  margin-bottom: 10px;
}

.footer {
  margin-top: 10px;
}
</style>


