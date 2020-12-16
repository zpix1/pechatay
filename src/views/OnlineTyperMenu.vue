<template>
  <div>
    <div v-if="isState('loading')">
      Connection to server...
    </div>
    <div v-else-if="isState('error')">
      Error: {{ error }}
    </div>
    <div v-else-if="isState('new-session')">
      <div class="g-header">New session</div>
      <div class="g-subtitle">Random text mode</div>
      <div class="g-button" @click="requestNewSession(null)">create</div>
      <div class="g-subtitle">Custom text mode</div>
      <div class="g-label">your text</div>
      <div class="g-typing" contenteditable="true" ref="userText"
           @input="userCustomText = $refs.userText.innerText"></div>
      <div :class="{ 'g-button': true, disabled: userCustomText.length < 5 || userCustomText.length > 2000 }"
           @click="requestNewSession($refs.userText.innerText)">create
      </div>
    </div>
    <div v-else>
      <!--      State: {{ state }}<br>-->
      <div>
        <div class="g-header">{{ sessionInfo.title }} {{ sessionInfo.mode === "random" ? "🎲" : "👆" }}</div>
        <div class="g-subtitle" v-if="sessionInfo.author">{{ sessionInfo.author }}</div>
        <div class="info">

          <div>
          <div v-if="isState('preparing-to-start')" class="start-button g-button">
            <div v-if="isState('preparing-to-start-server-wait')">
              Game will start NOW!
            </div>
            <div v-else>
              Starting in {{ prepareStartCountdown }}...
            </div>
          </div>

          <div v-if="isAdmin && isState('not-started')"
               class="g-button start-button"
               @click="sendPrepareStart">
            Start?
          </div>
          </div>
          players:
          <span v-for="(playerId, i) in Object.keys(sessionInfo.playersPos)" :key="playerId"
                :class="{current: playerId === userId}">
             {{ i !== 0 ? ", " : "" }} {{ sessionInfo.id2username[playerId] }}
          </span>
        </div>

        <OnlineTyper
          @finish="finishBefore"
          @position-update="sendPlayerPos"
          :userId="userId"
          :id2username="sessionInfo.id2username"
          :dummy="isState('not-started')"
          :blocked="!isState('started')"
          :text="text"
          :user-data="{}"
          :players-pos="(isState('started') || isState('finished')) ? playersPos : {}"
        />

        <div v-if="sessionInfo.winners.length !== 0">
          Results:
          <ol class="results">
            <li v-for="(winner,i) in sessionInfo.winners" :key="winner.userId" :class="{ winner: i === 0}">
              <!--              {{ winner }}-->
              <span style="font-weight: 400;">{{ winner.username }}</span> finished with {{
                winner.results.totalErrors
              }}
              errors out of {{ winner.results.totalLetters }}
              letters ({{ (winner.results.totalErrors * 100 / winner.results.totalLetters).toFixed(2) }}%).
              WPM: {{ winner.results.wpmWithFine.toFixed(0) }}.
            </li>
          </ol>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {io} from "socket.io-client";

import OnlineTyper from "@/components/OnlineTyper";

// state
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
      sessionId: "",
      socket: io(process.env.VUE_APP_SOCKETIO_URL),
      text: null,
      userId: null,
      isAdmin: null,
      state: "loading",
      sessionInfo: null,
      prepareStartCountdown: startCountdown,
      playersPos: {},
      error: "",
      userCustomText: ""
    };
  },
  methods: {
    isState(state) {
      return this.state.startsWith(state);
    },

    // Socket emitters
    requestNewSession(text) {
      this.socket.emit("new-session", text, (response) => {
        this.$router.push({
          name: "OnlineTyperMenu",
          params: {id: response.sessionId}
        });
      });
    },
    requestInitiation() {
      this.socket.emit("init", this.sessionId, this.$store.state.settings.username, (response) => {
        console.log("sessionInfo", response);
        if (response.error) {
          this.state = "error";
          this.error = response.error;
          return;
        }
        this.sessionInfo = response;
        this.userId = response.userId;
        this.isAdmin = response.isAdmin;
        this.state = response.state;
        this.init();
      });
    },
    sendPrepareStart() {
      this.socket.emit("prepare-start");
      this.prepareStart();
    },
    sendPlayerPos(positionData) {
      this.socket.emit("new-position", [positionData.pos, positionData.paragraph]);
    },
    sendFinishEvent(stats) {
      console.log("you finished", stats);
      this.socket.emit("finished", stats);
    },

    // Socket listeners
    init() {
      this.text = this.sessionInfo.text;
    },
    update(data) {
      if (data.sessionInfo) {
        this.sessionInfo = data.sessionInfo;
      }

      this.playersPos = {};
      for (let p in data.playersPos) {
        if (p !== this.userId) {
          this.playersPos[p] = data.playersPos[p];
        }
      }
    },
    prepareStart() {
      this.state = "preparing-to-start";
      let intervalCode = setInterval(() => {
        this.prepareStartCountdown--;
        if (this.prepareStartCountdown === 0) {
          clearInterval(intervalCode);
          this.prepareStartCountdown = startCountdown;
          if (this.state === "preparing-to-start") {
            this.state = "preparing-to-start-server-wait";
          }
        }
      }, 1000);
    },
    start() {
      this.state = "started";

      this.prepareStartCountdown = 0;

      // TODO: remove pseudo players in prod version
      // let ppos = 0;
      // let ppar = 0;
      // let pseudoPlayerIntervalId = setInterval(() => {
      //   this.update({
      //     state: "started",
      //     playersPos: {
      //       [ppar]: {
      //         2: ppos,
      //         3: (ppos - 1) % this.text[ppar].length
      //       }
      //     }
      //   });
      //
      //   ppos++;
      //   if (ppos === this.text[ppar].length) {
      //     ppos = 0;
      //     ppar++;
      //     if (ppar === this.text.length) {
      //       this.finishAll({
      //         you_are_looser: true
      //       });
      //       clearInterval(pseudoPlayerIntervalId);
      //     }
      //   }
      // }, 50);
      // setTimeout(() => {
      //   clearInterval(pseudoPlayerIntervalId);
      //   this.finish({});
      // }, 10000);
    },
    finishBefore(stats) {
      this.state = "finished";
      this.sendFinishEvent(stats);
    }
  },
  created() {
    this.sessionId = this.$route.params.id;
    this.socket.on("connect", () => {
      if (this.sessionId === "new") {
        this.state = "new-session";
      } else {
        this.requestInitiation();
        this.socket.on("update", this.update);
        this.socket.on("prepare-start", this.prepareStart);
        this.socket.on("start", this.start);
      }
    });
  },
  unmounted() {
    this.socket.disconnect();
  },
  computed: {
    playersList() {
      let res = [];
      for (let p in this.sessionInfo.playersPos) {
        res.push(this.sessionInfo.id2username[p]);
      }
      return res;
    }
  }
};
</script>

<style scoped>
.winner:before {
  content: "🥇";
}

.current {
  font-weight: 400;
}

.results {
  margin-top: 10px;
}

.info {
  margin-bottom: 20px;
}
.start-button {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>