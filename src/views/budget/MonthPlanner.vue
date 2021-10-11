<template>
  <div>
    <div class="q-pa-md">
      <div class="row q-ma-sm justify-between">
        <span class="text-h4">Monthly Planner</span>
      </div>
      <div class="row q-ma-sm">
        <PlannerCard
          :items="budgetList.slice(0, 10)"
        >
        <template v-slot:title>
          <span class="text-h5">
            Week 1
          </span>
        </template>
        </PlannerCard>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import PlannerCard from './components/planner/PlannerCard.vue';

export default {
  name: 'MonthlyPlanner',

  components: {
    PlannerCard,
  },

  computed: {
    ...mapGetters([
      'budgetList',
    ]),
  },
};
</script>
