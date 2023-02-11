<template>
  <div>
    <v-container fluid>
      <v-card flat class="pa-6">
        <template slot="progress">
          <v-progress-linear
            color="secondary"
            indeterminate
          ></v-progress-linear>
        </template>
        <v-row>
          <v-col
            v-for="(item, index) in items"
            :key="index"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              :to="{
                name: item.name,
              }"
              class="text-center ma-4"
              color="#f5f3f3"
              height="160px"
              elevation="2"
              min-width="180px"
              outlined
            >
              <v-card-text>
                <v-card-title
                  class="blue-text text-uppercase font-weight-bold justify-center"
                >
                  {{ item.text }}
                </v-card-title>
                <v-icon size="40">
                  {{ item.icon }}
                </v-icon>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'SettingsLandingComponent',
  data: () => ({
    items: [
      {
        text: 'Bonus Packages',
        icon: 'mdi-bag-personal',
        name: 'manage-bonuses',
        hr: true,
      },
      {
        text: 'Bonus Claims',
        icon: 'mdi-ticket',
        name: 'manage-packages',
        hr: true,
      },
      {
        text: 'Messaging',
        icon: 'mdi-message-cog',
        name: 'welcome-messages',
        hr: true,
      },
      {
        text: 'Roles & Permissions',
        icon: 'mdi-account-cog',
        name: 'user-groups',
        hr: true,
      },
      {
        text: 'Employees',
        icon: 'mdi-account-multiple',
        name: 'manage-employees',
        hr: true,
        approver: true,
      },
      {
        text: 'Logs',
        icon: 'mdi-semantic-web',
        name: 'manage-logs',
        hr: true,
        approver: true,
      },
    ],
  }),
};
</script>

<style lang="scss">
.blue-text {
  color: blue;
}
.v-card__title {
  padding: 25px 16px 0px 16px;
}
</style>
