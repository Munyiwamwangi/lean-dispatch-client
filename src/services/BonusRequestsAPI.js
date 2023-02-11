import api from './api';

export default {
  fetchDeclinedBonusRequests() {
    // fetches all bonus requests pending approval.
    return api
      .get('/bms/api/employees/bonus/requests/?declined=True')
      .then((response) =>
        Promise.resolve(
          response.data.map((bonus_request) => {
            return {
              id: bonus_request.id,
              approval_code: bonus_request.request_code,
              employee_name: bonus_request.employee_name,
              employee_type: bonus_request.employee_type,
              personal_id_code: bonus_request.employee_code,
              company: bonus_request.employee_company,
              request_date: bonus_request.requested_at,
              bonus_claim: bonus_request.bonus_name,
              last_modification_date: bonus_request.last_modified_at,
              all_requests: bonus_request.approval_requests,
              files: bonus_request.approval_requests[0].links,
            };
          })
        )
      )
      .catch((error) => Promise.reject(error));
  },
};
