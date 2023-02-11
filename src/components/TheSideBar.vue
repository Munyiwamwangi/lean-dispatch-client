<template>
  <v-navigation-drawer v-model="drawerShowing" app>
    <v-list>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
        </v-list-item-avatar>
      </v-list-item>

      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Sandra Adams </v-list-item-title>
          <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <div v-for="(item, i) in items" :key="i">
      <v-list nav dense>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon color="black">{{ item.icon }} </v-icon>
          </v-list-item-icon>
          <v-list-item-title> {{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
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
        name: "home",
        employee: true,
      },
      {
        text: "Staff Management",
        icon: "mdi-account-multiple",
        name: "home",
        employee: true,
      },
      {
        text: "Reports",
        icon: "mdi-ticket",
        name: "hr-bonuses",
        hr: true,
        approver: true,
      },

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
</style>
