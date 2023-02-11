<template>
  <v-container fluid>
    <v-card elevation="1">
      <v-card-title class="secondary--text text-capitalize">
        {{ $t('helloTextTranslate') }} {{ employeeData.first_name }}
      </v-card-title>
      <v-card-text class="message">{{ message }} </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: {
    employeeData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      message: '',
    };
  },

  created() {
    this.fetchWelcomeMessage();
  },

  methods: {
    fetchWelcomeMessage() {
      const company_id = this.employeeData.company.id;
      this.$http
        .get(`bms/api/companies/${company_id}/active/welcome/message`)
        .then((res) => {
          let { welcome_text } = res.data;
          this.message = welcome_text || this.$t('noMessage') + ' 🎉';
        })
        .catch((err) => {
          if (err.status === 404) {
            this.message = this.$t('noMessage') + ' 🎉';
          }
          throw err;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
