<template>
  <div>
    <div class="q-pa-md">
      <div class="row q-ma-sm justify-between">
        <span class="text-h4">Monthly Planner</span>
      </div>
      <div class="row q-ma-sm">
        <PlannerCard
          v-for="week in Object.keys(groupByWeek)"
          :key="week"
          :items="groupByWeek[week]">
          <template v-slot:title>
            <span class="text-h5">
              Week {{ week }}
            </span>
          </template>
        </PlannerCard>
      </div>
    </div>
  </div>
  <q-dialog v-model="editForm">
    <EditForm />
  </q-dialog>
</template>
<script>
import {
  getWeekOfMonth,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { ref } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import EditForm from '@/views/budget/forms/EditForm.vue';
import PlannerCard from './components/planner/PlannerCard.vue';

export default {
  name: 'MonthlyPlanner',

  setup() {
    return {
      editForm: ref(false),
    };
  },

  components: {
    PlannerCard,
    EditForm,
  },

  data() {
    return {
      groupByWeek: {},
    };
  },

  computed: {
    ...mapGetters([
      'budgetList',
    ]),
  },

  methods: {
    ...mapActions([
      'fetchBudgetUsage',
    ]),
  },

  watch: {
    budgetList() {
      const filteredBudget = this.budgetList.filter((item) => (
        (new Date(item.budgetDate) >= startOfMonth(new Date()))
          && (new Date(item.budgetDate) <= endOfMonth(new Date()))
      ));
      const grouped = {};
      filteredBudget.forEach((item) => {
        const weekNum = getWeekOfMonth(
          new Date(item.budgetDate),
          { weekStartsOn: 1 },
        );
        if (weekNum in grouped) {
          grouped[weekNum].push(item);
        } else {
          grouped[weekNum] = new Array(item);
        }
      });
      this.groupByWeek = grouped;
    },
  },
};
</script>
