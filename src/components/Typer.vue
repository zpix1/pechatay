<template>
  <div>
    <div class="info">
      position: {{ pos }}, paragraph: {{ paragaph }}, wpm: {{ 55 }}
    </div>
    <!-- <div class="typing" v-if="paragaph > 0">
      {{ text[paragaph - 1] }}
    </div> -->
    <div class="example g-typing">
      <span v-for="(letterEntry, i) in textArray" 
            :key="letterEntry.letter + i"
            :class="{
              letter: true,
              good: letterEntry.state == '+',
              bad: letterEntry.state == '-',
              current: letterEntry.state == 'c'
            }">
        {{ letterEntry.letter }}
      </span>
    </div>
    <!-- <div class="typing" v-if="paragaph + 1 < text.length">
      {{ text[paragaph + 1] }}
    </div> -->
    <div v-if="!this.stats.finished">
      <KeygetterVisible
        v-if="mode === 'Separate window'"
        :clearv="clearv"
        @add-letter="addLetter"
        @remove-letter="removeLetter"
        :finished="stats.finished"
      />
      <KeygetterHidden 
        v-if="mode === 'In place'"
        @add-letter="addLetter"
        @remove-letter="removeLetter"
        :finished="stats.finished"
      />
    </div>
    <!-- <div
      v-if="!this.stats.finished"
      contenteditable="true" class="user-editable typing"
      :id="userEditableId"
      ref="editable"
      @input="placeChanged"
      @keydown="filterKeypress"
      @mousedown="filterMouse"
      onselect="return false;"
      oncut="return false;"
      onpaste="return false;"
    ></div> -->
  </div>
</template>

<script>
import KeygetterVisible from "@/components/KeygetterVisible";
import KeygetterHidden from "@/components/KeygetterHidden";

export default {
  name: "Typer",
  props: {
    text: Array,
    userData: Object
  },
  components: {
    KeygetterVisible,
    KeygetterHidden
  },
  data() {
    return {
      textArray: null,
      pos: 0,
      paragaph: this.userData.totalParagraphs || 0,
      clearv: 0,
      stats: {
        totalParagraphs: this.userData.totalParagraphs || 0,
        totalLetters: this.userData.totalLetters || 0,
        totalErrors: this.userData.totalErrors || 0,
        finished: this.userData.finished || false
      }
    };
  },
  emits: ["update-user-data"],
  mounted() {
    this.updateTextArray();
  },
  methods: {
    emitUpdateUserData() {
      this.$emit("update-user-data", this.stats);
    },
    finishText() {
      this.stats.finished = true;
      this.emitUpdateUserData();
    },
    updateTextArray() {
      this.textArray = [];
      for (let i = 0; i < this.text[this.paragaph].length; i++) {
        this.textArray.push({
          letter: this.text[this.paragaph][i],
          state: ""
        });
      }
      this.textArray[0].state = "c";
    },
    addParagaph() {
      this.stats.totalErrors += this.textArray.filter(e => e.state == "-").length;
      this.stats.totalLetters += this.textArray.length;

      if (this.paragaph + 1 >= this.text.length) {
        this.finishText();
        return;
      }

      this.paragaph++;
      this.stats.totalParagraphs++;

      this.pos = 0;

      this.clearv++;

      this.updateTextArray();
      this.emitUpdateUserData();
    },
    addLetter(letter) {
      this.pos++;
      if (letter == this.textArray[this.pos - 1].letter) {
        this.textArray[this.pos - 1].state = "+";
      } else {
        this.textArray[this.pos - 1].state = "-";
      }
      if (this.pos >= this.textArray.length) {
        this.addParagaph();
        return;
      }
      if (this.pos > this.textArray.length) {
        return;
      }
      if (this.pos < this.textArray.length) {
        this.textArray[this.pos].state = "c";
      }
    },
    removeLetter() {
      if (this.pos <= 0) {
        return;
      }
      this.pos--;
      if (this.pos + 1 >= this.textArray.length) {
        return;
      }
      this.textArray[this.pos + 1].state = "e";
      this.textArray[this.pos].state = "c";
    }
  },
  computed: {
    mode() {
      return this.$store.state.settings.typeMode;
    }
  },
  watch: {
    mode() {
      this.pos = 0;
      this.updateTextArray();
      this.emitUpdateUserData();
    }
  }
};
</script>

<style scoped>
.example > .letter.good {
  color: var(--correct-char-color);
}

.example > .letter.bad {
  text-decoration: underline red;
  color: red;
}

.example > .letter.current {
  text-decoration: underline;
}

.example > .letter.empty {
  color: black;
}

.info {
  margin-bottom: 20px;
}
</style>
