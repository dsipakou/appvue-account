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
          :items="groupByWeek[week]"
          :categoryItems="categoryList"
          :updateBudget="updateBudget"
          :deleteBudget="deleteBudget"
          @editBudgetClick="editBudgetClick($event)">
          <template v-slot:title>
            <span class="text-h5">
              Week {{ week }}
            </span>
          </template>
        </PlannerCard>
      </div>
    </div>
  </div>
  <q-dialog v-model="createForm">
    <AddForm
      :categories="categories"
      :createBudget="createBudget"
      :budget="budgetCopy"
    />
  </q-dialog>
  <q-dialog v-model="editForm">
    <EditForm
      :categories="categories"
      :item="selectedBudget"
      :updateBudget="updateBudget"
      :deleteBudget="deleteBudget"
      @closeForm="editForm = false"
      @duplicateClick="createForm = true"
    />
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

  components: {
    PlannerCard,
    EditForm,
  },

  setup() {
    return {
      createForm: ref(false),
      editForm: ref(false),
    };
  },

  data() {
    return {
      groupByWeek: {},
      selectedBudget: {},
    };
  },

  computed: {
    ...mapGetters([
      'budgetList',
      'categoryList',
    ]),

    categories() {
      return this.categoryList.filter((item) => item.isParent);
    },
  },

  methods: {
    ...mapActions([
      'fetchBudgetUsage',
      'fetchCategories',
      'updateBudget',
      'deleteBudget',
    ]),

    editBudgetClick(item) {
      this.selectedBudget = item;
      this.editForm = true;
    },
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
