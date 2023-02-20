<template>
  <v-navigation-drawer v-model="drawerShowing" app class="mainBox">
    <v-container class="">
      <v-row align="center" no-gutters>
        <v-col>
          <div class="pa-2 ma-2">
            <v-card class="mainBox">
              <v-list-item class="px-2">
                <v-row align="center" no-gutters> </v-row>
                <v-list-item-avatar>
                  <v-img
                    src="https://randomuser.me/api/portraits/women/85.jpg"
                  ></v-img>
                </v-list-item-avatar>
                <v-row align="center" no-gutters> </v-row>
              </v-list-item>

              <v-list-item link>
                <v-list-item-content>
                  <v-list-item-title class="text-h6 text-center">
                    Sandra Odera
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-center"
                    >sandra_a88@gmail.com</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>

    <v-list v-model="selectedItem" dense rounded>
      <v-list-item-group v-model="selectedItem" color="white" class="cont">
        <div v-for="(item, i) in items" :key="i">
          <v-list-item :to="{ name: item.name }" class="item">
            <v-list-item-icon>
              <v-icon>{{ item.icon }} </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title
                class="font-weight-bold text-capitalize"
                v-text="$t(item.text)"
              >
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
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

    items: [
      {
        text: "Dashboard",
        icon: "dashboard",
        name: "dashboard",
        employee: true,
        hr: true,
      },
      // {
      //   text: "Account Management",
      //   icon: "dashboard",
      //   name: "accounts",
      //   employee: true,
      // },
      // {
      //   text: "login page",
      //   icon: "flag",
      //   name: "login",
      //   employee: true,
      // },
    ],
  }),

  computed: {
    employeeData() {
      return this.$store.state.employeeData || {};
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
