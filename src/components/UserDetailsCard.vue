<template>
  <v-card class="d-flex flex-column flex-md-row pa-6 mb-6" elevation="1">
    <div class="align-self-center mb-5 mb-md-0">
      <!-- avatar div -->
      <image-input v-model="avatar">
        <div slot="activator" class="pl-3">
          <v-avatar
            v-if="!avatar"
            v-ripple
            color="accent"
            size="100px"
            class="grey lighten-3 mb-3"
          >
            <v-icon color="white" x-large>mdi-account</v-icon>
            <!-- <span>Click to add avatar</span> -->
          </v-avatar>
          <v-avatar v-else v-ripple size="100px" class="mb-3">
            <img :src="avatar.imageURL" alt="avatar" />
          </v-avatar>
        </div>
      </image-input>
      <v-slide-x-transition>
        <div v-if="avatar && saved === false">
          <v-btn small class="primary" :loading="saving" @click="uploadImage">
            save avatar
          </v-btn>
        </div>
      </v-slide-x-transition>
    </div>

    <div class="mx-md-7">
      <p>
        <span class="text-subtitle-2 text-capitalize">Name:&nbsp;</span>
        <span class="text-body-2">{{ fullName }}</span>
      </p>
      <p>
        <span class="text-subtitle-2 text-capitalize"> company Name:&nbsp;</span
        ><span class="text-body-2">{{ user.company }}</span>
      </p>
      <p>
        <span class="text-subtitle-2 text-capitalize"> phone number:&nbsp;</span
        ><span class="text-body-2">{{ user.phonenumber }}</span>
      </p>
      <p>
        <span class="text-subtitle-2 text-capitalize">
          {{ $t("emailAdressText") }}:&nbsp;</span
        >
        <span class="text-body-2">{{ userDetails.email }}</span>
      </p>
    </div>

    <div class="mx-md-7">
      <p>
        <span class="text-subtitle-2 text-capitalize"> User Type:&nbsp;</span>
        <span class="text-body-2"> {{ userDetails.userType }}</span>
      </p>
      <p>
        <span class="text-subtitle-2 text-capitalize">verified:&nbsp;</span>
        <span class="text-body-2">
          {{ userDetails.verified }}
        </span>
      </p>

      <p>
        <span class="text-subtitle-2 text-capitalize"
          >registration date:&nbsp;</span
        >
        <span class="text-body-2">
          {{ user.createdAt }}
        </span>
      </p>
    </div>
  </v-card>
</template>

<script>
import ImageInput from "./ImageInput.vue";

export default {
  components: {
    ImageInput,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    drawer: null,
    avatar: null,
    saving: false,
    saved: false,
  }),

  computed: {
    userDetails() {
      return this.user || {};
    },
    fullName() {
      return this.userDetails.firstName + " " + this.userDetails.lastName;
    },
    // company() {
    //   return this.userDetails.company.name || "";
    // },
  },

  watch: {
    avatar: {
      handler: function () {
        this.saved = false;
      },
      deep: true,
    },
  },

  methods: {
    uploadImage() {
      this.saving = true;
      this.$emit("show-feedback", {
        status: "submitting",
        message: "uploading avatar",
      });

      // api call
      console.log("avatar", this.avatar);
      this.$http
        .post(`api/image/upload/`, this.avatar, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          this.$emit("show-feedback", {
            status: "success",
            message: "Avatar import successful.",
          });
        })
        .catch(() => {
          this.$emit("show-feedback", {
            status: "fail",
            message: "Avatar upload failed.",
          });
        })
        .finally(() => {});

      setTimeout(() => this.savedAvatar(), 1000);
    },
    savedAvatar() {
      this.saving = false;
      this.saved = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
