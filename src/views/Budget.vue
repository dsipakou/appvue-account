<template>
  <div>
    <div class="q-pa-md">
      <div class="row q-ma-sm justify-between">
        <q-btn label="Archive" />
      </div>
      <div>
        <q-btn label="Planner" to='/budget/planner'/>
      </div>
      <div class="row q-mt-lg justify-center">
        <div class="col-8 q-px-md">
          <MonthlyBudget
            :budgetItems="budgetList"
            :categoryItems="categoryList"
            :budgetUsage="budgetUsage"
            :createBudget="createBudget"
            :updateBudget="updateBudget"
            :deleteBudget="deleteBudget"
            :updateStatusBudget="updateStatusBudget" />
        </div>
        <div class="col-4 q-px-md">
          <WeekBudget
            class="col-4 q-px-md"
            :budgetItems="budgetList"
            :categoryItems="categoryList"
            :transactionItems="budgetedTransactions"
            :updateBudget="updateBudget"
            :deleteBudget="deleteBudget"
            :updateStatusBudget="updateStatusBudget" />
        </div>
      </div>
      <div>
        <q-date
          v-model="dateModel"
          ref="budgetCal"
          @update:model-value="dateSelected"
          />
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import WeekBudget from './budget/WeekBudget.vue';
import MonthlyBudget from './budget/MonthlyBudget.vue';

export default {
  name: 'Budget',

  components: {
    WeekBudget,
    MonthlyBudget,
  },

  setup() {
    return {
      dateModel: ref(''),
    };
  },

  computed: {
    ...mapGetters([
      'budgetList',
      'budgetUsage',
      'budgetedTransactions',
      'categoryList',
    ]),

    currentMonth() {
      return this.budgetList.filter((item) => (
        moment(item.budgetDate).month() === moment().month()
      ));
    },

    categories() {
      return this.categoryList.filter((item) => item.isParent);
    },

    budgetCurrentMonth() {
      const groupedMonth = this.currentMonth.reduce((acc, item) => {
        const arr = acc[item.title] || [];
        arr.push(item);
        acc[item.title] = arr;
        return acc;
      }, {});
      return groupedMonth;
    },
  },

  methods: {
    ...mapActions([
      'fetchBudgetUsage',
      'fetchBudgetedTransactions',
      'createBudget',
      'updateBudget',
      'updateStatusBudget',
      'deleteBudget',
    ]),

    dateSelected(value) {
      const selectedDate = moment(value, 'YYYY-MM-DD');
      const fromDate = selectedDate.add(-selectedDate.day(), 'days').format('YYYY/MM/DD');
      const toDate = selectedDate.add(6 - selectedDate.day(), 'days').format('YYYY/MM/DD');
      this.dateModel = {
        from: fromDate,
        to: toDate,
      };
    },
  },

  beforeMount() {
    const dateFrom = `${moment().format('YYYY-MM')}-01`;
    const dateTo = `${moment().add(1, 'month').format('YYYY-MM')}-01`;
    this.fetchBudgetUsage({ dateFrom, dateTo });
    this.fetchBudgetedTransactions({
      sorting: 'added',
      dateFrom: moment().add(-moment().weekday(), 'days').format('YYYY-MM-DD'),
      dateTo: moment().add(6 - moment().weekday(), 'days').format('YYYY-MM-DD'),
    });
  },
};
</script>
