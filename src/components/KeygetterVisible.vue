<template>
  <div
    contenteditable="true"
    class="g-typing"
    ref="editable"
    @input="placeChanged"
    @keydown="filterKeypress"
    @mousedown="filterMouse"
    onselect="return false;"
    oncut="return false;"
    onpaste="return false;"
  ></div>
</template>

<script>
import {placeCaretAtEnd} from "@/lib/utils";

export default {
  name: "KeygetterVisible",
  props: {
    finished: Boolean,
    clearHook: Number
  },
  emits: [
    "add-letter",
    "remove-letter"
  ],
  methods: {
    filterMouse(event) {
      if (!this.finished) {
        event.target.focus();
        placeCaretAtEnd(this.$refs.editable);
      }
      event.preventDefault();
    },
    filterKeypress(event) {
      if (this.finished) {
        event.preventDefault();
      } else if ([
        "ArrowRight",
        "ArrowLeft"
      ].includes(event.key)) {
        event.preventDefault();
      } else if ((event.ctrlKey || event.metaKey) && ["c", "v", "a"].includes(event.key)) {
        event.preventDefault();
      }
    },
    placeChanged(event) {
      if (event.inputType === "insertText") {
        this.$emit("add-letter", event.data);
      } else if (event.inputType === "insertParagraph") {
        this.$emit("add-letter", "\n");
      } else if (event.inputType === "deleteContentBackward") {
        this.$emit("remove-letter");
      }
    },
  },
  watch: {
    clearHook() {
      this.$refs.editable.innerText = "";
    }
  }
};
</script>