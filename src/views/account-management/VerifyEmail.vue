<template>
    <v-container>
        <v-row align="center" justify="center">
            <v-col order-md="1" cols="12" md="6">
                <v-card style="padding: 20%" class="elevation-6 mt-15">
                    <v-col class="card-content" align="center">
                        <v-card-title>{{ message }}</v-card-title>
                    </v-col>
                    <v-col class="card-content" align="center">
                        <v-progress-circular :indeterminate="loading" color="blue"></v-progress-circular>
                    </v-col>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "VerifyPassword",

    mounted() {
        this.verifyEmail()
    },

    data() {
        return {
            loading: true,
            message: "Veryfying Email..."
        }
    },

    methods: {
        async verifyEmail() {
            this.loading = true
            const token = this.$route.params.token;
            try {
                const { data } = await this.$http.get("api/auth/verify-email?token=" + token);
                this.message = data.message
                this.$store.dispatch("setError", { color: "green lighten-1", text: data.message });
                this.$router.push("/login");
            } catch (error) {
                this.message = error.data.message
                return error;
            } finally {
                this.loading = false
            }
        },
    },
};
</script>

<style lang="scss" scoped></style>
