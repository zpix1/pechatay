<template>
<div>
  <div class="g-header">About</div>
  <p>
    Pechatay (rus. "Печатай", "type" in imperative form) &ndash; it's a single page web application which implements
    simple typing trainer.
  </p>

  <div class="g-header">F.A.Q.</div>
  <p class="question">
    Where my results and custom books are saved?
  </p>
  <p class="answer">
    All your stats and books are saved locally, so don't worry about progress.
  </p>

  <p class="question">
    Why time stats are always hidden?
  </p>
  <p class="answer">
    I think displaying current typing speed confuses the user and decreases performance, so I made the stats hidden by default.
    Nonetheless, you can always show them by clicking on the inscription.
  </p>

  <p class="question">
    What is WPM?
  </p>
  <p class="answer">
    WPM stands for words per minute, where each word is exactly 5 chars (including whitespace and punctuation).
  </p>

  <p class="question">
    Where my results and custom books are saved?
  </p>
  <p class="answer">
    All your stats and books are saved locally, so don't worry about progress.
  </p>

  <p class="question">
    What is "Fight Online"?
  </p>
  <p class="answer">
    This is a competitive trainer mode where you can type the same text with your friends
    in real-time sync mode over the internet.
  </p>

  <div class="g-header">Other</div>
  <p>
    Made by <a target="_blank" rel="noopener noreferrer" href="https://github.com/zpix1/">@zpix</a> in 2020,
    <a target="_blank" rel="noopener noreferrer" href="https://github.com/zpix1/pechatay">GitHub repo</a>.
  </p>
</div>
</template>

<script>
export default {
  name: "About"
};
</script>

<style scoped>
.question {
  font-style: italic;
}
</style>