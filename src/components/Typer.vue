<template>
  <h1>Typer</h1>
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
      id='user-editable-typing'
      @input="placeChanged"
      @keydown="filterKeypress"
      @mousedown="filterMouse"
      onselect='return false;'
      oncut='return false;'
      onpaste='return false;'
    ></div>
    
  </div>
</template>

<script>
export default {
  name: 'Typer',
  data() {
    return {
      text: [
        'Предыдущий параграф\n',
        'Привет.\n',
        'Следующий параграф\n',
        ''
      ],
      textArray: null,
      pos: 0,
      paragaph: 0,
      userInput: ''
    }
  },
  mounted() {
    this.updateTextArray();
  },
  methods: {
    filterMouse(event) {
      event.target.focus();
      event.preventDefault();
    },
    filterKeypress(event) {
      if ([
          'ArrowRight',
          'ArrowLeft'
        ].includes(event.key)) {
        event.preventDefault();
      } else if ((event.ctrlKey || event.metaKey) && ['c', 'v', 'a'].includes(event.key)) {
        console.log('prevented!');
        event.preventDefault();
      }
    },
    finishText() {
      alert('Well done!');
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
      this.paragaph++;
      if (this.paragaph >= this.text.length) {
        this.finishText();
      }
      this.pos = 0;
      document.getElementById('user-editable-typing').innerText = '';
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
      if (this.pos >= this.textArray.length) {
        this.addParagaph();
        return;
      }
      if (this.pos > this.textArray.length) {
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
