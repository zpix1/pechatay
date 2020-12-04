<template>
<div></div>
</template>

<script>
export default {
  name: "KeygetterHidden",
  data() {
    return {
      listener: (event) => {
        if (event.key === "Enter") {
          this.$emit("add-letter", "\n");
        } else if (event.key === "Backspace") {
          this.$emit("remove-letter");
          event.preventDefault();
        } else if (event.key.length === 1) {
          this.$emit("add-letter", event.key);
        }
      }
    };
  },
  emits: [
    "add-letter",
    "remove-letter"
  ],
  mounted() {
    document.addEventListener(
      "keydown",
      this.listener,
      false
    );
  },
  unmounted() {
    document.removeEventListener(
      "keydown",
      this.listener,
      false
    );
  }
};
</script>