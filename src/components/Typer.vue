<template>
  <div>
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
    text: Array
  },
  data() {
    return {
      textArray: null,
      pos: 0,
      paragaph: 0,
      userInput: '',
      finished: false,
      userEditableId: 'user-editable-typing',
      stats: {
        totalParagraphs: 0,
        totalLetters: 0,
        totalErrors: 0,
      }
    }
  },
  emits: ['finish'],
  mounted() {
    this.updateTextArray();
  },
  methods: {
    filterMouse(event) {
      if (!this.finished) {
        event.target.focus();
      }
      event.preventDefault();
    },
    filterKeypress(event) {
      if (this.finished) {
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
      this.$emit('finish', this.stats);
      this.$refs.editable.blur();
      this.finished = true;
    },
    updateTextArray() {
      this.textArray = [];
      for (let i = 0; i < this.text[this.paragaph].length; i++) {
        this.textArray.push({
          letter: this.text[this.paragaph][i],
          state: ''
        });
      }
    },
    addParagaph() {
      this.stats.totalParagraphs++;
      this.stats.totalErrors += this.textArray.filter(e => e.state == '-').length;
      this.stats.totalLetters += this.textArray.length;

      if (this.paragaph + 1 >= this.text.length) {
        this.finishText();
        return;
      }
      this.paragaph++;

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
}
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

.user-editable {
  /* pointer-events: none; */
}

.typing {
  border: 1px solid black;
  padding: 10px;
  margin-bottom: 10px;

  font-family: monospace;
  font-size: 20px;
}

</style>
