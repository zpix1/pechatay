<template>
  <div>
    State: {{ state }}
    <div v-if="!isState('create-session')">

      <div class="g-header">Fight "{{ sessionInfo.title }}"</div>
      <div>
        Players: {{ sessionInfo.players }}<br>
        You: {{ sessionInfo.you }}
      </div>

      <div v-if="isState('preparing-to-start')">
        <div v-if="isState('preparing-to-start-server-wait')">
          Game will start NOW!
        </div>
        <div v-else>
          Starting in {{ prepareStartCountdown }}...
        </div>
      </div>

      <div v-if="sessionInfo.you === 1 && isState('not-started')"
           class="g-text-button"
           @click="sendPrepareStartEvent">
        Start?
      </div>

      <OnlineTyper
        @finish="finishBefore"
        @position-update="sendPlayerPos"
        :dummy="isState('not-started')"
        :blocked="!isState('started')"
        :text="text" :user-data="usedData"
        :players-pos="playersPos"
      />

      <div v-if="isState('finished-all')">
        Game ended!<br>
        <!--      TODO: implement nice results view -->
        Results: {{ results }}
      </div>
      <div v-if="isState('finished-before')">
        Well done! You've finished, please, wait other players
      </div>

    </div>
    <div v-else-if="isState('new-session')">
      <div class="g-header">New session</div>
    </div>
  </div>
</template>

<script>
import OnlineTyper from "@/components/OnlineTyper";

// new-session
// not-started
// preparing-to-start
// preparing-to-start-server-wait
// started
// finished-before
// finished-all

const startCountdown = 3;

export default {
  name: "OnlineTyperMenu",
  components: {
    OnlineTyper
  },
  data() {
    return {
      text: null,
      usedData: {},
      state: null,
      sessionInfo: null,
      prepareStartCountdown: startCountdown,
      playersPos: {},
      results: null,
      loading: false
    };
  },
  methods: {
    // TODO: remove in prod version
    getSessionInfo() {
      return {
        "state": "not-started",
        "title": "Тест Онлайн",
        "text": ["Во дни сомнений, во дни тягостных раздумий о судьбах моей родины, - ты один мне поддержка и опора, о великий, могучий, правдивый и свободный русский язык!", "Не будь тебя - как не впасть в отчаяние при виде всего, что совершается дома? Но нельзя верить, чтобы такой язык не был дан великому народу!"],
        "players": [1, 2, 3],
        "you": 1
      };
    },

    isState(state) {
      return this.state.startsWith(state);
    },

    // Socket emitters
    sendPrepareStartEvent() {
      // TODO: Send prepare start event to server
      this.state = "preparing-to-start";
      let intervalCode = setInterval(() => {
        this.prepareStartCountdown--;
        if (this.prepareStartCountdown === 0) {
          clearInterval(intervalCode);
          this.prepareStartCountdown = startCountdown;
          this.state = "preparing-to-start-server-wait";
          // TODO: remove this.start() in prod version
          this.start();
        }
      }, 1000);
    },
    sendPlayerPos(positionData) {
      console.log(`Pos emit: ${positionData.pos}: ${positionData.paragraph}`);
    },
    sendFinishEvent(stats) {
      // TODO: send finish stats to server
      console.log("you finished", stats);
    },
    requestInitiation(sessionId) {
      // TODO: use session id
      this.init(this.getSessionInfo());
      return sessionId;
    },

    // Socket listeners
    init(data) {
      this.sessionInfo = data;
      this.state = this.sessionInfo.state;
      this.text = this.sessionInfo.text;
    },
    update(data) {
      if (this.state !== data.state) {
        console.error(`You have bad state, server state ${data.state}, your state: ${this.state}`);
      }
      this.playersPos = data.playersPos;
    },
    start() {
      this.state = "started";

      // TODO: remove pseudo players in prod version
      let ppos = 0;
      let ppar = 0;
      let pseudoPlayerIntervalId = setInterval(() => {
          this.update({
            state: "started",
            playersPos: {
              [ppar]: {
                2: ppos,
                3: (ppos - 1) % this.text[ppar].length
              }
            }
          });

          ppos++;
          if (ppos === this.text[ppar].length) {
            ppos = 0;
            ppar++;
            if (ppar === this.text.length) {
              this.finishAll({
                you_are_looser: true
              });
              clearInterval(pseudoPlayerIntervalId);
            }
          }
      }, 50);
      // setTimeout(() => {
      //   clearInterval(pseudoPlayerIntervalId);
      //   this.finish({});
      // }, 10000);
    },
    finishBefore(stats) {
      this.state = "finished-before";
      this.sendFinishEvent(stats);
    },
    finishAll(results) {
      this.state = "finished-all";
      this.results = results;
    }
  },
  created() {
    // TODO: implement sockets and backend
    let sessionId = this.$route.params.id;
    if (sessionId) {
      this.state = "create-session";
      // TODO: implement session creation
    } else {
      this.requestInitiation(sessionId);
    }
  }
};
</script>

<style scoped>

</style>