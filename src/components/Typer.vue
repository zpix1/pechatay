<template>
  <h1>Typer</h1>
  <div>
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
      <!-- {{ text }} -->
    </div>
    <div 
      contenteditable="true" class="place typing"
      @input="placeChanged"
      @keydown="filterKeypress"
      @mousedown="filterMouse"
    ></div>
    
  </div>
</template>

<script>

const blockedKeys = [
  'ArrowRight',
  'ArrowLeft'
]

export default {
  name: 'Typer',
  data() {
    return {
      text: 'Привет, это тестирование набора текста.\n',
      textArray: null,
      pos: 0
    }
  },
  mounted() {
    this.textArray = [];
    for (let i = 0; i < this.text.length; i++) {
      this.textArray.push({
        letter: this.text[i],
        state: ''
      });
    }
  },
  methods: {
    filterMouse(event) {
      event.target.focus();
      event.preventDefault();
    },
    filterKeypress(event) {
      if (blockedKeys.includes(event.key)) {
        event.preventDefault();
      }
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
      this.pos++
      if (this.pos >= this.textArray.length) {
        return;
      }
      if (letter == this.textArray[this.pos - 1].letter) {
        this.textArray[this.pos - 1].state = '+';
      } else {
        this.textArray[this.pos - 1].state = '-';
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

.typing {
  border: 1px solid black;
  padding: 10px;
  margin-bottom: 10px;

  font-family: monospace;
  font-size: 20px;
}

</style>
