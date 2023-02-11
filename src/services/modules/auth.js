import api from '../api';

export default {
  login() {
    api
      .post('mmauth/api/login/')
      .then((res) => {
        Promise.resolve(res.data);
      })
      .catch((err) => {
        Promise.reject(err);
      });
  },
};
