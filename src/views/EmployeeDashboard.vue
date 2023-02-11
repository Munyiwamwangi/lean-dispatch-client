<template>
  <div>
    <MyAssignedBonusesTable></MyAssignedBonusesTable>
  </div>
</template>

<script>
import MyAssignedBonusesTable from "../components/MyAssignedBonusesTable.vue";

export default {
  name: "EmployeeDashboard",
  components: { MyAssignedBonusesTable },
};
</script>

<style lang="scss" scoped></style>
