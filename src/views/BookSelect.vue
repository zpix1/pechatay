<template>
  <div>
    <div class="continue-typing">
      <router-link class="g-text-button continue-typing" v-if="$store.state.currentBook"
                   :to="{ name: 'TyperMenu', params: { id: $store.state.currentBook.id } }">Continue typing
        ({{ $store.state.currentBook.title }})
      </router-link>
    </div>
    <div v-if="$store.state.scheme">
      <SchemeEntry v-for="set in $store.state.scheme.items" :set="set" :key="set.title"/>
    </div>
  </div>
</template>

<script>
import SchemeEntry from "@/components/SchemeEntry";

export default {
  name: "BookSelect",
  data() {
    return {};
  },
  components: {
    SchemeEntry
  }
};
</script>

<style scoped>
.continue-typing {
  font-size: 1.3em;
  margin-bottom: 20px;
}
</style>
