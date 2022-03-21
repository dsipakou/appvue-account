<template>
  <div>
    <div class="header">
      <h4>
        Planner
      </h4>
      <q-btn outline
         label="Planner >" to='/budget/planner'/>
    </div>
    <div class="row justify-left">
      <div class="col-8">
        <MonthlyBudgetOld
          :budgetUsage="budgetUsage"
          :budgetPlan="budgetPlan"
          :categoryItems="categoryList"
          :createBudget="createBudget"
          :updateBudget="updateBudget"
          :deleteBudget="deleteBudget"
          :selectedMonth="budgetSelectedMonth"
          :updateStatusBudget="updateStatusBudget" />
      </div>
      <div class="col-4">
        <WeekBudget
          :budgetUsage="budgetUsage"
          :budgetPlan="budgetPlan"
          :categoryItems="categoryList"
          :transactionItems="budgetedTransactions"
          :updateBudget="updateBudget"
          :deleteBudget="deleteBudget"
          :updateStatusBudget="updateStatusBudget" />
      </div>
    </div>
    <div class="col-12">
      <MonthlyBudget
        :budgetUsage="budgetUsage"
        :budgetPlan="budgetPlan"
        :categoryItems="categoryList"
        :createBudget="createBudget"
        :updateBudget="updateBudget"
        :deleteBudget="deleteBudget"
        :selectedMonth="budgetSelectedMonth"
        :updateStatusBudget="updateStatusBudget" />
    </div>
    <div>
      <q-date
        v-model="dateModel"
        ref="budgetCal"
        @update:model-value="dateSelected"
        />
    </div>
  </div>
</template>
<script>
import { ref } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';
import { format } from 'date-fns';
import { getFirstDayOfMonth, getLastDayOfMonth, DATE_FORMAT } from '@/utils/dateTimeUtils';
import WeekBudget from '@/views/budget/WeekBudget.vue';
import MonthlyBudget from '@/views/budget/MonthlyBudget.vue';
import MonthlyBudgetOld from '@/views/budget/MonthlyBudgetOld.vue';

export default {
  name: 'Budget',

  components: {
    WeekBudget,
    MonthlyBudget,
    MonthlyBudgetOld,
  },

  setup() {
    return {
      dateModel: ref(''),
    };
  },

  computed: {
    ...mapGetters([
      'budgetPlan',
      'budgetUsage',
      'budgetedTransactions',
      'categoryList',
      'budgetSelectedMonth',
    ]),

    categories() {
      return this.categoryList.filter((item) => item.isParent);
    },
  },

  methods: {
    ...mapActions([
      'fetchBudgetUsage',
      'fetchBudgetedTransactions',
      'fetchBudgetPlan',
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
    const dateFrom = getFirstDayOfMonth(format(new Date(), DATE_FORMAT));
    const dateTo = getLastDayOfMonth(format(new Date(), DATE_FORMAT));
    this.fetchBudgetUsage({ dateFrom, dateTo });
    this.fetchBudgetPlan({ dateFrom, dateTo });
    this.fetchBudgetedTransactions({
      sorting: 'added',
      dateFrom: moment().add(-moment().weekday(), 'days').format('YYYY-MM-DD'),
      dateTo: moment().add(6 - moment().weekday(), 'days').format('YYYY-MM-DD'),
    });
  },
};
</script>
<style scoped>
.header {
  display: flex;
}

.header>h4 {
  margin-right: 20px;
}
</style>
