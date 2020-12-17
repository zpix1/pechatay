<template>
  <div>
    <div class="info">
      position: {{ pos }}, paragraph: {{ paragraph + 1 }}/{{ paragraphLength }},
      <span v-if="hideTime"
            @click="hideTime = false"
            class="g-text-button">time stats hidden</span>
      <span v-else @click="hideTime = true" class="g-text-button">wpm: {{
          wpm.toFixed(1)
        }}, time: {{ (currentMs / 1000).toFixed(1) }}</span>
      <!--      <span @click="hideTime = !hideTime" class="g-text-button">{{ hideTime ? "show time stats" : "hide time stats" }}</span><br>-->
    </div>
    <!-- <div class="typing" v-if="paragaph > 0">
      {{ text[paragaph - 1] }}
    </div> -->
    <div class="example g-typing">
      <span v-for="(letterEntry, i) in textArray"
            :key="letterEntry.letter + i"
            v-html="convertLetter(letterEntry.letter)"
            :class="{
              letter: true,
              good: letterEntry.state === '+',
              bad: letterEntry.state === '-',
              current: letterEntry.state === 'c'
            }">
      </span>
    </div>
    <!-- <div class="typing" v-if="paragaph + 1 < text.length">
      {{ text[paragaph + 1] }}
    </div> -->
    <div v-if="!stats.finished">
      <KeygetterVisible
        v-if="mode === 'Separate window'"
        clearHook="clearHook"
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
      paragraph: this.userData.totalParagraphs || 0,
      paragraphLength: 0,

      stats: {
        totalMs: this.userData.totalMs || 0,
        totalParagraphs: this.userData.totalParagraphs || 0,
        totalLetters: this.userData.totalLetters || 0,
        totalErrors: this.userData.totalErrors || 0,
        finished: this.userData.finished || false
      },

      hideTime: true,
      state: "not-started",
      startTime: null,
      currentMs: 0,
      updateTimeIntervalId: null,

      clearHook: 0
    };
  },
  emits: ["update-user-data", "finish", "position-update"],
  mounted() {
    this.paragraphLength = this.text.length;
    this.updateTextArray();
  },
  methods: {
    emitUpdateUserData() {
      this.$emit("update-user-data", this.stats);
    },
    finishText() {
      this.stats.finished = true;
      this.$emit("finish", this.stats);
      this.emitUpdateUserData();
    },
    updateTextArray() {
      this.textArray = [];
      for (let i = 0; i < this.text[this.paragraph].length; i++) {
        let letter = this.text[this.paragraph][i];
        if (letter === "\n") {
          this.textArray.push({
            letter: "NEWLINE",
            state: ""
          });
        } else {
          this.textArray.push({
            letter: letter,
            state: ""
          });
        }
      }
      this.textArray[0].state = "c";
    },
    updateTime() {
      if (this.state === "started") {
        this.currentMs = (new Date()) - this.startTime;
      } else {
        this.currentMs = this.totalMs;
      }
    },
    addParagraph() {
      this.updateTime();

      this.state = "not-started";

      this.stats.totalMs += (new Date()) - this.startTime;
      this.stats.totalErrors += this.textArray.filter(e => e.state === "-").length;
      this.stats.totalLetters += this.textArray.length;

      if (this.paragraph + 1 >= this.text.length) {
        this.finishText();
        return;
      }

      this.paragraph++;
      this.stats.totalParagraphs++;

      this.pos = 0;

      this.clearHook++;

      this.updateTextArray();
      this.emitUpdateUserData();
    },
    addLetter(letter) {
      this.pos++;
      if ((letter === this.textArray[this.pos - 1].letter) || (
        letter === "\n" && this.textArray[this.pos - 1].letter === "NEWLINE"
      )) {
        this.textArray[this.pos - 1].state = "+";
      } else {
        this.textArray[this.pos - 1].state = "-";
      }
      if (this.pos >= this.textArray.length) {
        this.addParagraph();
        return;
      }
      if (this.pos > this.textArray.length) {
        return;
      }
      if (this.pos < this.textArray.length) {
        this.textArray[this.pos].state = "c";
        if (this.state === "not-started") {
          this.state = "started";
        }
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
    },
    convertLetter(letter) {
      // letter[0] to escape server side XSS
      return letter === "NEWLINE" ? "&para;\n" : letter[0];
    }
  },
  computed: {
    mode() {
      return this.$store.state.settings.typeMode;
    },
    wpm() {
      if (this.currentMs !== 0) {
        return (this.pos / 5) / (this.currentMs / 1000 / 60);
      } else {
        return 0;
      }
    }
  },
  watch: {
    mode() {
      this.pos = 0;
      this.updateTextArray();
      this.emitUpdateUserData();
    },
    pos(value) {
      this.$emit("position-update", {
        pos: value,
        paragraph: this.paragraph
      });
    },
    state(value) {
      if (value === "started") {
        this.startTime = new Date();
        this.updateTimeIntervalId = setInterval(() => {
          this.updateTime();
        }, 500);
      } else {
        clearInterval(this.updateTimeIntervalId);
      }
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
