<template>
  <v-app-bar light color="white" app elevation="1">
    <v-app-bar-nav-icon @click="toggleSidebar"></v-app-bar-nav-icon>

    <v-spacer></v-spacer>

    <v-toolbar-title
      v-if="this.$vuetify.breakpoint.mdAndUp"
      class="text-uppercase accent--text font-weight-bold"
    >
      Lean Dispatch
    </v-toolbar-title>

    <v-spacer></v-spacer>
    <!-- <v-responsive>
      <v-autocomplete
        v-model="model"
        :menu-props="{ maxHeight: 500, maxWidth: 350 }"
        :label="$t('searchTextTranslate')"
        :items="searchResults"
        :search-input.sync="searchTerm"
        :loading="loading"
        clearable
        dense
        item-color="grey"
        hide-details="auto"
        append-icon=""
        prepend-inner-icon="mdi-magnify"
        single-line
        item-text="name"
        item-value="name"
        no-filter
        return-object
      >
        <template v-slot:item="data">
          <template>
            <v-list-item-avatar class="elevation-1" color="#eeeeee" size="44">
              <img :src="data.item.profile_pic" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ data.item.name }}</v-list-item-title>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
    </v-responsive> -->

    <!--  notification component  -->
    <!-- <div class="text-center white-background mr-2">
      <v-menu
        :close-on-content-click="closeOnContentClick"
        left
        bottom
        rounded
        offset-y
        min-width="490"
        max-width="490"
        max-height="700"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon color="primary" v-bind="attrs" v-on="on">
            <v-badge
              v-if="notificationMessagesCounter > 0"
              color="secondary"
              :content="notificationMessagesCounter"
              overlap
              bordered
            >
              <v-icon>mdi-bell-outline</v-icon>
            </v-badge>
            <v-icon v-else>mdi-bell-outline</v-icon>
          </v-btn>
        </template>

        <v-toolbar class="pb-0" elevation="1" dense>
          <v-toolbar-title class="title text-capitalize">
            {{ $t('notificationsText') }}</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-subheader>
            {{ $t('showUnReadMessagesOnly') }}
          </v-subheader>
          <v-switch
            v-model="toggleReadNotifications"
            inset
            hide-details
          ></v-switch>
        </v-toolbar>

        <v-toolbar elevation="1" dense>
          <v-toolbar-title class="text-uppercase">
            <pre class="caption">{{ $t('latest') }}</pre>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-title>
            <v-subheader class="hoverable" @click="markAllasRead"
              ><v-btn text small class="text-lowercase">{{
                $t('markAllAsRead')
              }}</v-btn></v-subheader
            >
          </v-toolbar-title>
        </v-toolbar>

        <v-container class="white-background">
          <v-row v-if="notificationMessages.length > 0" dense>
            <v-col
              v-for="(item, index) in notificationMessages"
              :key="item.id"
              cols="12"
              :to="{
                path: '/bonus/tracker',
                query: { name: item.id },
              }"
              pa-ma-0
            >
              <v-list ma-pa-0 flat subheader>
                <v-list-item-group>
                  <v-list-item dense>
                    <template>
                      <v-list-item-content @click="openUserBonuses(item)">
                        <v-list-item-title>
                          <h4>{{ item.message }}</h4>
                        </v-list-item-title>
                        <v-list-item-subtitle text>
                          {{ dateFormater(item.created_at) }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-tooltip left max-height="20">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              :key="item.id"
                              :value="item.read"
                              text
                              max-height="24"
                              max-width="24"
                              x-small
                              fab
                              v-bind="attrs"
                              v-on="on"
                              @click="readAndUnreadItems(item)"
                            >
                              <v-avatar size="25">
                                <span v-if="item.read === false">
                                  <v-avatar color="primary" size="6">
                                    <span class="white--text text-h5"></span>
                                  </v-avatar>
                                </span>
                              </v-avatar>
                            </v-btn>
                          </template>
                          <span v-if="item.read">Mark as unread</span>
                          <span v-else>Mark as read</span>
                        </v-tooltip>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <v-divider :key="index" :inset="item.inset"></v-divider>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col class="empty-notifications">
              <pre>
               {{ $t('noUnreadMessages') }}
                </pre
              >
            </v-col>
          </v-row>
        </v-container>
      </v-menu>
    </div> -->

    <!-- notification  ends -->

    <v-menu left bottom rounded offset-y min-width="200px">
      <template v-slot:activator="{ on, attrs }">
        <div
          v-if="$vuetify.breakpoint.mdAndUp"
          v-bind="attrs"
          class="d-flex flex-row"
          v-on="on"
        >
          <v-btn icon>
            <v-avatar class="mainBox">
              <v-img :src="employeeData.profile_pic" :alt="fullName">
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-icon color="white">mdi-account</v-icon>
                  </v-row>
                </template>
              </v-img>
            </v-avatar>
          </v-btn>
          <v-icon color="accent" class="pl-3">mdi-menu-down</v-icon>
        </div>
        <v-btn
          v-if="$vuetify.breakpoint.smAndDown"
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon color="accent">mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-list-item-content class="justify-center">
          <div class="mx-auto text-center">
            <v-card-text>
              <v-avatar class="mainBox">
                <v-img :src="employeeData.profile_pic" alt="John">
                  <template v-slot:placeholder>
                    <v-icon color="white">mdi-account</v-icon>
                  </template>
                </v-img>
              </v-avatar>
              <h3>{{ fullName }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
            </v-card-text>

            <v-divider class="my-3"></v-divider>
            <v-btn depressed rounded text text-capitalize to="/my-account">
              {{ $t("myAccountTranslation") }}
            </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn depressed rounded text @click="logout()">
              {{ $t("logoutTranslate") }}
            </v-btn>
          </div>
        </v-list-item-content>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script allowjs="true">
import axios from "axios";
import { formatDistance, parseISO } from "date-fns";
import { searchAPI } from "@/services/modules/common.js";
import lodash from "lodash";

// import NotificationsDialog from '../components/NotificationMessage.vue';
export default {
  name: "HeaderBar",
  data() {
    return {
      searchTerm: "",
      loading: false,
      offset: true,
      closeOnContentClick: false,
      toggleReadNotifications: false,
      unreadMesssages: [],
      searchResults: [],
      model: null,
    };
  },
  computed: {
    notificationMessagesCounter() {
      return this.$store.getters["getNofiticationMessages"].filter(
        (message) => message.read == false
      ).length;
    },

    notificationMessages() {
      if (!this.toggleReadNotifications) {
        return this.$store.getters["getNofiticationMessages"];
      }

      return this.$store.getters["getNofiticationMessages"].filter(
        (message) => message.read == false
      );
    },

    user() {
      return this.$store.state.currentUser;
    },

    employeeData() {
      return {
        first_name: "joe",
        last_name: "Sunday",
        email: "odera@gmail.com",
      };
    },

    fullName() {
      return this.employeeData.first_name + " " + this.employeeData.last_name;
    },
    initials() {
      return this.employeeData.first_name[0] + this.employeeData.last_name[0];
    },
  },

  watch: {
    searchTerm() {
      this.debouncedSearch();
    },

    model(val) {
      this.redirectAfterSearch(val);
    },
  },

  methods: {
    debouncedSearch() {
      this.debouncedSearch = lodash.debounce(this.searchData, 500);
    },
    redirectAfterSearch(val) {
      console.log(val);
      if (val.group === "company") {
        this.$router.push(`/bonus/tracker/?name=${val.name}`);
      } else {
        this.$router.push(`/bonus/tracker/employee/${val.id}`);
      }
    },

    openUserBonuses(messageItem) {
      this.$router.push(`/bonus/tracker/employee/${this.employeeData.id}`);
      this.$emit("readOneMessageInstance", messageItem);
      this.closeOnContentClick = true;
    },

    readAndUnreadItems(messageItem) {
      this.$emit("readAndUnreadItems", messageItem);
    },

    dateFormater(dateVal) {
      return formatDistance(parseISO(dateVal), new Date(), {
        addSuffix: true,
      });
    },

    markAllasRead() {
      this.unreadMesssages = [];
      this.$emit("markAllasRead");
    },
    toggleSidebar() {
      this.$emit("toggle-sidebar");
    },

    logout() {
      axios.post("mmauth/api/logout/");
      this.$store.dispatch("logout");
    },

    // this simple search api call is here because there
    // is no need to pass or persist this data in the store
    searchData() {
      this.loading = true;
      searchAPI(this.searchTerm)
        .then((res) => {
          this.searchResults = res;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style lang="scss" scoped>
.v-autocomplete__content.v-menu__content .v-select-list {
  background-color: white;
}

.v-list-item--dense .v-list-item__title {
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1rem;
  inline-size: min-content;
}
.v-list:hover {
  background-color: #cccccc;
  .v-btn {
    border: 1px solid rgb(171, 164, 164);
  }
}

.v-btn.v-size--x-small {
  min-width: 0;
  padding: 0;
  // width: 5px;
}

.white-background {
  background-color: white;
}
.hoverable {
  text-decoration: underline;
  white-space: nowrap;
  overflow: hidden;
}
.show-active-border {
  background-color: rgb(215, 209, 209);
}
div.col.col-12 {
  padding: 0;
}
.empty-notifications {
  background-color: #cccccc;
  width: 150px;
  height: 600px;
}
.mainBox {
  background: linear-gradient(180deg, #15488f 0%, #235eb3 50%, #17396a 100%);
}
</style>
