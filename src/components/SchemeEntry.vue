<template>
  <div>
    <div v-if="set.type === 'set'">
      <div>{{ set.title }}</div>
      <ul v-for="element in set.items" :key="element.title">
        <SchemeEntry :set="element" />
      </ul>
    </div>
    <div v-else>
      <router-link :to="{ name: 'TyperMenu', params: { id: set.id } }">{{ set.title }}</router-link>
      {{ $store.state.db.getBook(set.id).userData.finished ? '+' : '' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SchemeEntry',
  props: {
    set: Object
  }
};
</script>