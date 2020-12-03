<template>
  <div>
    <div v-if="set.type === 'set'">
      <div>{{ set.title }}</div>
      <ul v-for="element in set.items" :key="element.title">
        <SchemeEntry :set="element" />
      </ul>
    </div>
    <div v-else>
      {{ $store.state.db.getBook(set.id).userData.finished ? '+' : '' }}
      <router-link class="g-text-button" :to="{ name: 'TyperMenu', params: { id: set.id } }">{{ set.title }}</router-link>
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
