<template>
  <div v-if="scheme">
    <SchemeEntry v-for="set in scheme.items" :set="set" :key="set.title"/>
  </div>
</template>

<script>
import SchemeEntry from '@/components/SchemeEntry';

export default {
  name: 'BookSelect',
  data() {
    return {
      scheme: null
    }
  },
  mounted() {
    this.scheme = this.database.getScheme();
  },
  components: {
    SchemeEntry
  }
}
</script>

<style scoped>
</style>
