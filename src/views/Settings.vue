<template>
  <div v-if="modal" @click="outsideClick">
    <div class="modal" ref="modal">
      <div class="modal-content">
        <span class="close" @click="$emit('close')">&times;</span>
        <div class="header">Settings</div>

        <div class="setting-title">Theme</div>
        <div v-for="v in $store.state.settingsTemplate.theme" :key="v">
          <span :class="{ 'g-text-button': true, 'active-setting': $store.state.settings.theme == v }"
                @click="$store.commit('setSetting', {setting: 'theme', value: v})"
                
          >{{ v }}</span>
        </div>

        <div class="setting-title">Typer font</div>
        <div v-for="v in $store.state.settingsTemplate.font" :key="v">
          <span :class="{ 'g-text-button': true, 'active-setting': $store.state.settings.font == v }"
                @click="$store.commit('setSetting', {setting: 'font', value: v})"
                
          >{{ v }}</span>
        </div>
        <p class="typer-font-example">
          Алая вспышка осветила силуэт зазубренного крыла...
        </p>

        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  props: {
    modal: Boolean,
  },
  emits: ['close'],
  methods: {
    outsideClick(event) {
      if (event.target == this.$refs.modal) {
        this.$emit('close');
      }
    }
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: var(--main-color);
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  max-width: 600px;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  text-decoration: none;
  cursor: pointer;
}

.header { 
  font-size: 25px;
  margin-bottom: 10px;
}

.setting-title {
  font-size: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.active-setting {
  text-decoration: underline;
}

.typer-font-example {  
  font-family: var(--typing-font), monospace;

  border: 1px solid var(--font-color);
  padding: 10px;
  margin-bottom: 10px;
  font-size: 20px;
}
</style>