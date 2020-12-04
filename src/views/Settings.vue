<template>
  <div v-if="modal" @click="outsideClick">
    <div class="modal" ref="modal">
      <div class="modal-content">
        <span class="close" @click="$emit('close')">&times;</span>
        <div class="g-header">Settings</div>

        <div class="g-subtitle">Theme</div>
        <div class="select-div">
          <div v-for="v in $store.state.settingsTemplate.theme" :key="v">
          <span
            :class="{ 'g-text-button': true, 'select-option': true, 'active-setting': $store.state.settings.theme === v }"
            @click="$store.commit('setSetting', {setting: 'theme', value: v})"
          >{{ v }}</span>
          </div>
        </div>

        <div class="g-subtitle">Typer font</div>
        <div class="select-div">
          <div v-for="v in $store.state.settingsTemplate.font" :key="v">
            <span
              :class="{ 'g-text-button': true, 'select-option': true, 'active-setting': $store.state.settings.font === v }"
              @click="$store.commit('setSetting', {setting: 'font', value: v})"
            >{{ v }}</span>
          </div>
        </div>
        <p class="g-typing">
          Алая вспышка осветила силуэт зазубренного крыла...
        </p>

        <div class="g-subtitle">Type mode</div>
        <div class="select-div">
          <div v-for="v in $store.state.settingsTemplate.typeMode" :key="v">
            <span
              :class="{ 'g-text-button': true, 'select-option': true, 'active-setting': $store.state.settings.typeMode === v }"
              @click="$store.commit('setSetting', {setting: 'typeMode', value: v})"
            >{{ v }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Settings",
  props: {
    modal: Boolean,
  },
  emits: ["close"],
  methods: {
    outsideClick(event) {
      if (event.target === this.$refs.modal) {
        this.$emit("close");
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
  border: 1px solid var(--font-color);
  margin: min(150px, 15%) auto;
  padding: 20px;
  border-radius: 3px;
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
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.select-div {
  border: 1px solid var(--font-color);
  padding: 5px;
  border-radius: 3px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.select-option {
  /* user-select: none; */
}

.active-setting {
  text-decoration: underline;
}
</style>