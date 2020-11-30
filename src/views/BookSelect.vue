<template>
  <div>
  <div class="continue-typing">
    <router-link class="continue-typing" v-if="$store.state.currentBook" :to="{ name: 'TyperMenu', params: { id: $store.state.currentBook.id } }">Continue typing ({{ $store.state.currentBook.title }})</router-link>
  </div>
  <div v-if="this.$store.state.scheme">
    <SchemeEntry v-for="set in this.$store.state.scheme.items" :set="set" :key="set.title"/>
  </div>
  </div>
</template>

<script>
import SchemeEntry from '@/components/SchemeEntry';

export default {
  name: 'BookSelect',
  data() {
    return {
    };
  },
  components: {
    SchemeEntry
  }
};
</script>

<style scoped>
.continue-typing {
  font-size: 20px;
  color: black;
  text-decoration: none;
  margin-bottom: 20px;
}
</style>
