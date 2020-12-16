<template>
  <div class="pseudobody" :style="cssVars">
    <div>
      <Settings :modal="settings" @close="settings = false" />
      <div v-if="!$store.state.loading">
        <div class="head">
          <span class="header">⌨️ Pechatay</span>

          <router-link class="g-text-button head-link" to="/">📒 Book select</router-link>

          <router-link class="g-text-button head-link" to="/fight/new"
            >⚔ Fight online</router-link
          >

          <a :class="{ 'head-link':true, 'g-text-button': true, 'router-link-active': settings }" @click="settings = true">
            ⚙️ Settings
          </a>

          <router-link class="g-text-button head-link" to="/about">❔ About</router-link>
        </div>
        <router-view :key="$route.path"  class="container"/>
      </div>
      <div v-else>Loading database...</div>
    </div>
  </div>
</template>

<script>
import Settings from "@/views/Settings";

export default {
  name: "App",
  data() {
    return {
      settings: false,
    };
  },
  beforeCreate() {
    this.$store.commit("init");
  },
  computed: {
    cssVars() {
      let both = {
        "--typing-font": this.$store.state.settings.font,
      };
      let darkTheme = {
        "--main-color": "black",
        "--font-color": "white",
        "--correct-char-color": "gray"
      };
      let lightTheme = {
        "--main-color": "white",
        "--font-color": "black",
        "--correct-char-color": "blue"
      };
      if (this.$store.state.settings.theme === "Light") {
        return { ...both, ...lightTheme };
      } else {
        return { ...both, ...darkTheme };
      }
    },
  },
  components: {
    Settings,
  },
};
</script>

<style>
@import "./assets/main.css";
</style>

<style scoped>
.pseudobody {
  display: inline-block;
  width: 100%;
  height: 100%;
}

.container {
  max-width: 700px;
  margin: 15px auto;
}

.head {
  border-radius: 3px;
  max-width: 800px;
  margin: 15px auto 30px auto;
  font-size: 1.3em;
}

.header {
  font-size: 1.7em;
  margin-right: 30px;
}

.head a.router-link-active {
  /*font-weight: 500;*/

  text-decoration: underline;
  /*text-decoration-thickness: 1px;*/
}
.head-link {
  margin-left: 20px;
}
</style>