<template>
  <div>
    <div class="q-pa-md">
      <div class="row q-ma-sm justify-between">
        <span class="text-h4">Monthly Planner</span>
      </div>
      <div class="row q-ma-sm">
        <PlannerCard />
      </div>
    </div>
  </div>
</template>
<script>
import PlannerCard from './components/planner/PlannerCard.vue';

export default {
  name: 'MonthlyPlanner',

  components: {
    PlannerCard,
  },
};
</script>
