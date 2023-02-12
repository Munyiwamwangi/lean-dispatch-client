<template>
  <v-navigation-drawer v-model="drawerShowing" app class="mainBox">
    <v-card class="mainBox justify-center">
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img
              src="https://randomuser.me/api/portraits/women/85.jpg"
            ></v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              Sandra Odera
            </v-list-item-title>
            <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

    <v-divider></v-divider>

    <v-list v-model="selectedItem" dense rounded>
      <v-list-item-group v-model="selectedItem" color="white" class="cont">
        <div v-for="(item, i) in items" :key="i">
          <v-list-item :to="{ name: item.name }" class="item">
            <v-list-item-icon>
              <v-icon color="black">{{ item.icon }} </v-icon>
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
        icon: "mdi-view-dashboard",
        name: "hr-dashboard",
        page: "/hr/dashboard",
        employee: true,
        hr: true,
      },
      {
        text: "Account Management",
        icon: "mdi-account",
        name: "accounts",
        employee: true,
      },
      {
        text: "Order Management",
        icon: "mdi-account-multiple",
        name: "login",
        employee: true,
      },
      // {
      //   text: "Reports",
      //   icon: "mdi-ticket",
      //   name: "hr-bonuses",
      //   hr: true,
      //   approver: true,
      // },

      // {
      //   text: 'Approvals',
      //   icon: 'mdi-clipboard-list-outline',
      //   name: 'employees-bonus-tracker',
      //   hr: true,
      //   employee: false,
      // },
      // {
      //   text: 'Calendar',
      //   icon: 'mdi-file-sign',
      //   name: 'calendar',
      //   hr: true,
      //   approver: true,
      // },
      // {
      //   text: 'Reports',
      //   icon: 'mdi-ticket-outline',
      //   name: 'hr-bonuses',
      //   hr: true,
      //   approver: true,
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
  mix-blend-mode: color-blend;
}
.item {
  transition: 0.3s;
}
.cont:hover > :not(:hover) {
  opacity: 0.4;
  color: white;
}
</style>
