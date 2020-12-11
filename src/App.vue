<template>
  <div class="pseudobody" :style="cssVars">
    <div class="container">
      <Settings :modal="settings" @close="settings = false" />
      <div v-if="!$store.state.loading">
        <div class="head">
          <span class="header">Pechatay</span>
          <router-link class="g-text-button" to="/">Book select</router-link>
          |
          <router-link class="g-text-button" to="/fight/new"
            >Fight online</router-link
          >
          |
          <a :class="{ 'g-text-button': true, 'router-link-active': settings }" @click="settings = true">Settings</a> |
          <router-link class="g-text-button" to="/about">About</router-link>
        </div>
        <router-view :key="$route.path" />
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
  max-width: 600px;
  margin: 15px auto;
}

.header {
  font-size: 30px;
  margin-right: 30px;
}

.head {
  font-size: 20px;
  margin-bottom: 30px;
}

.head a.router-link-active {
  text-decoration: underline;
}
</style>