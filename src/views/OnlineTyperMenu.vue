<template>
  <div v-if="state === 'fight'">
    <div class="g-header">Fight "{{ sessionInfo.title }}"</div>
    <div>
      Players: {{ sessionInfo.players }}<br>
      You: {{ sessionInfo.you }}
    </div>
    <OnlineTyper :text="text" :user-data="usedDataDummy" :players-pos="playersPos"/>
  </div>
  <div v-else-if="state === 'new-session'">
    <div class="g-header">New session</div>
  </div>
</template>

<script>
import OnlineTyper from "@/components/OnlineTyper";

export default {
  name: "OnlineTyperMenu",
  components: {
    OnlineTyper
  },
  data() {
    return {
      text: null,
      usedDataDummy: {},
      state: null,
      sessionInfo: null,
      playersPos: {
        0: {
          1: 5
        }
      }
    };
  },
  methods: {
    getSessionInfo() {
      return {
        "title": "Тест Онлайн",
        "text": ["Во дни сомнений, во дни тягостных раздумий о судьбах моей родины, - ты один мне поддержка и опора, о великий, могучий, правдивый и свободный русский язык!", "Не будь тебя - как не впасть в отчаяние при виде всего, что совершается дома? Но нельзя верить, чтобы такой язык не был дан великому народу!"],
        "players": [1, 2, 3],
        "you": 1
      };
    }
  },
  created() {
    // TODO: implement sockets and backend
    let sessionId = this.$route.params.id;
    if (sessionId) {
      this.state = "create-session";
      // TODO: implement session creation
    } else {
      this.state = "fight";
      this.sessionInfo = this.getSessionInfo();
      this.text = this.sessionInfo.text;

      setInterval(() => {
        this.playersPos[0][1] = (this.playersPos[0][1] + 1) % this.text[0].length;
      }, 300);
    }
  }
};
</script>

<style scoped>

</style>