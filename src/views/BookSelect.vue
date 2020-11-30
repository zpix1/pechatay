<template>
  <div v-if="this.$store.state.scheme">
    <SchemeEntry v-for="set in this.$store.state.scheme.items" :set="set" :key="set.title"/>
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
</style>
