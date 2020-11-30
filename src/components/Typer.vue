<template>
  <div>
    <div>
      Pos: {{ pos }}, Paragraph: {{ paragaph }}
    </div>
    <div class="typing" v-if="paragaph > 0">
      {{ text[paragaph - 1] }}
    </div>
    <div class="example typing">
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
    <div class="typing" v-if="paragaph + 1 < text.length">
      {{ text[paragaph + 1] }}
    </div>
    <div
      contenteditable="true" class="user-editable typing"
      :id="userEditableId"
      ref="editable"
      @input="placeChanged"
      @keydown="filterKeypress"
      @mousedown="filterMouse"
      onselect="return false;"
      oncut="return false;"
      onpaste="return false;"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'Typer',
  props: {
    text: Array,
    userData: Object
  },
  data() {
    return {
      textArray: null,
      pos: 0,
      paragaph: this.userData.totalParagraphs || 0,
      userInput: '',
      userEditableId: 'user-editable-typing',
      stats: {
        totalParagraphs: this.userData.totalParagraphs || 0,
        totalLetters: this.userData.totalLetters || 0,
        totalErrors: this.userData.totalErrors || 0,
        finished: this.userData.finished || false
      }
    };
  },
  emits: ['update-user-data'],
  mounted() {
    this.updateTextArray();
    setInterval(() => {
      if (!this.stats.finished) {
        this.emitUpdateUserData();
      }
    }, 5000);
  },
  methods: {
    emitUpdateUserData() {
      console.log('update', this.stats);
      this.$emit('update-user-data', this.stats);
    },
    filterMouse(event) {
      if (!this.stats.finished) {
        event.target.focus();
      }
      event.preventDefault();
    },
    filterKeypress(event) {
      if (this.stats.finished) {
        event.preventDefault();
      } else if ([
          'ArrowRight',
          'ArrowLeft'
        ].includes(event.key)) {
        event.preventDefault();
      } else if ((event.ctrlKey || event.metaKey) && ['c', 'v', 'a'].includes(event.key)) {
        event.preventDefault();
      }
    },
    finishText() {
      this.stats.finished = true;
      this.$refs.editable.blur();
      this.emitUpdateUserData();
    },
    updateTextArray() {
      this.textArray = [];
      for (let i = 0; i < this.text[this.paragaph].length; i++) {
        this.textArray.push({
          letter: this.text[this.paragaph][i],
          state: ''
        });
      }
      this.textArray[0].state = 'c';
    },
    addParagaph() {
      this.stats.totalErrors += this.textArray.filter(e => e.state == '-').length;
      this.stats.totalLetters += this.textArray.length;

      if (this.paragaph + 1 >= this.text.length) {
        this.finishText();
        return;
      }
      this.paragaph++;
      this.stats.totalParagraphs++;

      this.pos = 0;
      this.$refs.editable.innerText = '';
      this.updateTextArray();
    },
    placeChanged(event) {
      if (event.inputType === 'insertText') {
        this.addLetter(event.data);
      } else if (event.inputType === 'insertParagraph') {
        this.addLetter('\n');
      } else if (event.inputType === 'deleteContentBackward') {
        this.removeLetter();
      }
    },
    addLetter(letter) {
      this.pos++;
      if (letter == this.textArray[this.pos - 1].letter) {
        this.textArray[this.pos - 1].state = '+';
      } else {
        this.textArray[this.pos - 1].state = '-';
      }
      if (this.pos >= this.textArray.length) {
        this.addParagaph();
        return;
      }
      if (this.pos > this.textArray.length) {
        return;
      }
      if (this.pos < this.textArray.length) {
        this.textArray[this.pos].state = 'c';
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
      this.textArray[this.pos + 1].state = 'e';
      this.textArray[this.pos].state = 'c';
    }
  }
};
</script>

<style scoped>
.example > .letter.good {
  color: blue;
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

.typing {
  border: 1px solid black;
  padding: 10px;
  margin-bottom: 10px;

  font-family: monospace;
  font-size: 20px;
}
</style>
