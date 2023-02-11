export default {
  data() {},
  methods: {
    // sidebar filter methods extracted from bonus-tracker
    filterByHireDateRange(employee) {
      let firstDate = this.filterDateRange[0];
      let secondDate = this.filterDateRange[1];
      let startDate;
      let endDate;

      // order the dates depending on what was clicked first
      if (firstDate && secondDate) {
        startDate =
          new Date(firstDate) < new Date(secondDate)
            ? new Date(firstDate)
            : new Date(secondDate);
        endDate =
          new Date(secondDate) < new Date(firstDate)
            ? new Date(firstDate)
            : new Date(secondDate);
      }

      if (firstDate && secondDate === undefined) {
        startDate = new Date(firstDate);
      }

      let hireDate = new Date(employee.hire_date);

      if (startDate !== undefined && endDate !== undefined) {
        return new Date(startDate) <= hireDate && hireDate <= new Date(endDate);
      }
      if (startDate !== undefined && endDate === undefined) {
        return new Date(startDate) <= hireDate;
      }
      return true;
    },

    filterByCompany(employee) {
      return employee.company
        .toLowerCase()
        .includes(this.filterCompany.toLowerCase());
    },

    filterByEmployeeType(employee) {
      return employee.employee_type
        .toLowerCase()
        .includes(this.filterEmployeeType.toLowerCase());
    },

    filterByEmployeeName(employee) {
      return employee.employee_name
        .toLowerCase()
        .includes(this.filterEmployeeName.toLowerCase());
    },

    filterByBonusCode(bonus) {
      return bonus.bonus_code
        .toLowerCase()
        .includes(this.filterBonusCode.toLowerCase());
    },

    filterByStatus(bonus) {
      return bonus.status === this.filterStatus;
    },
  },
};
