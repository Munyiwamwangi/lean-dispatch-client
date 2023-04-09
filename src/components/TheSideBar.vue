<template>
  <v-navigation-drawer v-model="drawerShowing" app class="mainBox">
    <v-container class="">
      <v-row align="center" no-gutters>
        <v-col>
          <div class="pa-2 ma-2">
            <v-card class="mainBox">
              <!-- <v-list-item class="px-2">
                <v-row align="center" no-gutters> </v-row>
                <v-list-item-avatar>
                  <v-img
                    src="https://randomuser.me/api/portraits/women/85.jpg"
                  ></v-img>
                </v-list-item-avatar>
                <v-row align="center" no-gutters> </v-row>
              </v-list-item> -->

              <v-list-item link>
                <v-list-item-content>
                  <v-list-item-title class="text-h6 text-center">
                    Lean Dispatch
                  </v-list-item-title>
                  <!-- <v-list-item-subtitle class="text-center"
                    >sandra_a88@gmail.com
                  </v-list-item-subtitle> -->
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>

    <v-list v-model="selectedItem" dark dense class="mt-0">
      <v-list-item-group v-model="selectedItem" color="white">
        <div v-for="(item, i) in menuItems" :key="i">
          <v-list-item v-if="!item.subMenu" :key="i" :to="{ name: item.name }">
            <v-list-item-icon>
              <v-icon color="white">{{ item.icon }} </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="font-weight-bold text-capitalize"
                >{{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group
            v-else
            :key="item.text"
            :value="true"
            color="white"
            append-icon="mdi-chevron-down"
          >
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon color="white">{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="font-weight-bold text-capitalize">
                {{ item.text }}
              </v-list-item-title>
            </template>

            <v-list-item
              v-for="subLink in item.subMenu"
              :key="subLink.text"
              :to="{ name: subLink.name }"
              class="pl-12"
            >
              <!-- while this is rendered to DM -->
              <v-list-item class="pl-0 pr-0">
                <v-list-item-icon>
                  <v-icon color="white">
                    {{ subLink.icon }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold text-capitalize">
                    {{ subLink.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item>
          </v-list-group>
        </div>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  components: {},
  props: {
    drawer: Boolean,
  },
  data: () => ({
    selectedItem: 1,
    disabled: true,

    menuItems: [
      {
        text: "Dashboard",
        icon: "dashboard",
        employee: true,
        hr: true,
        subMenu: [
          {
            text: "orders",
            icon: "mdi-account",
            hr: true,
            name: "orders",
          },
          {
            text: "riders",
            icon: "mdi-account-multiple-outline",
            hr: true,
            name: "riders",
          },
          {
            text: "customers",
            icon: "mdi-account-multiple-outline",
            hr: true,
            name: "customers",
          },
        ],
      },
      {
        text: "Dashboard",
        icon: "dashboard",
        name: "my-account",
        employee: true,
        hr: true,
      },
    ],
  }),

  computed: {
    userData() {
      return localStorage.getItem("user") || {};
    },

    // #TODO: refactor this code ;

    drawerShowing: {
      get() {
        return this.drawer;
      },
      set(value) {
        this.$emit("update:drawer", value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.v-application--is-ltr .v-list-item__action:first-child,
.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: 12px;
}
.mainBox {
  background: linear-gradient(180deg, #15488f 0%, #235eb3 50%, #17396a 100%);
}
.item {
  transition: 0.3s;
}

.cont:hover {
  color: white;
}
.cont:hover > :not(:hover) {
  opacity: 0.4;
  color: white;
}
</style>
