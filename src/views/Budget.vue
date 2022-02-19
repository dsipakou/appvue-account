<template>
  <div>
    <div class="q-pa-md">
      <div class="header">
        <h4>
          Planner
        </h4>
        <q-btn outline
           label="Planner >" to='/budget/planner'/>
      </div>
      <div class="row q-mt-lg justify-left">
        <div class="col-4 q-px-md">
          <MainCategoryCard amount="123" title="Денис" />
        </div>
      </div>
      <div class="row q-mt-lg justify-left">
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
import { format } from 'date-fns';
import { getFirstDayOfMonth, getLastDayOfMonth, DATE_FORMAT } from '@/utils/dateTimeUtils';
import MainCategoryCard from '@/views/budget/components/MainCategoryCard.vue';
import WeekBudget from '@/views/budget/WeekBudget.vue';
import MonthlyBudget from '@/views/budget/MonthlyBudget.vue';

export default {
  name: 'Budget',

  components: {
    WeekBudget,
    MonthlyBudget,
    MainCategoryCard,
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
      'fetchBudgetForPeriod',
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
    this.fetchBudgetForPeriod({
      dateFrom: getFirstDayOfMonth(format(new Date(), DATE_FORMAT)),
      dateTo: getLastDayOfMonth(format(new Date(), DATE_FORMAT)),
    });
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
