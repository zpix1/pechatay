<template>
  <div v-if="scheme">
    
    <SchemeEntry v-for="set in scheme.items" :set="set" :key="set.title"/>
      <!-- <input type="button" @click="run" :value="`update database v=${version}`"> -->
      
      <!-- <div v-for="b in books" :key="b.id">
        <router-link :to="{ name: 'TyperMenu', params: { id: b.id } }">{{ b.title }}</router-link>
      </div> -->
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
