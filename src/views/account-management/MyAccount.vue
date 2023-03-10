<template>
  <div>
    <v-toolbar color="#f8f8f8" dense elevation="1">
      <v-toolbar-title class="text-subtitle-2 text-capitalize">
        {{ $t("My Account") }}
      </v-toolbar-title>
    </v-toolbar>

    <v-container>
      <EmployeeDetailsCard :user="user"></EmployeeDetailsCard>
    </v-container>
  </div>
</template>

<script>
import EmployeeDetailsCard from "@/components/EmployeeDetailsCard.vue";

export default {
  name: "MyAccount",
  components: {
    EmployeeDetailsCard,
  },

  data: () => ({
    drawer: null,
  }),

  computed: {
    initials() {
      return (
        this.$store.state.currentUser.first_name[0] +
        this.$store.state.currentUser.first_name[0]
      );
    },
    user() {
      return this.$store.state.currentUser || {};
    },

    fullName() {
      return this.user.first_name + " " + this.user.last_name;
    },
  },
};
</script>
