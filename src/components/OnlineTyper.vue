<template>
  <div>
    <div class="example g-typing">
      <span v-for="(letterEntry, i) in textArray"
            :key="letterEntry.letter + i"
            v-html="convertLetter(letterEntry.letter)"
            :class="{
              letter: true,
              good: letterEntry.state === '+',
              bad: letterEntry.state === '-',
              current: letterEntry.state === 'c',
              ['player p' + getPlayerByPos(i)]: getPlayerByPos(i)
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
    getPlayerByPos(pos) {
      if (this.playersPos[this.paragraph]) {
        return this.playersPos[this.paragraph][pos];
      } else {
        return undefined;
      }
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
  font-weight: bold;
  text-decoration: overline;
}
.player.p1 {
  color: yellow !important;
}
.player.p2 {
  color: coral !important;
}
.player.p3 {
  color: sienna !important;
}
</style>