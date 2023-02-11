<template>
  <v-app id="app">
    <!-- <div v-if="notAuthPage"> -->
    <TheSideBar :drawer.sync="drawer"></TheSideBar>
    <TheHeaderBar
      :title="title"
      @toggle-sidebar="toggleSidebar"
      @markAllasRead="markAllasRead"
      @readOneMessageInstance="readOneMessageInstance"
      @readAndUnreadItems="readAndUnreadItems"
    ></TheHeaderBar>
    <!-- </div> -->

    <v-main>
      <router-view />
    </v-main>

    <FeedbackSnackBar
      :show-snack.sync="showError.feedbackSnackShowing"
      :snack-text="showError.feedbackSnackText"
      :snack-color="showError.feedbackSnackColor"
    ></FeedbackSnackBar>
  </v-app>
</template>

<script>
import TheSideBar from "@/components/TheSideBar.vue";
import TheHeaderBar from "@/components/TheHeaderBar.vue";
import FeedbackSnackBar from "@/components/FeedbackSnackBar";
// import config from "@/config.js";

export default {
  components: { TheSideBar, TheHeaderBar, FeedbackSnackBar },
  data() {
    return {
      prompt: false,
      drawer: null,
      notificationMessages: [],
      protocol: window.location.protocol === "https:" ? "wss" : "ws",
      connection: null,
    };
  },

  // computed: {
  //   employeeData() {
  //     return this.$store.state.employeeData || {};
  //   },
  //   userInfo() {
  //     return this.$store.state.employeeData || {};
  //   },

  //   notAuthPage() {
  //     return this.$route.meta.requiresAuth !== undefined;
  //   },
  //   title() {
  //     if (
  //       this.employeeData.user_group.some(
  //         (_property) => _property.title == 'group_hr'
  //       ) ||
  //       this.employeeData.user_group.some(
  //         (_property) => _property.title == 'company_hr'
  //       )
  //     ) {
  //       return 'mainHrDashTitle';
  //     } else if (
  //       this.employeeData.user_group.some(
  //         (_property) => _property.title === 'approver'
  //       )
  //     ) {
  //       return 'approverDashboard';
  //     }
  //     return 'mainEmployeeDashboard';
  //   },
  // },

  watch: {
    notificationMessages: {
      immediate: true,
      deep: true,
      handler(val) {
        this.$store.dispatch("notificationsReceiver", val);
      },
    },
  },

  // updated() {
  //   if (this.$workbox) {
  //     this.$workbox.addEventListener('waiting', () => {
  //       this.showUpdateUI = true;
  //     });
  //   }

  //   // WEBSOCKET
  //   this.connection = new WebSocket(
  //     `${this.protocol}://${config.BACKEND_SERVICE}/ws/chat/${this.userInfo.id}/`
  //   );
  //   // on open
  //   this.connection.onopen = () => {
  //     this.updateMessagesList();
  //   };
  //   //on message
  //   // console.info('connection ', this.connection);
  //   this.connection.onmessage = (event) => {
  //     let newMessages = JSON.parse(event.data)['message'].messages;
  //     if (newMessages.length === 0 || newMessages.length === 1) {
  //       this.notificationMessages =
  //         this.notificationMessages.concat(newMessages);
  //     } else {
  //       this.notificationMessages = newMessages;
  //     }
  //   };
  //   //  WEBSOCKET ENDS
  // },

  methods: {
    async update() {
      this.prompt = false;
      await this.$workbox.messageSW({ type: "SKIP_WAITING" });
    },

    toggleSidebar() {
      this.drawer = !this.drawer;
    },

    markAllasRead() {
      this.connection.send(
        JSON.stringify({
          command: "patch_to_read_all_messages",
          owner: this.userInfo.id,
        })
      );
      this.updateMessagesList();
    },

    readOneMessageInstance(messageItem) {
      this.connection.send(
        JSON.stringify({
          command: "patch_read_one_messages",
          id: messageItem.id,
        })
      );
      this.updateMessagesList();
    },

    readAndUnreadItems(messageItem) {
      this.connection.send(
        JSON.stringify({
          command: "read_and_unread_message_items",
          id: messageItem.id,
          status: !messageItem.read,
        })
      );
      this.updateMessagesList();
    },

    updateMessagesList() {
      this.connection.send(
        JSON.stringify({ command: "fetch_messages", owner: this.userInfo.id })
      );

      console.log("Successfully connected to the echo websocket server...");
    },

    showError() {
      if (
        this.$router.currentRoute.path === "/" ||
        this.$router.currentRoute.path === "/login"
      ) {
        return {
          feedbackSnackShowing: false,
          feedbackSnackColor: "",
          feedbackSnackText: "",
        };
      }
      const error = this.$store.getters["getError"];
      return error;
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}

.v-label {
  font-size: 13px !important;
}

.update-dialog {
  position: fixed;
  left: 50%;
  bottom: 64px;
  transform: translateX(-50%);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  padding: 12px;
  max-width: 576px;
  color: white;
  background-color: #2c3e50;
  text-align: left;
  &__actions {
    display: flex;
    margin-top: 8px;
  }
  &__button {
    margin-right: 8px;
    &--confirm {
      margin-left: auto;
    }
  }
}

@import "@/design/index.scss";
</style>
