<template>
  <div>
    <div v-if="isState('loading')">
      Loading...
    </div>
    <div v-else>
      State: {{ state }}<br>
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
             @click="sendPrepareStart">
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
      sessionId: "13ccd9ab-c1cc-4c0e-84d0-a825dd6ebb6b",
      socket: io(process.env.VUE_APP_SOCKETIO_URL),
      text: null,
      usedData: {},
      state: "loading",
      sessionInfo: null,
      prepareStartCountdown: startCountdown,
      playersPos: {},
      results: null,
      loading: true
    };
  },
  methods: {
    isState(state) {
      return this.state.startsWith(state);
    },

    // Socket emitters
    requestNewSession() {
      this.socket.emit("new-session", (response) => {
        this.sessionId = response.sid;
      });
    },
    requestInitiation() {
      // TODO: use session id
      this.socket.emit("init", this.sessionId, (response) => {
        console.log("sessionInfo", response);
        this.sessionInfo = response;
        this.state = response.state;
        this.init();
      });
    },
    sendPrepareStart() {
      this.socket.emit("prepare-start");
      this.prepareStart();
    },
    sendPlayerPos(positionData) {
      console.log(`Pos emit: ${positionData.pos}: ${positionData.paragraph}`);
      this.socket.emit("new-position", [positionData.pos, positionData.paragraph]);
    },
    sendFinishEvent() {
      console.log("you finished", this.userData);
      this.socket.emit("finished", this.userData);
    },

    // Socket listeners
    init() {
      this.text = this.sessionInfo.text;
    },
    update(data) {
      if (this.state !== data.state) {
        console.error(`You have bad state, server state ${data.state}, your state: ${this.state}`);
      }
      // console.log("alive", data);
      this.playersPos = {};
      for (let p in data.playersPos) {
        if (p !== this.sessionInfo.myId) {
          this.playersPos[p] = data.playersPos[p];
        }
      }

      if (data.sessionInfo) {
        this.sessionInfo = data.sessionInfo;
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
      this.requestInitiation();
      this.socket.on("update", this.update);
      this.socket.on("prepare-start", this.prepareStart);
      this.socket.on("finish-all", this.finishAll);
      this.socket.on("start", this.start);
    }
  }
};
</script>

<style scoped>

</style>