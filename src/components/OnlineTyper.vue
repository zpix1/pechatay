<template>
  <div>
    <div class="example g-typing">
      <span v-for="(letterEntry, i) in textArray"
            :key="letterEntry.letter + i"
            v-html="convertLetter(letterEntry.letter)"
            :data-text="getPlayerByPos(i) ? 'P'+getPlayerByPos(i) : null"
            :class="{
              letter: true,
              good: letterEntry.state === '+',
              bad: letterEntry.state === '-',
              current: letterEntry.state === 'c',
              ['player p' + getPlayerByPos(i) + ' ' + getLetterOffsetClass(letterEntry.letter)]: getPlayerByPos(i),
            }">
      </span>
    </div>

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
  </div>
</template>

<script>
import Typer from "@/components/Typer";

export default {
  mixins: [Typer],
  props: {
    playersPos: Object
  },
  methods: {
    getLetterOffsetClass(letter) {
      if (letter === "й") {
        return "above-lower";
      }
      if (letter === "Й") {
        return "above-upper";
      }
      if (",._".split("").includes(letter)) {
        return "punctuation";
      }
      if (" " === letter) {
        return "whitespace";
      }
      if (letter.toLowerCase() === letter) {
        return "lower";
      }
      if (letter.toUpperCase() === letter) {
        return "upper";
      }
    },
    getPlayerByPos(pos) {

      if (this.playersPos[this.paragraph]) {
        for (let p in this.playersPos[this.paragraph]) {
          if (this.playersPos[this.paragraph][p] === pos) {
            return p;
          }
        }
      }
      return undefined;
    }
  },
  name: "OnlineTyper"
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

.player {
  position: relative;
}

.player:before {
  position: absolute;
  font-size: 0.4em;
  align-content: center;
  left: 0.15em;
  content: attr(data-text);
  top: -0.6em;
  color: black;
}

.player.upper:before {
  top: -0.7em;
}

.player.above-upper:before {
  top: -0.75em;
}

.player.lower:before {
  top: -0.4em;
}

.player.above-lower:before {
  top: -0.65em;
}

.player.punctuation:before {
  top: 0.2em;
}

.player.whitespace:before {
  top: 1em;
}

/*.player.p1 {*/
/*  color: yellow !important;*/
/*}*/
/*.player.p2 {*/
/*  color: coral !important;*/
/*}*/
/*.player.p3 {*/
/*  color: sienna !important;*/
/*}*/
</style>