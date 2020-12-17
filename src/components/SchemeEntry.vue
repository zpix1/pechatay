<template>
  <div>
    <div v-if="set.type === 'set'">
      <div>{{ set.title }}</div>
      <ol v-for="element in set.items" :key="element.title">
        <SchemeEntry :set="element" />
      </ol>
    </div>
    <div v-else>
      <router-link :class="{ 'final-entry': true, 'g-text-button': true, 'finished': $store.state.db.getBook(set.id).userData.finished }" :to="{ name: 'TyperMenu', params: { id: set.id } }">{{ set.title }}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "SchemeEntry",
  props: {
    set: Object
  }
};
</script>

<style scoped>
.finished:before {
  content: "✔️" !important;
}
</style>
