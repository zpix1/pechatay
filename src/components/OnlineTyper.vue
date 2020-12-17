<template>
  <div>
    <div class="example g-typing" v-if="dummy">
      <span v-for="(letterEntry, i) in textArray" :key="i">
        <span
          v-html="convertDummy(convertLetter(letterEntry.letter))">
        </span>
      </span>
    </div>
    <div class="example g-typing" v-else>
      <span v-for="(letterEntry, i) in textArray" :key="i">
        <span v-if="player = getPlayerByPos(i)">
          <span
            :data-text="player ? player : null"
            :class="{
              ['player p' + player + ' ' + getLetterOffsetClass(letterEntry.letter)]: player
          }">
          </span>
        </span>
        <span
          :class="{
              letter: true,
              good: letterEntry.state === '+',
              bad: letterEntry.state === '-',
              current: letterEntry.state === 'c',
            }"
          v-html="convertLetter(letterEntry.letter)">
        </span>
      </span>
    </div>

    <div v-if="!blocked">
      <KeygetterVisible
        v-if="mode === 'Separate window'"
        clearHook="clearHook"
        @add-letter="addLetter"
        @remove-letter="removeLetter"
        :finished="blocked"
      />
      <KeygetterHidden
        v-if="mode === 'In place'"
        @add-letter="addLetter"
        @remove-letter="removeLetter"
        :finished="blocked"
      />
    </div>
  </div>
</template>

<script>
import Typer from "@/components/Typer";

export default {
  mixins: [Typer],
  props: {
    playersPos: Object,
    dummy: Boolean,
    blocked: Boolean,
    userId: String,
    id2username: Object
  },
  watch: {
    blocked(value) {
      if (!value) {
        this.state = "started";
      }
    }
  },
  methods: {
    convertDummy(letter) {
      if (letter === " ") {
        return letter;
      }
      if (letter === "&para;\n") {
        return "\n";
      }
      return "&bull;";
    },
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
      for (let player in this.playersPos) {
        if (player !== this.userId) {
          if (this.playersPos[player][0] === pos && this.playersPos[player][1] === this.paragraph) {
            return this.id2username[player].slice(0, 2).toUpperCase();
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
.letter.good {
  color: var(--correct-char-color);
}

.letter.bad {
  text-decoration: underline red;
  color: red;
}

.letter.current {
  text-decoration: underline;
}

.letter.empty {
  color: black;
}

/*.letter:after {*/
/*  !*display: none;*!*/
/*  position: absolute;*/
/*  !*font-size: 0.4em;*!*/
/*  !*align-content: center;*!*/
/*  left: 0.15em;*/
/*  !*content: "&";*!*/
/*  top: -0.6em;*/
/*  !*color: black;*!*/
/*}*/

.player, .letter {
  position: relative;
}

.player:after {
  display: block;
  position: absolute;
  font-size: 0.4em;
  align-content: center;
  left: 0.15em;
  content: attr(data-text);
  top: -0.6em;
  color: black;
}

.player.upper:after {
  top: -0.7em;
}

.player.above-upper:after {
  top: -0.75em;
}

.player.lower:after {
  top: -0.4em;
}

.player.above-lower:after {
  top: -0.65em;
}

.player.punctuation:after {
  top: 0.2em;
}

.player.whitespace:after {
  top: 1em;
}
</style>