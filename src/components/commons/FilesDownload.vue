<template>
  <v-badge
    color="accent"
    overlap
    :content="item.files.length"
    offset-y="20"
    offset-x="10"
  >
    <v-btn icon :loading="downloading" @click="downloadFiles()">
      <v-icon>mdi-cloud-download</v-icon>
    </v-btn>
  </v-badge>
</template>

<script>
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import axios from 'axios';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      downloading: false,
      bonus_request: this.item,
    };
  },
  methods: {
    getFile(url) {
      return new Promise((resolve, reject) => {
        axios
          .get(url, { responseType: 'arraybuffer' })
          .then((data) => {
            resolve(data.data);
          })
          .catch((error) => {
            reject(error.toString());
          });
      });
    },
    downloadFiles() {
      this.downloading = true;
      const urls = this.bonus_request.files;
      const zip = new JSZip();
      const cache = {};
      const promises = [];
      urls.forEach((item) => {
        const promise = this.getFile(item).then((data) => {
          // Download the file and save it as an ArrayBuffer object
          const arr_name = item.split('/');
          const file_name = arr_name[arr_name.length - 1]; // get the file name
          zip.file(file_name, data, { binary: true }); // add files one by one
          cache[file_name] = data;
        });
        promises.push(promise);
      });
      Promise.all(promises).then(() => {
        zip
          .generateAsync({ type: 'blob' })
          .then((content) => {
            // Generate a binary stream
            // TODO: Replace with request code.
            let zipName = Date.now() + '.zip';
            FileSaver.saveAs(content, zipName); // Save the file with file-saver Custom file name
          })
          .finally(() => {
            this.downloading = false;
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
